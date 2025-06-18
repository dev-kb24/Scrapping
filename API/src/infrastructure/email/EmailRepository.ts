import nodemailer, { Transporter } from 'nodemailer';
import { EmailInterface } from '../../domain/interfaces/EmailInterface';

export class EmailRepository implements EmailInterface{
    transporter: Transporter | undefined;

    constructor(emailConfig: any){
        let config: any = {
            host: emailConfig?.host,
            port: emailConfig?.port,
            secure: emailConfig?.secure,
        }
        if(emailConfig.user && emailConfig.pass){
            config.auth = {
                user: emailConfig.user,
                pass: emailConfig.pass
            }

        }
        this.transporter = nodemailer.createTransport(config);
    }

    async sendMail(from: string, to: string, subject: string, text: string): Promise<void> {
        await this.transporter?.sendMail({from,to,subject,text});
    }
}