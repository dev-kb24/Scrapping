import { Router } from 'express';
import { EtablissementController } from '../controllers/EtablissementController';
import { MysqlEtablissementRepository } from '../../infrastructure/database/MysqlEtablissementRepository';
import { InsertEtablissementUseCase } from '../../applications/usecases/InsertEtablissementUseCase';
import { GetAllEtablissementsUseCase } from '../../applications/usecases/GetAllEtablissementUseCase';
import { UpdateEtablissementUseCase } from '../../applications/usecases/UpdateEtablissementUseCase';
import { EtablissementMiddleware } from '../../infrastructure/middleware/EtablissementMiddleware';
import { DeleteEtablissementUseCase } from '../../applications/usecases/DeleteEtablissementUseCase';

export class EtablissementRouter {
    private router;
    private controller;
    private middleware;

    constructor(repo: MysqlEtablissementRepository) {
        const insertUC = new InsertEtablissementUseCase(repo);
        const getAllUC = new GetAllEtablissementsUseCase(repo);
        const updateUC = new UpdateEtablissementUseCase(repo);
        const deleteUC = new DeleteEtablissementUseCase(repo);
        this.controller = new EtablissementController(insertUC, getAllUC, updateUC, deleteUC);
        this.middleware = new EtablissementMiddleware();
        this.router = Router();
    }

    getRoutes() {
        this.router.post('/etablissements', this.middleware.validateEtablissement ,this.controller.insert);
        this.router.get('/etablissements', this.controller.getAll);
        this.router.put('/etablissements/:id', this.controller.update);
        this.router.delete('/etablissements/:id', this.controller.delete);
        return this.router;
    }
}