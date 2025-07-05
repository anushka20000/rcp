import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { CmsTranslate } from "./CmsTranslate";

interface ContactMembers {
  id: bigint;
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Contact extends Model<ContactMembers> {
  //
}

Contact.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.TINYINT,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "contacts",
  }
);

export { Contact,ContactMembers };


