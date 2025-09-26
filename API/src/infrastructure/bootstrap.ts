import express from 'express';
import 'dotenv/config';
import {EtablissementRouter} from '../interfaces/routes/EtablissementRoutes';
import { BatchRouter } from '../interfaces/routes/BatchRoutes';
import { MysqlEtablissementRepository } from '../infrastructure/database/MysqlEtablissementRepository';
import { dbConfig } from '../config/database';
import cors from 'cors';
import { ScrapeRouter } from '../interfaces/routes/ScrapeRoutes';
import { MysqlScrapeRepository } from './database/MysqlScrapeRepository';
import { SendEmailRouter } from '../interfaces/routes/SendEmailRoutes';
import { EmailService } from './email/EmailService';
import { MysqlEmailRepository } from './database/MysqlEmailRepository'
import { emailConfig } from '../config/email';
import { EmailRouter } from '../interfaces/routes/EmailRouter';
import { MysqlTemplateRepository } from './database/MysqlTemplateRepository';
import { TemplateRouter } from '../interfaces/routes/TemplateRouter';

export class Bootstrap {
    startApp = async () => {
        const app = express();
        const PORT = process.env.PORT_BACK || 8000;
        const repoEtablissement = new MysqlEtablissementRepository(dbConfig);
        const repoScrape = new MysqlScrapeRepository(dbConfig);
        const repoEmail = new MysqlEmailRepository(dbConfig);
        const repoTemplate = new MysqlTemplateRepository(dbConfig);
        const emailService = new EmailService(emailConfig);
        
        await repoEtablissement.initEstablishement();
        await repoScrape.initScrape();
        await repoEmail.initEmail();
        await repoTemplate.initTemplate();


        const etablissementRouter = new EtablissementRouter(repoEtablissement);
        const batchRouter = new BatchRouter(repoEtablissement, repoScrape);
        const scrapeRouter = new ScrapeRouter(repoScrape);
        const sendEmailRouter = new SendEmailRouter(emailService, repoEtablissement);
        const emailRouter = new EmailRouter(repoEmail);
        const templateRouter = new TemplateRouter(repoTemplate);

        
        app.use(cors({
          origin: 'http://localhost:5173',
          credentials: true
        }));
        app.use(express.json());
        app.use('/api', etablissementRouter.getRoutes());
        app.use('/api', batchRouter.getRoutes());
        app.use('/api', scrapeRouter.getRoutes());
        app.use('/api', sendEmailRouter.getRoutes());
        app.use('/api', emailRouter.getRoutes());
        app.use('/api', templateRouter.getRoutes());
        
        app.listen(PORT, () => {
          console.log(`Serveur lancé sur le port ${PORT}`);
        });
    }
}
