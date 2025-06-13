import { Router } from 'express';
import { MysqlScrapeRepository } from '../../infrastructure/database/MysqlScrapeRepository';
import { GetAllScrapeUseCase } from '../../applications/scrapes/usecases/GetAllScrapeUseCase';
import { ScrapeController } from '../controllers/ScrapeController';

export class ScrapeRouter {
    private router;
    private controller;

     constructor(repo: MysqlScrapeRepository) {
        const getAllUC: GetAllScrapeUseCase = new GetAllScrapeUseCase(repo);
        this.controller = new ScrapeController(getAllUC);
        this.router = Router();
     }
    
     getRoutes(){
        this.router.get('/scrape', this.controller.getAll);
        return this.router;
     }
}