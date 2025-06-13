import { Scrape } from "../entities/Scrape";

export interface ScrapeRepository {
    insert(etablissement: Scrape): Promise<void>;
    getAll(): Promise<Scrape[]>;
    update(etablissement: Scrape, id: string): Promise<void>;
    find(where: Record<string, string>): Promise<Scrape>;
}