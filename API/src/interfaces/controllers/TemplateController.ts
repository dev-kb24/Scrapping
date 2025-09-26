import { Request, Response } from 'express';
import { InsertTemplateUseCase } from '../../applications/template/usecases/InsertTemplateUseCase';
import { GetAllTemplateUseCase } from '../../applications/template/usecases/GetAllTemplateUseCase';
import { UpdateTemplateUseCase } from '../../applications/template/usecases/UpdateTemplateUseCase';
import { DeleteTemplateUseCase } from '../../applications/template/usecases/DeleteTemplateUseCase';
import { Template } from '../../domain/entities/Template';

export class TemplateController {
  constructor(
    private insertUseCase: InsertTemplateUseCase,
    private getAllUseCase: GetAllTemplateUseCase,
    private updateUseCase: UpdateTemplateUseCase,
    private deleteUseCase: DeleteTemplateUseCase
  ) {}

  insert = async (req: Request, res: Response) => {
    try {
      const { type_template, content } = req.body;
      const template = new Template(0, type_template, content);
      await this.insertUseCase.execute(template);
      res.status(201).json({ message: 'Template inséré' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion' });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const templates = await this.getAllUseCase.execute();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { type_template, content } = req.body;
      const template = new Template(Number(id), type_template, content);
      await this.updateUseCase.execute(template, Number(id));
      res.status(200).json({ message: 'Template mis à jour' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour', message: error.message });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(Number(id));
      res.status(200).json({ message: 'Template supprimé!' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de la suppression', message: error.message });
    }
  }
}