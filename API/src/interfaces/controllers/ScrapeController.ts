import { Request, Response } from 'express';
import { Etablissement } from '../../domain/entities/Etablissement';
import { GetAllScrapeUseCase } from '../../applications/scrapes/usecases/GetAllScrapeUseCase';
import { Scrape } from '../../domain/entities/Scrape';

export class ScrapeController {
  constructor(
    private getAllScrapeUseCase: GetAllScrapeUseCase
) {}

  getAll = async (req: Request, res: Response) => {
    try {
      const scrapes: Scrape[] = await this.getAllScrapeUseCase.execute();
      res.status(200).json(scrapes);
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ error: 'Erreur lors de la restitution des scrapping', message: error.message });
    }
  };
}