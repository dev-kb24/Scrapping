import { EmailRepository } from '../../../domain/repositories/EmailRepository';

export class GetAllEmailUseCase {
  constructor(private repo: EmailRepository) {}

  async execute() {
    return this.repo.getAll();
  }
}