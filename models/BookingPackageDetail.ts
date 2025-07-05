import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { BookingPackageDetailItem } from "./BookingPackageDetailItem";

interface BookingPackageDetailMembers {
  id: BigInt;
  booking_id: BigInt;
  package_detail_id: BigInt;
  is_required: number;
  item_selectable: number;
  pandit_required: number;
  type: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingPackageDetail extends Model<BookingPackageDetailMembers> {
  //
}

BookingPackageDetail.init(
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
    package_detail_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.TINYINT,
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
    },
    pandit_required: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_package_details",
  }
);

export { BookingPackageDetailMembers, BookingPackageDetail }

BookingPackageDetail.hasMany(BookingPackageDetailItem,{foreignKey: "booking_pck_dt_id"})

BookingPackageDetailItem.belongsTo(BookingPackageDetail,{foreignKey: 'booking_pck_dt_id'})

