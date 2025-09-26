import { EmailRepository } from '../../../domain/repositories/EmailRepository';
import { Email } from '../../../domain/entities/Email';

export class UpdateEmailUseCase {
  constructor(private repo: EmailRepository) {}

  async execute(email: Email, id: number): Promise<void> {
    await this.repo.update(email, id);
  }
}