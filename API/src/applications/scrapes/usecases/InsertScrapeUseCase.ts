import { ScrapeRepository } from '../../../domain/repositories/ScrapeRepository';
import { Scrape } from '../../../domain/entities/Scrape';

export class InsertScrapeUseCase {
  constructor(private repo: ScrapeRepository) {}

  async execute(scrape: Scrape): Promise<void> {
    await this.repo.insert(scrape);
  }
}