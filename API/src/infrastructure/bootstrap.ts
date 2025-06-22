import express from 'express';
import 'dotenv/config';
import {EtablissementRouter} from '../interfaces/routes/EtablissementRoutes';
import { BatchRouter } from '../interfaces/routes/BatchRoutes';
import { MysqlEtablissementRepository } from '../infrastructure/database/MysqlEtablissementRepository';
import { dbConfig } from '../config/database';
import cors from 'cors';
import { ScrapeRouter } from '../interfaces/routes/ScrapeRoutes';
import { MysqlScrapeRepository } from './database/MysqlScrapeRepository';
import { EmailRouter } from '../interfaces/routes/EmailRoutes';
import { EmailRepository } from './email/EmailRepository';
import { emailConfig } from '../config/email';

export class Bootstrap {
    startApp = async () => {
        const app = express();
        const PORT = process.env.PORT_BACK || 8000;
        const repoEtablissement = new MysqlEtablissementRepository(dbConfig);
        const repoScrape = new MysqlScrapeRepository(dbConfig);
        const repoEmail = new EmailRepository(emailConfig);
        await repoEtablissement.initEstablishement();
        await repoScrape.initScrape();
        const etablissementRouter = new EtablissementRouter(repoEtablissement);
        const batchRouter = new BatchRouter(repoEtablissement, repoScrape);
        const scrapeRouter = new ScrapeRouter(repoScrape);
        const emailRouter = new EmailRouter(repoEmail, repoEtablissement);
        app.use(cors({
          origin: 'http://localhost:5173',
          credentials: true
        }));
        app.use(express.json());
        app.use('/api', etablissementRouter.getRoutes());
        app.use('/api', batchRouter.getRoutes());
        app.use('/api', scrapeRouter.getRoutes());
        app.use('/api', emailRouter.getRoutes());
        
        app.listen(PORT, () => {
          console.log(`Serveur lancé sur le port ${PORT}`);
        });
    }
}
