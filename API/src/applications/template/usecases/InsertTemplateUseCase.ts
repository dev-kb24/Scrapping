import { TemplateRepository } from '../../../domain/repositories/TemplateRepository';
import { Template } from '../../../domain/entities/Template';

export class InsertTemplateUseCase {
  constructor(private repo: TemplateRepository) {}

  async execute(template: Template): Promise<void> {
    await this.repo.insert(template);
  }
}