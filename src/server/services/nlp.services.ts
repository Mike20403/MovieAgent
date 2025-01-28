import { type ErrorPayload } from "@/modals/errors";
import { type NLPProcessOutput } from "@/modals/nlp.modals";
import nlp from "compromise";
import type Three from "compromise/view/three";
import { logger } from "../utils/logger";

export class NLPService {
  private static _instance: NLPService;

  constructor() { }

  public static get instance(): NLPService {
    if (!this._instance) {
      this._instance = new NLPService();
      logger.info("NLPService instance created");
    }
    return this._instance;
  }

  processUserInput(input: string): NLPProcessOutput {
    logger.info(`Processing user input: "${input}"`);

    try {
      const doc: Three = nlp(input);

      // Log NLP processing
      logger.debug(`NLP Document created: ${JSON.stringify(doc)}`);

      // Extract topics and sentences
      const entities = doc.topics().out("array") as string[];
      const sentences = doc.sentences().out("array") as string[];

      logger.info("NLP processing completed successfully");
      logger.debug(`Extracted entities: ${JSON.stringify(entities)}`);
      logger.debug(`Extracted sentences: ${JSON.stringify(sentences)}`);

      return {
        entities,
        sentences,
      };
    } catch (error) {
      logger.error(
        `Error processing user input: ${(error as ErrorPayload).message}`,
      );
      throw new Error("Failed to process user input");
    }
  }
}
