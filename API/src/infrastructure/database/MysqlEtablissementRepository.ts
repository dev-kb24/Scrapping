import { Sequelize, DataTypes, Model } from 'sequelize';
import { EtablissementRepository } from '../../domain/repositories/EtablissementRepository';
import { Etablissement } from '../../domain/entities/Etablissement';
import { Mysql } from './Mysql';

class EtablissementModel extends Model {}

export class MysqlEtablissementRepository extends Mysql implements EtablissementRepository {
  private EtablissementModel: typeof EtablissementModel;

  constructor(config?: any) {
    super(config);

    this.EtablissementModel = EtablissementModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        phone: { type: DataTypes.STRING },
        website: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING },
        siret: { type: DataTypes.STRING},
        siren: { type: DataTypes.STRING}
      },
      {
        sequelize: this.sequelize,
        tableName: 'etablissements',
        timestamps: false,
      }
    );
  }

  async initEstablishement() {
    await this.EtablissementModel.sync();
  }

  async insert(etablissement: Etablissement): Promise<void> {
    await this.EtablissementModel.create({
      name: etablissement.name,
      address: etablissement.address,
      phone: etablissement.phone,
      website: etablissement.website,
      email: etablissement.email || null,
      siret: etablissement.siret || null,
      siren: etablissement.siren || null
    });
  }

  async update(etablissement: Etablissement, id: string): Promise<void> {
   await this.EtablissementModel.update(
        {
          name: etablissement.name,
          address: etablissement.address,
          phone: etablissement.phone,
          website: etablissement.website,
          email: etablissement.email,
          siret: etablissement.siret,
          siren: etablissement.siren,
        }
        , 
        {where:{id}});
  }

  async delete(id: string): Promise<void> {
    await this.EtablissementModel.destroy({where: {id}});
  }

  async getAll(): Promise<Etablissement[]> {
    const rows = await this.EtablissementModel.findAll();
    return rows.map(row =>
      new Etablissement(
        row.get('id') as string,
        row.get('name') as string,
        row.get('address') as string,
        row.get('phone') as string,
        row.get('website') as string,
        row.get('email') as string,
        row.get('siret') as string,
        row.get('siren') as string
      )
    );
  }
}