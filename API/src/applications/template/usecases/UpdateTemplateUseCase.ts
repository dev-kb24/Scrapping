import { TemplateRepository } from '../../../domain/repositories/TemplateRepository';
import { Template } from '../../../domain/entities/Template';

export class UpdateTemplateUseCase {
  constructor(private repo: TemplateRepository) {}

  async execute(template: Template, id: number): Promise<void> {
    await this.repo.update(template, id);
  }
}