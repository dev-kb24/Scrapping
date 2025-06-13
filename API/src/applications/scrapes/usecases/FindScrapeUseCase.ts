import { ScrapeRepository } from '../../../domain/repositories/ScrapeRepository';
import { Scrape } from '../../../domain/entities/Scrape';

export class FindScrapeUseCase {
  constructor(private repo: ScrapeRepository) {}

  async execute(where: Record<string, string>): Promise<Scrape> {
    return await this.repo.find(where);
  }
}