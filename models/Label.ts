import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface LabelMembers {
    id: BigInt;
    module: string;
    key: Text;
    en: Text;
    hi: Text;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  class Label extends Model<LabelMembers> {
    //
  }

  Label.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      module: {
        type: DataTypes.STRING,
       
        
      },
      key: {
        type: DataTypes.TEXT,
         
      },
      en: {
        type: DataTypes.TEXT,
     
      },
      hi: {
        type: DataTypes.TEXT,
     
      },
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize: db,
      tableName: "labels",
    }
  )

  export {LabelMembers,Label}
  