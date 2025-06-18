import { Request, Response } from 'express';
import { UpdateEtablissementUseCase } from '../../applications/etablissements/usecases/UpdateEtablissementUseCase';
import { SendEmailUseCase } from '../../applications/email/usecases/SendEmailUseCase';

export class EmailController {
  constructor(
    private updateEtablissementUseCase: UpdateEtablissementUseCase,
    private sendEmailUseCase: SendEmailUseCase
) {}

  sendEmail = async (req: Request, res: Response) => {
    try {
      const {from, to, subject, text} = req.body;
      await this.sendEmailUseCase.execute(from,to,subject,text);
      res.status(200).json('email envoyé !');
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi du mail', message: error.message });
    }
  };
}