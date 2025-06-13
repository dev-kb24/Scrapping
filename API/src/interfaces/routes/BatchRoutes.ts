import { Router } from 'express';
import { BatchController } from '../controllers/BatchController';
import { MysqlEtablissementRepository } from '../../infrastructure/database/MysqlEtablissementRepository';
import { RunBatchUseCase } from '../../applications/batch/usecases/RunBatchUseCase';
import { PagesJaunesScraper } from '../../infrastructure/scrapping/PageJaunesScraper';
import { InsertEtablissementUseCase } from '../../applications/etablissements/usecases/InsertEtablissementUseCase';
import { BatchMiddleware } from '../../infrastructure/middleware/BatchMiddleware';
import { MysqlScrapeRepository } from '../../infrastructure/database/MysqlScrapeRepository';
import { InsertScrapeUseCase } from '../../applications/scrapes/usecases/InsertScrapeUseCase';
import { UpdateScrapeUseCase } from '../../applications/scrapes/usecases/UpdateScapeUseCase';
import { FindScrapeUseCase } from '../../applications/scrapes/usecases/FindScrapeUseCase';

export class BatchRouter {
    private router;
    private controller;
    private batchMiddleware;

     constructor(repoEtablissement: MysqlEtablissementRepository, repoScrape: MysqlScrapeRepository) {
        const pagesJaunesScraper = new PagesJaunesScraper();
        const batchUseCase = new RunBatchUseCase(pagesJaunesScraper, repoEtablissement);
        const insertScrapeUseCase = new InsertScrapeUseCase(repoScrape);
        const updateScrapeUseCase = new UpdateScrapeUseCase(repoScrape);
        const findScrapeUseCase = new FindScrapeUseCase(repoScrape);
        const insertUseCase = new InsertEtablissementUseCase(repoEtablissement);
        this.batchMiddleware = new BatchMiddleware();
        this.controller = new BatchController(batchUseCase, insertUseCase, insertScrapeUseCase, updateScrapeUseCase, findScrapeUseCase);
        this.router = Router();
     }
    
     getRoutes(){
        this.router.post('/batch', this.batchMiddleware.validateBatch, this.controller.run);
        return this.router;
     }
}