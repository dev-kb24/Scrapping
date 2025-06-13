import { ScrapeRepository } from '../../../domain/repositories/ScrapeRepository';
import { Scrape } from '../../../domain/entities/Scrape';

export class UpdateScrapeUseCase {
  constructor(private repo: ScrapeRepository) {}

  async execute(scrape: Scrape, id: string): Promise<void> {
    await this.repo.update(scrape, id);
  }
}