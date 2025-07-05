import {DataTypes, Model} from 'sequelize';
import db from '../config/db'

interface OrderDetailMatchMembers{
    id:BigInt;
    ord_dt_id: BigInt
    boy_name: string;
    girl_name: string;
    girl_dob: Date;
    girl_birth_time: string;
    email: string;
    phone: string;
    boy_dob: Date;
    boy_birth_time: string;
    comment: Text;
    status: Number;
    booking_date: Date;
    booking_time: String;
    girl_birth_place: string;
    boy_birth_place: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
  class OrderDetailMatch extends Model<OrderDetailMatchMembers>{
    //
   }
 
   OrderDetailMatch.init({
     id:{
         type: DataTypes.BIGINT,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
       },
       ord_dt_id:{
         type: DataTypes.BIGINT,
         allowNull: false,
       },
       boy_name: {
         type: DataTypes.STRING,
    
         
       },
       girl_name: {
        type: DataTypes.STRING,
 
        
      },
       email: {
         type: DataTypes.STRING,
         
     },
     phone: {
         type: DataTypes.STRING,
         
     },
     boy_dob: {
         type: DataTypes.DATE,
   
       },
       boy_birth_time: {
         type: DataTypes.TIME,
   
       },
       girl_dob: {
        type: DataTypes.DATE,
  
      },
      girl_birth_time: {
        type: DataTypes.TIME,
  
      },

       comment: {
         type: DataTypes.TEXT,

     },
     status: {
      type: DataTypes.TINYINT,
      
  },
  girl_birth_place: {
    type: DataTypes.STRING,
  
    
  },
  boy_birth_place: {
    type: DataTypes.STRING,
  
    
  },
  booking_date: {
    type: DataTypes.DATE,

  },
  booking_time: {
    type: DataTypes.STRING,

  },
   },
   {
     timestamps: true,
     paranoid: true,
     sequelize: db,
     tableName: "ord_dt_matches",
   } )

   export {OrderDetailMatch,OrderDetailMatchMembers}