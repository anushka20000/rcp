import { DataTypes, Model } from 'sequelize';
import db from '../config/db';

export interface BookingKundaliMembers {
  id: BigInt;
  booking_id: BigInt;
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  time: string;
  city: string;
  state: string;
  country: string;
  gender: string;
  status: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class BookingKundali extends Model<BookingKundaliMembers>{
  //
}

BookingKundali.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    booking_id: {
      type: DataTypes.BIGINT,
      allowNull: false

    },
    name: {
      type: DataTypes.STRING,

    },
    email: {
      type: DataTypes.STRING,

    },
    phone: {
      type: DataTypes.STRING,

    },
    date_of_birth: {
      type: DataTypes.DATE,

    },
    time: {
      type: DataTypes.STRING,

    },
    city: {
      type: DataTypes.STRING,

    },
    state: {
      type: DataTypes.STRING,

    },
    country: {
      type: DataTypes.STRING,

    },
    gender: {
      type: DataTypes.STRING,

    },
    status: {
      type: DataTypes.TINYINT,

    },
  },

  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_kundlis",
  }

)

//booking_kundlis(booking_id on bookings)