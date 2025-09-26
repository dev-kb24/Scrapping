import { Sequelize, DataTypes, Model } from 'sequelize';
import { Mysql } from './Mysql';
import { Template } from '../../domain/entities/Template';
import { TemplateRepository } from '../../domain/repositories/TemplateRepository';

class TemplateModel extends Model {}

export class MysqlTemplateRepository extends Mysql implements TemplateRepository {
  private TemplateModel: typeof TemplateModel;

  constructor(config?: any) {
    super(config);

    this.TemplateModel = TemplateModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        type_template: {
          type: DataTypes.ENUM('email', 'prompt'),
          allowNull: false
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        sequelize: this.sequelize,
        tableName: 'templates',
        timestamps: false,
      }
    );
  }

  async initTemplate() {
    await this.TemplateModel.sync();
  }

  async insert(template: Template): Promise<void> {
    await this.TemplateModel.create(template as any);
  }

  async getAll(): Promise<Template[]> {
    const rows = await this.TemplateModel.findAll();
    return rows.map(row => row.get() as Template);
  }

  async update(template: Template, id: number): Promise<void> {
    await this.TemplateModel.update(template as any, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.TemplateModel.destroy({ where: { id } });
  }
}