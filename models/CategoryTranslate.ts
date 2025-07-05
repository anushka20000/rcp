import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

export interface CategoryTranslateMembers {
  id: BigInt;
  category_id: BigInt;
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class CategoryTranslate extends Model<CategoryTranslateMembers>{
//
}

CategoryTranslate.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    category_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
    title: {
      type: DataTypes.STRING,
      
    },
 
      locale: {
        type: DataTypes.STRING,
         
      },
   
 
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "category_translates",
  }

)