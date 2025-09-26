import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export class EmailMiddleware {
  emailSchema = yup.object({
    status_email: yup.string().oneOf(['send', 'opened', 'responded']).required(),
    type_email: yup.string().oneOf(['site', 'marketing', 'devis']).required(),
    date_envoi: yup.date().required(),
    sujet: yup.string().required(),
    id_etablissement: yup.number().required()
  });

  validateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.emailSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      res.status(400).json({ errors: err.errors });
    }
  }
}