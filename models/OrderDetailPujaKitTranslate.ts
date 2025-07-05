import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

export interface instance {
  id: BigInt;
  ord_dt_pu_kit_id: BigInt
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class OrderDetailPujaKitTranslate extends Model<instance>{
  //
}

OrderDetailPujaKitTranslate.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ord_dt_pu_kit_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
    },
    locale: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pu_kt_translates",
  }
)