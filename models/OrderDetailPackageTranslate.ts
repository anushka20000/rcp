import { DataTypes, Model } from 'sequelize';
import db from '../config/db'

interface OrderDetailPackageTranslateMembers {
  id: BigInt;
  order_detail_id: BigInt;
  title: string;
  description: Text;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class OrderDetailPackageTranslate extends Model<OrderDetailPackageTranslateMembers>{
  //
}

OrderDetailPackageTranslate.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  order_detail_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  locale: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  }
},
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pck_translates",
  })

export { OrderDetailPackageTranslate, OrderDetailPackageTranslateMembers }