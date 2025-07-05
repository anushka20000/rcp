import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface BookingSamagriPackageDetailItemMembers {
  id: BigInt;
  booking_sm_pck_detail_id: BigInt;
  samagri_id: BigInt;
  type: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingSamagriPackageDetailItem extends Model<BookingSamagriPackageDetailItemMembers> {
  //
}

BookingSamagriPackageDetailItem.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    booking_sm_pck_detail_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    samagri_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_sm_pck_detail_items",
  }
);


export { BookingSamagriPackageDetailItemMembers, BookingSamagriPackageDetailItem }

