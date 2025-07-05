import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import { CategoryTranslate } from './CategoryTranslate';
import { PujaCategory } from './PujaCategory';

export interface instance {
 
  id: BigInt;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Category extends Model<instance>{
//
}

Category.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "categories",
  }

)
CategoryTranslate.belongsTo(Category, { foreignKey: 'category_id' })
PujaCategory.belongsTo(Category, { foreignKey: 'category_id' })


Category.hasMany(CategoryTranslate,{foreignKey: "category_id"})
Category.hasMany(PujaCategory,{foreignKey: "category_id"})
