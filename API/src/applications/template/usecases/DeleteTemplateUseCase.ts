import { TemplateRepository } from '../../../domain/repositories/TemplateRepository';

export class DeleteTemplateUseCase {
  constructor(private repo: TemplateRepository) {}

  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}