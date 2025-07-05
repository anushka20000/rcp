import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { OrderDetailPackageDetailItemTranslate } from './OrderDetailPackageDetailItemTranslate';

interface OrderDetailPackageDetailItemMembers {
  id: BigInt;
  ord_dt_pck_detail_id: BigInt
  // is_live  : number;
  quantity: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class OrderDetailPackageDetailItem extends Model<OrderDetailPackageDetailItemMembers>{
  //
}

OrderDetailPackageDetailItem.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
//   is_live : {
//     type: DataTypes.TINYINT,

    
// },
  ord_dt_pck_detail_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
  }
},
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pck_dt_items",
  })

export { OrderDetailPackageDetailItemMembers, OrderDetailPackageDetailItem }

OrderDetailPackageDetailItemTranslate.belongsTo(OrderDetailPackageDetailItem, { foreignKey: "ord_dt_pck_dt_item_id" })

OrderDetailPackageDetailItem.hasMany(OrderDetailPackageDetailItemTranslate, { foreignKey: "ord_dt_pck_dt_item_id" })