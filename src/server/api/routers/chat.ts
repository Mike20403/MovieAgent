import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { type WhereClause } from "@/server/models/db.models";
import {
  type MovieQueryResponse,
  type Recommendation,
} from "@/server/models/movie.models";
import { HuggingFaceService } from "@/server/services/hf.services";

const requiredSlotsMapping: Record<string, string[]> = {
  recommend_movies: ["genre", "minRating"],
  find_movie_details: ["movieName"],
  random_movie: [],
  filter_movies: ["minRating", "genre"],
};

export const chatRouter = createTRPCRouter({
  // Detect the intent of the user's message
  detectIntent: publicProcedure
  .input(z.object({ message: z.string().min(1) }))
  .mutation(async ({ input }) => {
    const intent = await HuggingFaceService.instance.classifyIntent(input.message);
    if (!intent) {
      return { label: "unknown", score: 0 };
    }
    return intent; // Already mapped in `HuggingFaceService`
  }),

  // Get the required slots for a specific intent
  getRequiredSlots: publicProcedure
  .input(
    z.object({
      intent: z.object({
        label: z.string().min(1),
        score: z.number().optional(),
      }),
    }),
  )
  .mutation(({ input }) => {
    const requiredSlots = requiredSlotsMapping[input.intent.label] ?? [];
    return requiredSlots;
  }),

  // Extract slots (entities) from the user's message
  extractSlots: publicProcedure
  .input(z.object({ message: z.string().min(1) }))
  .mutation(async ({ input }) => {
    const slots = await HuggingFaceService.instance.extractSlots(input.message);
    return slots;
  }),

  // Identify missing slots based on extracted slots and required slots
  identityMissingSlots: publicProcedure
  .input(
    z.object({
      extractedSlots: z.record(z.string()),
      requiredSlots: z.array(z.string()),
    }),
  )
  .mutation(async ({ input }) => {
    const missingSlots = HuggingFaceService.instance.identifyMissingSlots(
      input.extractedSlots,
      input.requiredSlots,
    );
    return missingSlots;
  }),

  // Generate a response based on any movie-related query
  generateResponse: publicProcedure
  .input(
    z.object({
      userQuery: z.string(), // User's original query
      jsonData: z.object({}).passthrough(), // Entire JSON object (e.g., movie database, filtered results, etc.)
    }),
  )
  .mutation(async ({ input }) => {
    const prompt = `You are a friendly and knowledgeable movie assistant. A user asked: "${input.userQuery}". Use the following JSON data to provide a helpful and conversational response:

JSON Data:
${JSON.stringify(input.jsonData, null, 2)}

Include only relevant details such as titles, ratings, summaries, and cast. If applicable, ask a follow-up question to engage the user further.`;

    const response = await HuggingFaceService.instance.generateFriendlyResponse(prompt);

    return response;
  }),

  // Generalized handler for multiple intents
  handleIntent: publicProcedure
  .input(
    z.object({
      intent: z.object({
        label: z.string().min(1),
        score: z.number().optional(),
      }),
      slots: z.record(z.string()),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { intent, slots } = input;

    switch (intent.label) {
      case "recommend_movies": {
        const whereClause: WhereClause = {};

        if (slots.genre) {
          whereClause.genre = slots.genre.toLowerCase();
        }
        if (slots.minRating) {
          whereClause.rating = {
            gte: Number(slots.minRating),
          };
        }

        const recommendations: Recommendation = await ctx.db.movie.findMany({
          where: whereClause,
          take: 5,
          orderBy: {
            rating: "desc",
          },
        });

        return recommendations;
      }

      case "find_movie_details": {
        const movie: MovieQueryResponse | null = await ctx.db.movie.findFirst({
          where: {
            name: {
              contains: slots.movieName,
              mode: "insensitive",
            },
          },
        });

        return movie ? [movie] : [];
      }

      case "random_movie": {
        const recommendations: Recommendation = await ctx.db.movie.findMany({
          take: 1,
          orderBy: {
            rating: "desc",
          },
        });

        return recommendations;
      }

      case "filter_movies": {
        const whereClause: WhereClause = {};

        if (slots.minRating) {
          whereClause.rating = {
            gte: Number(slots.minRating),
          };
        }
        if (slots.genre) {
          whereClause.genre = slots.genre.toLowerCase();
        }

        const recommendations: Recommendation = await ctx.db.movie.findMany({
          where: whereClause,
          take: 5,
          orderBy: {
            rating: "desc",
          },
        });

        return recommendations;
      }

      default:
        return { error: `Unsupported intent: ${intent.label}` };
    }
  }),
});
