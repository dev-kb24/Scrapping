import { Request, Response } from 'express';
import { GetAllScrapeUseCase } from '../../applications/scrapes/usecases/GetAllScrapeUseCase';
import { Scrape } from '../../domain/entities/Scrape';
import { InsertScrapeUseCase } from '../../applications/scrapes/usecases/InsertScrapeUseCase';

export class ScrapeController {
  constructor(
    private getAllScrapeUseCase: GetAllScrapeUseCase,
    private insertScrapeUseCase: InsertScrapeUseCase
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

  insert = async (req: Request, res: Response) => {
    try {
      const { name, keyword, city } = req.body;
      const scrape = new Scrape('0', name, keyword, city, 'in progress');
      await this.insertScrapeUseCase.execute(scrape);
      res.status(201).json({ message: 'Scraping en cours' });
    } catch (error: any) {
      res.status(500).json({ error: 'Erreur lors de l\'insertion', message: error.message });
    }
  };
}