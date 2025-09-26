import { Template } from '../entities/Template';

export interface TemplateRepository {
  insert(template: Template): Promise<void>;
  getAll(): Promise<Template[]>;
  update(template: Template, id: number): Promise<void>;
  delete(id: number): Promise<void>;
}