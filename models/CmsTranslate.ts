import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface CmsTranslateMembers {
  id: BigInt;
  cms_id: BigInt;
  title: string;
  slug: string;
  locale: string;
  label: string;
  description: Text;
  link: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class CmsTranslate extends Model<CmsTranslateMembers> {
  //
}

CmsTranslate.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cms_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    
    },
    slug: {
      type: DataTypes.STRING,
     

    },
    label: {
      type: DataTypes.STRING,
  

    },
    link: {
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
    tableName: "cms_translates",
  }
);

export { CmsTranslateMembers, CmsTranslate };
