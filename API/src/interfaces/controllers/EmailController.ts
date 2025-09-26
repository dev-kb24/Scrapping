import { Request, Response } from 'express';
import { InsertEmailUseCase } from '../../applications/email/usecases/InsertEmailUseCase';
import { GetAllEmailUseCase } from '../../applications/email/usecases/GetAllEmailUseCase';
import { UpdateEmailUseCase } from '../../applications/email/usecases/UpdateEmailUseCase';
import { DeleteEmailUseCase } from '../../applications/email/usecases/DeleteEmailUseCase';
import { Email } from '../../domain/entities/Email';

export class EmailController {
  constructor(
    private insertUseCase: InsertEmailUseCase,
    private getAllUseCase: GetAllEmailUseCase,
    private updateUseCase: UpdateEmailUseCase,
    private deleteUseCase: DeleteEmailUseCase
  ) {}

  insert = async (req: Request, res: Response) => {
    try {
      const { status_email, type_email, date_envoi, sujet, id_etablissement } = req.body;
      const email = new Email(0, status_email, type_email, date_envoi, sujet, id_etablissement);
      await this.insertUseCase.execute(email);
      res.status(201).json({ message: 'Email inséré' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion' });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const emails = await this.getAllUseCase.execute();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status_email, type_email, date_envoi, sujet, id_etablissement } = req.body;
      const email = new Email(Number(id), status_email, type_email, date_envoi, sujet, id_etablissement);
      await this.updateUseCase.execute(email, Number(id));
      res.status(200).json({ message: 'Email mis à jour' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour', message: error.message });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(Number(id));
      res.status(200).json({ message: 'Email supprimé!' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la suppression', message: error.message });
    }
  }
}