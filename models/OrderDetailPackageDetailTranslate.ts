import {DataTypes, Model} from 'sequelize';
import db from '../config/db'

interface OrderDetailPackageDetailTranslateMembers{
    id:BigInt;
    ord_dt_pck_detail_id: BigInt
    title : string;
    slug : string;
    description  : Text;
    locale   : string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class OrderDetailPackageDetailTranslate extends Model<OrderDetailPackageDetailTranslateMembers>{
   //
  }

  OrderDetailPackageDetailTranslate.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      ord_dt_pck_detail_id:{
        type: DataTypes.BIGINT,
        allowNull: false,
       
      },
      title : {
        type: DataTypes.STRING,

        
      },
      slug : {
        type: DataTypes.STRING,
     
        
      },
      locale  : {
        type: DataTypes.STRING,
      
        
      },
      description : {
        type: DataTypes.TEXT,
  
        
    },
  
    
  },
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_pck_dt_translates",
  })

  export {OrderDetailPackageDetailTranslateMembers,OrderDetailPackageDetailTranslate}