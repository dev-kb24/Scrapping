import { Router } from 'express';
import { EmailInterface } from '../../domain/interfaces/EmailInterface';
import { EtablissementRepository } from '../../domain/repositories/EtablissementRepository';
import { UpdateEtablissementUseCase } from '../../applications/etablissements/usecases/UpdateEtablissementUseCase';
import { SendEmailUseCase } from '../../applications/email/usecases/SendEmailUseCase';
import { EmailController } from '../controllers/EmailController';
import { SendEmailMiddleware } from '../../infrastructure/middleware/sendEmailMiddleware';

export class EmailRouter {
    private router;
    private controller;
    private middleware;

     constructor(repoEmail: EmailInterface, repoEtablissement: EtablissementRepository) {
        const updateEtablissementUC = new UpdateEtablissementUseCase(repoEtablissement);
        const sendEmailUC = new SendEmailUseCase(repoEmail);
        this.controller = new EmailController(updateEtablissementUC, sendEmailUC);
        this.middleware = new SendEmailMiddleware();
        this.router = Router();
     }
    
     getRoutes(){
        this.router.post('/send-email', this.middleware.validateSendEmail, this.controller.sendEmail);
        return this.router;
     }
}