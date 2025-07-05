import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { BookingSamagriPackageDetailItem } from "./BookingSamagriPackageDetailItem";

interface BookingSamagriPackageDetailMembers {
  id: BigInt;
  booking_id: BigInt;
  samagri_package_detail_id: BigInt;
  is_required: Number;
  item_selectable: Number;
  price: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingSamagriPackageDetail extends Model<BookingSamagriPackageDetailMembers> {
  //
}

BookingSamagriPackageDetail.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    samagri_package_detail_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,

    },
    is_required: {
      type: DataTypes.TINYINT,
    },
    item_selectable: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_sm_pck_details",
  }
);


export { BookingSamagriPackageDetailMembers, BookingSamagriPackageDetail }

BookingSamagriPackageDetailItem.belongsTo(BookingSamagriPackageDetail, { foreignKey: 'booking_sm_pck_detail_id' })

BookingSamagriPackageDetail.hasMany(BookingSamagriPackageDetailItem, { foreignKey: 'booking_sm_pck_detail_id' });

