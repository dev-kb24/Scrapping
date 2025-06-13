import { Mysql } from './Mysql';
import { DataTypes, Model } from 'sequelize';
import { ScrapeRepository } from '../../domain/repositories/ScrapeRepository';
import { Scrape } from '../../domain/entities/Scrape';

class ScrapeModel extends Model {}
export class MysqlScrapeRepository extends Mysql implements ScrapeRepository{
    private ScrapeModel: typeof ScrapeModel;
    constructor(config?: any) {
    super(config);

    this.ScrapeModel = ScrapeModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING },
        keyword: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        progress: { 
            type: DataTypes.ENUM('in progress', 'failed', 'success'), 
            allowNull: false,
            defaultValue: 'in progress'
        }
      },
      {
        sequelize: this.sequelize,
        tableName: 'scrape',
        timestamps: false,
      }
    );
  }
    async find(where: Record<string, string>): Promise<Scrape> {
        const scrapeFound: ScrapeModel | null =  await this.ScrapeModel.findOne({
            where: where,
            attributes: ['id', 'name', 'keyword', 'city', 'progress']
        })
        if(!scrapeFound){
            throw new Error("Scrape vide");
        }
        return new Scrape(scrapeFound.dataValues.id, scrapeFound.dataValues.name, scrapeFound.dataValues.keyword, scrapeFound.dataValues.city, scrapeFound.dataValues.progress);
    }
    async insert(scrape: Scrape): Promise<void> {
        await this.ScrapeModel.create({
            name: scrape.name,
            keyword: scrape.keyword,
            city: scrape.city,
            progress: scrape.progress
        });
    }
    async update(scrape: Scrape, id: string): Promise<void> {
        await this.ScrapeModel.update(
        {
            name: scrape.name,
            keyword: scrape.keyword,
            city: scrape.city,
            progress: scrape.progress
        }
        , 
        {where:{id}});
    }


    async getAll(): Promise<Scrape[]> {
        const rows = await this.ScrapeModel.findAll();
        return rows.map(row =>
            new Scrape(
            row.get('id') as string,
            row.get('name') as string,
            row.get('keyword') as string,
            row.get('city') as string,
            row.get('progress') as string
            )
        );
    }

  async initScrape() {
    await this.ScrapeModel.sync();
  }
}