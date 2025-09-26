import { EmailRepository } from '../../../domain/repositories/EmailRepository';

export class DeleteEmailUseCase {
  constructor(private repo: EmailRepository) {}

  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}