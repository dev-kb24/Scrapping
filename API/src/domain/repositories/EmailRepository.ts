import { Email } from '../entities/Email';

export interface EmailRepository {
  insert(email: Email): Promise<void>;
  getAll(): Promise<Email[]>;
  update(email: Email, id: number): Promise<void>;
  delete(id: number): Promise<void>;
  getByEtablissement(id_etablissement: number): Promise<Email[]>;
}