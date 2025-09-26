import { Router } from 'express';
import { EmailController } from '../controllers/EmailController';
import { EmailMiddleware } from '../../infrastructure/middleware/EmailMiddleware';
import { MysqlEmailRepository } from '../../infrastructure/database/MysqlEmailRepository';
import { InsertEmailUseCase } from '../../applications/email/usecases/InsertEmailUseCase';
import { GetAllEmailUseCase } from '../../applications/email/usecases/GetAllEmailUseCase';
import { UpdateEmailUseCase } from '../../applications/email/usecases/UpdateEmailUseCase';
import { DeleteEmailUseCase } from '../../applications/email/usecases/DeleteEmailUseCase';

export class EmailRouter {
  private router: Router;

  constructor(repo: MysqlEmailRepository) {
    const insertUseCase = new InsertEmailUseCase(repo);
    const getAllUseCase = new GetAllEmailUseCase(repo);
    const updateUseCase = new UpdateEmailUseCase(repo);
    const deleteUseCase = new DeleteEmailUseCase(repo);
    const controller = new EmailController(insertUseCase, getAllUseCase, updateUseCase, deleteUseCase);
    const middleware = new EmailMiddleware();

    this.router = Router();
    this.router.post('/emails', middleware.validateEmail, controller.insert);
    this.router.get('/emails', controller.getAll);
    this.router.put('/emails/:id', middleware.validateEmail, controller.update);
    this.router.delete('/emails/:id', controller.delete);
  }

  getRoutes() {
    return this.router;
  }
}