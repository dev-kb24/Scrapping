import { Sequelize, DataTypes, Model } from 'sequelize';
import { Mysql } from './Mysql';
import { Email } from '../../domain/entities/Email';
import { EmailRepository } from '../../domain/repositories/EmailRepository';

class EmailModel extends Model {}

export class MysqlEmailRepository extends Mysql {
  private EmailModel: typeof EmailModel;

  constructor(config?: any) {
    super(config);

    this.EmailModel = EmailModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        status_email: { 
          type: DataTypes.ENUM('send', 'opened', 'responded'),
          allowNull: false,
          defaultValue: 'send'
        },
        type_email: {
          type: DataTypes.ENUM('site', 'marketing', 'devis'),
          allowNull: false
        },
        date_envoi: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        sujet: { type: DataTypes.STRING, allowNull: false },
        id_etablissement: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'etablissements',
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      },
      {
        sequelize: this.sequelize,
        tableName: 'emails',
        timestamps: false,
      }
    );
  }

  async initEmail() {
    await this.EmailModel.sync();
  }

  async insert(email: Email): Promise<void> {
    await this.EmailModel.create(email as any);
  }

  async getAll(): Promise<Email[]> {
    const rows = await this.EmailModel.findAll();
    return rows.map(row => row.get() as Email);
  }

  async update(email: Email, id: number): Promise<void> {
    await this.EmailModel.update(email as any, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.EmailModel.destroy({ where: { id } });
  }

  async getByEtablissement(id_etablissement: number): Promise<Email[]> {
    const rows = await this.EmailModel.findAll({ where: { id_etablissement } });
    return rows.map(row => row.get() as Email);
  }
}