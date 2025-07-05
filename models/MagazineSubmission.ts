import {DataTypes, Model} from 'sequelize';
import db from '../config/db'

interface MagazineSubmissionMembers{
    id:BigInt;
    title: string;
    image : string;
    file : string;
    author_name : string;
    author_contact_number : string;
    status : Number;
    description : Text;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class MagazineSubmission extends Model<MagazineSubmissionMembers>{
   //
  }

  MagazineSubmission.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
  
      title: {
        type: DataTypes.STRING,
   
        
      },
    image: {
        type: DataTypes.STRING,
        
    },
    file: {
        type: DataTypes.STRING,
  
      },
      author_name: {
        type: DataTypes.STRING,
        
    },
    author_contact_number: {
        type: DataTypes.STRING,
   
    },
 
    status: {
        type: DataTypes.TINYINT,
  
      },
      description: {
        type: DataTypes.TEXT,
    
  
      },
  
  },
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "magazine_submissions",
  })

  export {MagazineSubmissionMembers,MagazineSubmission}