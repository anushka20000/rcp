import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface AstrologyProductTranslateMembers {
    id: BigInt;
    astrology_product_id: BigInt;
    title: string;
    slug: string;
    locale: string;
    description: Text;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class AstrologyProductTranslate extends Model<AstrologyProductTranslateMembers> {
    //
  }

  AstrologyProductTranslate.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      astrology_product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        
      },
      title: {
        type: DataTypes.STRING,
     
      },
      slug: {
        type: DataTypes.STRING,
      
  
      },
  
      locale: {
        type: DataTypes.STRING,
     
  
      },
  
      description: {
        type: DataTypes.TEXT,

  
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize: db,
      tableName: "astrology_product_translates",
    }
  )

  export {AstrologyProductTranslateMembers,AstrologyProductTranslate}
  