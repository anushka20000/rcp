import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { BookingTourDetailItem } from "./BookingTourDetailItem";

interface BookingTourDetailMembers {
  id: BigInt;
  booking_id: BigInt;
  tour_detail_id: BigInt;
  is_required: string;
  item_selectable: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingTourDetail extends Model<BookingTourDetailMembers> {
  //
}

BookingTourDetail.init(
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
    tour_detail_id: {
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
    tableName: "booking_tour_details",
  }
);


export { BookingTourDetailMembers, BookingTourDetail }

BookingTourDetailItem.belongsTo(BookingTourDetail, { foreignKey: 'booking_tour_detail_id' })

BookingTourDetail.hasMany(BookingTourDetailItem, { foreignKey: 'booking_tour_detail_id' });

