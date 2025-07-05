import {DataTypes, Model} from 'sequelize';
import db from '../config/db'
import { MagazineType } from './MagazineType';

interface MagazineMembers{
    id:BigInt;
    title: string;
    image : string;
    file : string;
    status : Number;
    published_date  : Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class Magazine extends Model<MagazineMembers>{
   //
  }

  Magazine.init({
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      
        
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue:0
      },
   
    image: {
        type: DataTypes.STRING,
        
    },
    file: {
        type: DataTypes.STRING,
  
      },

      published_date: {
        type: DataTypes.DATE,
       
    }
  },
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "magazines",
  })

  export {MagazineMembers,Magazine}

  Magazine.hasOne(MagazineType, { foreignKey: 'magazine_id' })
  MagazineType.belongsTo(Magazine, { foreignKey: 'magazine_id' })