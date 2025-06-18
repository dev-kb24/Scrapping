import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export class SendEmailMiddleware{
    sendEmailSchema = yup.object({
        to: yup.string(),
        from: yup.string(),
        subject: yup.string(),
        text: yup.string()
    });

    validateSendEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.sendEmailSchema.validate(req.body, { abortEarly: false });
            next();
        } catch (err: any) {
            res.status(400).json({ errors: err.errors });
        }
    }
}