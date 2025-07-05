import { DataTypes, Model } from 'sequelize';
import db from '../config/db'

interface BookingSessionMembers {
  id: BigInt;
  booking_id: BigInt
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  time: string;
  city: string;
  state: string;
  country: string;
  gender: string;
  booking_date: Date;
  booking_time: String;
  comment: Text;
  status: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class BookingSession extends Model<BookingSessionMembers>{
  //
}

BookingSession.init({
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
    type: DataTypes.TIME,

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
  booking_date: {
    type: DataTypes.DATE,

  },
  booking_time: {
    type: DataTypes.STRING,

  },
  comment: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.TINYINT,
  }
},
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "booking_sessions",
  })


export { BookingSession, BookingSessionMembers }

 //booking_astrology_sessions(booking_id on bookings)