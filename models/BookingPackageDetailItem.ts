import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface BookingPackageDetailItemMembers{
  id: BigInt;
  booking_pck_dt_id: BigInt;
  package_dt_it_id: BigInt;
  quantity: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingPackageDetailItem extends Model<BookingPackageDetailItemMembers> {
    //
  }

  BookingPackageDetailItem.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      booking_pck_dt_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      package_dt_it_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.DOUBLE,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      sequelize: db,
      tableName: "booking_package_detail_items",
    }
  );

  
  export {BookingPackageDetailItemMembers, BookingPackageDetailItem}

