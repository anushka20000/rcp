import {DataTypes, Model} from 'sequelize';
import db from '../config/db'
import { OrderDetailPackageDetailItem } from './OrderDetailPackageDetailItem';
import { OrderDetailPackageDetailTranslate } from './OrderDetailPackageDetailTranslate';

interface OrderDetailPackageDetailMembers{
    id:BigInt;
    is_required : Number;
    item_selectable:Number
    price:Number;
    pandit_required: number;
    order_detail_id: BigInt;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class OrderDetailPackageDetail extends Model<OrderDetailPackageDetailMembers>{
   //
  }

  OrderDetailPackageDetail.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_detail_id:{
        type: DataTypes.BIGINT,
      },
      price:{
        type: DataTypes.DOUBLE,
      },
      is_required : {
        type: DataTypes.TINYINT,
      },
      item_selectable : {
        type: DataTypes.TINYINT,
      },
      pandit_required: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
  },
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pck_details",
  })

  export {OrderDetailPackageDetailMembers,OrderDetailPackageDetail}

 OrderDetailPackageDetailTranslate.belongsTo(OrderDetailPackageDetail,{foreignKey:"ord_dt_pck_detail_id"})
// OrderDetailPackageDetailItem.belongsTo(OrderDetailPackageDetail,{foreignKey:"order_package_id"})

  OrderDetailPackageDetailItem.belongsTo(OrderDetailPackageDetail,{foreignKey:"ord_dt_pck_detail_id"})

  OrderDetailPackageDetail.hasMany(OrderDetailPackageDetailTranslate, {foreignKey: "ord_dt_pck_detail_id"})
  OrderDetailPackageDetail.hasMany(OrderDetailPackageDetailItem, {foreignKey: "ord_dt_pck_detail_id"})



