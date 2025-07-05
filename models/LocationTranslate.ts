import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface LocationTranslateMembers {
  id: BigInt;
  location_id: BigInt;
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class LocationTranslate extends Model<LocationTranslateMembers> {
  //
}

LocationTranslate.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
    tableName: "location_translates",
  }
);

export { LocationTranslateMembers, LocationTranslate };
