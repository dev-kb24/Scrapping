import { EtablissementRepository } from '../../domain/repositories/EtablissementRepository';

export class DeleteEtablissementUseCase {
  constructor(private repo: EtablissementRepository) {}

  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}