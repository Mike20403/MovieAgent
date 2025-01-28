import { GOOGLE_GEMINI_API_KEY, HF_API_KEY } from "@/app/constants/common.constants";
import {
  HfInference,
} from "@huggingface/inference";
import { logger } from "../utils/logger";
import { type ClassifyIntentOutput } from "../models/movie.models";
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const hf = new HfInference(HF_API_KEY);

const intentMapping: Record<string, string> = {
  LABEL_0: "recommend_movies",
  LABEL_1: "find_movie_details",
  LABEL_2: "random_movie",
  LABEL_3: "filter_movies",
};

export class HuggingFaceService {
  private static hfInstance: HuggingFaceService | null = null;

  private constructor() {
    if (HuggingFaceService.hfInstance) {
      throw new Error(
        "Use HuggingFaceService.getInstance() to get an instance of this class."
      );
    }
  }

  // Method to get the Singleton instance
  public static get instance() {
    if (HuggingFaceService.hfInstance === null) {
      HuggingFaceService.hfInstance = new HuggingFaceService();
    }
    return HuggingFaceService.hfInstance;
  }

  // Classify intent using Hugging Face model
  public async classifyIntent(input: string): Promise<{ label: string; score: number }> {
    try {
      const response = await hf.textClassification({
        inputs: input,
        model: "KhuongMai/fine-tuned-intent-classification",
      });

      if (!response || response.length === 0) {
        throw new Error("Empty response from Hugging Face API.");
      }

      const modelLabel = response[0].label; // e.g., "LABEL_0", "LABEL_1"
      const mappedIntent = intentMapping[modelLabel] ?? "unknown";

      return { label: mappedIntent, score: response[0].score };
    } catch (error) {
      console.error("[HuggingFaceService] Error classifying intent:", error);
      throw new Error("Failed to classify intent.");
    }
  }

  // Generate a friendly response using Google Gemini model
  public async generateFriendlyResponse(prompt: string): Promise<string> {
    try {
      const result = await model.generateContent([prompt]);

      if (!result || !result.response || !result.response.text()) {
        throw new Error("Failed to generate a response.");
      }

      return result.response.text().trim();
    } catch (error) {
      console.error("[Gemini API] Error generating response:", error);
      throw new Error("Failed to generate a response.");
    }
  }

  // Identify missing slots from required fields
  public identifyMissingSlots(
    extractedSlots: Record<string, string>,
    requiredSlots: string[]
  ): string[] {
    const missingSlots = requiredSlots.filter((slot) => !extractedSlots[slot]);
    return missingSlots;
  }

  // Extract slots (entities) using Hugging Face NER model
  public async extractSlots(input: string): Promise<Record<string, string>> {
    try {
      const response = await hf.tokenClassification({
        inputs: input,
        model: "dslim/bert-base-NER",
      });

      const slots: Record<string, string> = {};

      response.forEach((entity) => {
        slots[entity.entity_group] = entity.word;
      });

      return slots;
    } catch (error) {
      console.error("[HuggingFaceService] Error extracting slots:", error);
      throw new Error("Failed to extract slots.");
    }
  }
}
