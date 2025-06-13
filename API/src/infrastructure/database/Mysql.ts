import { Sequelize } from "sequelize";

export class Mysql {
    protected sequelize: Sequelize;

    constructor(config?: any) {
      this.sequelize = new Sequelize(
          config?.database,
          config?.user,
          config?.password,
          {
            host: config?.host,
            port: config?.port,
            dialect: config?.dialect,
            logging: Boolean(config?.logging)
          }
        );
    }
}