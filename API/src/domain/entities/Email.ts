export class Email {
  constructor(
    public id: number,
    public status_email: 'send' | 'opened' | 'responded',
    public type_email: 'site' | 'marketing' | 'devis',
    public date_envoi: Date,
    public sujet: string,
    public id_etablissement: number
  ) {}
}