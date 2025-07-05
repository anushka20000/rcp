import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface LanguageTranslateMembers {
  id: BigInt;
  language_id: BigInt;
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class LanguageTranslate extends Model<LanguageTranslateMembers> {
  //
}

LanguageTranslate.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    language_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    locale: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "language_translates",
  }
);

export { LanguageTranslateMembers, LanguageTranslate };
