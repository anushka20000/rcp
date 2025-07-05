import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

export interface OrderDetailKundliMembers {
  id: BigInt;
  ord_dt_id: BigInt;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth:Date;
  time: string;
  city: string;
  state: string;
  country: string;
  gender: string;
  status:Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class OrderDetailKundli extends Model<OrderDetailKundliMembers>{
//
}

OrderDetailKundli.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ord_dt_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      
      },
    first_name: {
      type: DataTypes.STRING,
      
    },
    last_name: {
      type: DataTypes.STRING,
  
    },
    email: {
        type: DataTypes.STRING,
        
      },
      phone: {
        type: DataTypes.STRING,
       
      },
      date_of_birth: {
        type: DataTypes.DATE,
        
      },
    time: {
      type: DataTypes.STRING,
      
    },
    city: {
        type: DataTypes.STRING,
        
      },
      state: {
        type: DataTypes.STRING,
         
      },
      country: {
        type: DataTypes.STRING,
      
      },
     gender: {
        type: DataTypes.STRING,
 
      },
      status: {
        type: DataTypes.TINYINT,
        
      },
  },
  
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_kundlis",
  }

)

 //order_detail_kundlis(order_detail_id on order_details)