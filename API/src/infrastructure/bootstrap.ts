import express from 'express';
import 'dotenv/config';
import {EtablissementRouter} from '../interfaces/routes/EtablissementRoutes';
import { BatchRouter } from '../interfaces/routes/BatchRoutes';
import { MysqlEtablissementRepository } from '../infrastructure/database/MysqlEtablissementRepository';
import { dbConfig } from '../config/database';
import cors from 'cors';

export class Bootstrap {
    startApp = async () => {
        const app = express();
        const PORT = process.env.PORT || 3000;
        const repo = new MysqlEtablissementRepository(dbConfig);
        await repo.initEstablishement();
        const etablissementRouter = new EtablissementRouter(repo);
        const batchRouter = new BatchRouter(repo);
        app.use(cors({
          origin: 'http://localhost:5173', // autorise ton front
          credentials: true
        }));
        app.use(express.json());
        app.use('/api', etablissementRouter.getRoutes());
        app.use('/api', batchRouter.getRoutes());
        
        app.listen(PORT, () => {
          console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });
    }
}