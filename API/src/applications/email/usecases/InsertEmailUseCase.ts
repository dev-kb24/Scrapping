import { EmailRepository } from '../../../domain/repositories/EmailRepository';
import { Email } from '../../../domain/entities/Email';

export class InsertEmailUseCase {
  constructor(private repo: EmailRepository) {}

  async execute(email: Email): Promise<void> {
    await this.repo.insert(email);
  }
}