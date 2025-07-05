import {DataTypes, Model} from 'sequelize';
import db from '../config/db'

interface OrderDetailPackageDetailItemTranslateMembers{
    id:BigInt;
    ord_dt_pck_dt_item_id:BigInt
    title : string;

    locale   : string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class OrderDetailPackageDetailItemTranslate extends Model<OrderDetailPackageDetailItemTranslateMembers>{
   //
  }

  OrderDetailPackageDetailItemTranslate.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ord_dt_pck_dt_item_id:{
        type: DataTypes.BIGINT,
        allowNull: false,

      },

      title : {
        type: DataTypes.STRING,
      
        
      },
      locale  : {
        type: DataTypes.STRING,
       
        
      },
      
  
    
  },
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pck_dt_item_translates",
  })

  export {OrderDetailPackageDetailItemTranslateMembers,OrderDetailPackageDetailItemTranslate}