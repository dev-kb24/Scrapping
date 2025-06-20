import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';

export class BatchMiddleware{
    batchSchema = yup.object({
        name: yup.string().required(),
        keyword: yup.string().required(),
        city: yup.string().required(),
    });

    validateBatch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.batchSchema.validate(req.body, { abortEarly: false });
            next();
        } catch (err: any) {
            res.status(400).json({ errors: err.errors });
        }
    }
}