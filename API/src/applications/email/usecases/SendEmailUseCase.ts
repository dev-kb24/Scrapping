import { EmailInterface } from '../../../domain/interfaces/EmailInterface';

export class SendEmailUseCase {
  constructor(private repo: EmailInterface) {}

  async execute(from: string, to: string, subject: string, text: string): Promise<void> {
    await this.repo.sendMail(from,to,subject,text);
  }
}