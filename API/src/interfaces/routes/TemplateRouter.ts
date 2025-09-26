import { Router } from 'express';
import { TemplateController } from '../controllers/TemplateController';
import { TemplateMiddleware } from '../../infrastructure/middleware/TemplateMiddleware';
import { MysqlTemplateRepository } from '../../infrastructure/database/MysqlTemplateRepository';
import { InsertTemplateUseCase } from '../../applications/template/usecases/InsertTemplateUseCase';
import { GetAllTemplateUseCase } from '../../applications/template/usecases/GetAllTemplateUseCase';
import { UpdateTemplateUseCase } from '../../applications/template/usecases/UpdateTemplateUseCase';
import { DeleteTemplateUseCase } from '../../applications/template/usecases/DeleteTemplateUseCase';

export class TemplateRouter {
  private router: Router;

  constructor(repo: MysqlTemplateRepository) {
    const insertUseCase = new InsertTemplateUseCase(repo);
    const getAllUseCase = new GetAllTemplateUseCase(repo);
    const updateUseCase = new UpdateTemplateUseCase(repo);
    const deleteUseCase = new DeleteTemplateUseCase(repo);
    const controller = new TemplateController(insertUseCase, getAllUseCase, updateUseCase, deleteUseCase);
    const middleware = new TemplateMiddleware();

    this.router = Router();
    this.router.post('/templates', middleware.validateTemplate, controller.insert);
    this.router.get('/templates', controller.getAll);
    this.router.put('/templates/:id', middleware.validateTemplate, controller.update);
    this.router.delete('/templates/:id', controller.delete);
  }

  getRoutes() {
    return this.router;
  }
}