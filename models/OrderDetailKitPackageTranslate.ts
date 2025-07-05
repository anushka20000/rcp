import { DataTypes, Model } from 'sequelize';
import db from '../config/db'

interface OrderDetailKitPackageTranslateMembers {
  id: BigInt;
  ord_dt_id: BigInt;
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class OrderDetailKitPackageTranslate extends Model<OrderDetailKitPackageTranslateMembers>{
  //
}

OrderDetailKitPackageTranslate.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ord_dt_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
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
    tableName: "ord_dt_kt_pck_translates",
  })

export { OrderDetailKitPackageTranslate, OrderDetailKitPackageTranslateMembers }