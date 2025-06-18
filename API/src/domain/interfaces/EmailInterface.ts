export interface EmailInterface {
    sendMail(from: string, to: string, subject: string, text: string): Promise<void>;
}