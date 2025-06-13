import { Request, Response } from 'express';
import { RunBatchUseCase } from '../../applications/batch/usecases/RunBatchUseCase';
import { InsertEtablissementUseCase } from '../../applications/etablissements/usecases/InsertEtablissementUseCase';
import { Etablissement } from '../../domain/entities/Etablissement';
import { InsertScrapeUseCase } from '../../applications/scrapes/usecases/InsertScrapeUseCase';
import { UpdateScrapeUseCase } from '../../applications/scrapes/usecases/UpdateScapeUseCase';
import { Scrape } from '../../domain/entities/Scrape';
import { FindScrapeUseCase } from '../../applications/scrapes/usecases/FindScrapeUseCase';

export class BatchController {
  constructor(
    private runBatchUseCase: RunBatchUseCase, 
    private insertEtablissementUseCase: InsertEtablissementUseCase,
    private insertScrapeUseCase: InsertScrapeUseCase,
    private updateScrapeUseCase: UpdateScrapeUseCase,
    private findScrapeUseCase: FindScrapeUseCase
  ) {}

  run = async (req: Request, res: Response) => {
    const {name, keyword, city } = req.body;
    let scrapeFound = null;
    try {
      const scrape: Scrape = new Scrape('0', name, keyword, city, 'in progress'); 
      await this.insertScrapeUseCase.execute(scrape);
      scrapeFound = await this.findScrapeUseCase.execute({name, keyword, city});
      const etablissements: Etablissement[] = await this.runBatchUseCase.execute(String(keyword), String(city));
      for (let etablissement of etablissements){
        await this.insertEtablissementUseCase.execute(etablissement);
      }
      scrapeFound.progress = 'success';
      await this.updateScrapeUseCase.execute(scrapeFound, scrapeFound.id);
      res.status(200).json({ message: 'Batch terminé avec succès' });
    } catch (error: any) {
      console.log(error);
      if(scrapeFound){
        scrapeFound.progress = 'failed';
        await this.updateScrapeUseCase.execute(scrapeFound, scrapeFound.id);
      }
      res.status(500).json({ error: 'Erreur lors du batch', message: error.message });
    }
  };
}