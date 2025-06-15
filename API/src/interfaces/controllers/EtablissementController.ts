import { Request, Response } from 'express';
import { InsertEtablissementUseCase } from '../../applications/etablissements/usecases/InsertEtablissementUseCase';
import { GetAllEtablissementsUseCase } from '../../applications/etablissements/usecases/GetAllEtablissementUseCase';
import { Etablissement } from '../../domain/entities/Etablissement';
import { UpdateEtablissementUseCase } from '../../applications/etablissements/usecases/UpdateEtablissementUseCase';
import { DeleteEtablissementUseCase } from '../../applications/etablissements/usecases/DeleteEtablissementUseCase';

export class EtablissementController {
  constructor(
    private insertUseCase: InsertEtablissementUseCase,
    private getAllUseCase: GetAllEtablissementsUseCase,
    private updateUseCase: UpdateEtablissementUseCase,
    private deleteUseCase: DeleteEtablissementUseCase
  ) {}

  insert = async (req: Request, res: Response) => {
    try {
      const { name, address, phone, website, email, siret, siren } = req.body;
      const etablissement = new Etablissement('',name, address, phone, website, email, siret, siren);
      await this.insertUseCase.execute(etablissement);
      res.status(201).json({ message: 'Etablissement inséré' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion' });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const etablissements = await this.getAllUseCase.execute();
      res.json(etablissements);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, address, phone, website, email, siret, siren } = req.body;
      const etablissement = new Etablissement(id, name, address, phone, website, email, siret, siren);
      await this.updateUseCase.execute(etablissement, id);
      res.status(200).json({ message: 'Etablissement mis à jour' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion', message: error.message });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      await this.deleteUseCase.execute(id);
      res.status(200).json({ message: 'Etablissement supprimé!' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion', message: error.message });
    }
  }
}