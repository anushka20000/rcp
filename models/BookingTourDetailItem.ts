import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface BookingTourDetailItemMembers {
  id: BigInt;
  booking_tour_detail_id: BigInt;
  tour_detail_item_id: BigInt;
  quantity: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingTourDetailItem extends Model<BookingTourDetailItemMembers> {
  //
}

BookingTourDetailItem.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    booking_tour_detail_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tour_detail_item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      defaultValue:1
    },
    price: {
      type: DataTypes.DOUBLE,
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_tour_detail_items",
  }
);


export { BookingTourDetailItemMembers, BookingTourDetailItem }

