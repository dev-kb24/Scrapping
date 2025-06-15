import { Router } from 'express';
import { MysqlScrapeRepository } from '../../infrastructure/database/MysqlScrapeRepository';
import { GetAllScrapeUseCase } from '../../applications/scrapes/usecases/GetAllScrapeUseCase';
import { InsertScrapeUseCase } from '../../applications/scrapes/usecases/InsertScrapeUseCase';
import { ScrapeController } from '../controllers/ScrapeController';

export class ScrapeRouter {
    private router;
    private controller;

     constructor(repo: MysqlScrapeRepository) {
        const getAllUC: GetAllScrapeUseCase = new GetAllScrapeUseCase(repo);
        const insertUC: InsertScrapeUseCase = new InsertScrapeUseCase(repo);
        this.controller = new ScrapeController(getAllUC, insertUC);
        this.router = Router();
   }
    
     getRoutes(){
        this.router.get('/scrape', this.controller.getAll);
        this.router.post('/scrape', this.controller.insert);
        return this.router;
     }
}