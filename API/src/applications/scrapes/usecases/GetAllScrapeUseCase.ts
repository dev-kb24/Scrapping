
import { Scrape } from '../../../domain/entities/Scrape';
import { ScrapeRepository } from '../../../domain/repositories/ScrapeRepository';

export class GetAllScrapeUseCase {
  constructor(private repo: ScrapeRepository) {}

  async execute(): Promise<Scrape[]> {
    return this.repo.getAll();
  }
}