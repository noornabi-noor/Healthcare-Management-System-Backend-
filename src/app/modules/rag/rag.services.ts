import { EmbeddingService } from "./embedding.services";
import { IndexingService } from "./indexing.services";

export class RAGService {
  private embeddingService: EmbeddingService;
  private llmService: LLMService;
  Private indexingService: IndexingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }
}   