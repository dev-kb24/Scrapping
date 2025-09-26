import { TemplateRepository } from '../../../domain/repositories/TemplateRepository';

export class GetAllTemplateUseCase {
  constructor(private repo: TemplateRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}