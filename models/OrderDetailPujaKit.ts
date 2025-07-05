import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import { OrderDetailPujaKitTranslate } from './OrderDetailPujaKitTranslate';


export interface instance {
  id: BigInt;
  order_detail_id: BigInt;
  image: String;
  is_show: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class OrderDetailPujaKit extends Model<instance>{
 
}

OrderDetailPujaKit.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    order_detail_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    
      },
      is_show: {
        type: DataTypes.TINYINT,
      
      },
    
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pu_kits",
  }

)

OrderDetailPujaKitTranslate.belongsTo(OrderDetailPujaKit,{foreignKey:"ord_dt_pu_kit_id"})

OrderDetailPujaKit.hasMany(OrderDetailPujaKitTranslate, {foreignKey: "ord_dt_pu_kit_id"})


