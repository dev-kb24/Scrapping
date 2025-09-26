import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export class TemplateMiddleware {
  templateSchema = yup.object({
    type_template: yup.string().oneOf(['email', 'prompt']).required(),
    content: yup.string().required()
  });

  validateTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.templateSchema.validate(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      res.status(400).json({ errors: err.errors });
    }
  }
}