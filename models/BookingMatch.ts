import {DataTypes, Model} from 'sequelize';
import db from '../config/db'

interface BookingMatchMembers{
    id:BigInt;
    booking_id: BigInt
    boy_name: string;
    girl_name: string;
    girl_dob: Date;
    girl_birth_time: string;
    email: string;
    phone: string;
    boy_dob: Date;
    boy_birth_time: string;
    comment: Text;
    status: number;
    booking_date: Date;
    booking_time: String;
    girl_birth_place: string;
    boy_birth_place: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
  class BookingMatch extends Model<BookingMatchMembers>{
    //
   }
 
   BookingMatch.init({
     id:{
         type: DataTypes.BIGINT,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
       },
       booking_id:{
         type: DataTypes.BIGINT,
         allowNull: false,
       },
       boy_name: {
         type: DataTypes.STRING,
       
         
       },
       girl_name: {
        type: DataTypes.STRING,
      
        
      },
      girl_birth_place: {
        type: DataTypes.STRING,
      
        
      },
      boy_birth_place: {
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
      booking_date: {
        type: DataTypes.DATE,
    
      },
      booking_time: {
        type: DataTypes.STRING,
    
      },
       comment: {
         type: DataTypes.TEXT,

     },
     status: {
      type: DataTypes.TINYINT,
      
  }
   },
   {
     timestamps: true,
     paranoid: true,
     sequelize: db,
     tableName: "booking_matches",
   } )

   export {BookingMatch,BookingMatchMembers}

    //booking_kundali_matches(booking_id on bookings)