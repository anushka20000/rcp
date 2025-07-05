import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import { BookingSession } from './BookingSession';
import { BookingMatch } from './BookingMatch';
import { BookingKundali } from './BookingKundli';
import { BookingPackageDetail } from './BookingPackageDetail';
import { BookingSamagriPackageDetail } from './BookingSamagriPackageDetail';
import { BookingTourDetail } from './BookingTourDetail';

export interface BookingMembers {
  id: BigInt;
  user_id: BigInt;
  puja_id: BigInt;
  user_address_id: BigInt;
  package_id: BigInt;
  pandit_id: bigint;
  location_id: BigInt;
  language_id: BigInt;
  puja_kit_id: BigInt;
  samagri_package_id: BigInt;
  astrology_product_id: BigInt;
  astrology_product_variation_id: BigInt;
  tour_id: BigInt;
  booking_token:string;
  total: number;
  price: number;
  quantity: string;
  carat: string;
  image: string;
  shipping_amount: number;
  date: Date;
  visiting_date:Date;
  time: TimeRanges;
  type: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Booking extends Model<BookingMembers>{

}

Booking.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.BIGINT     
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1->puja_package, 2->samagri package, 3-> astrology product, 4-> tour_id, 5-> kundli, 6-> astrologer, 7-> kundli match'
    },
    puja_id: {
      type: DataTypes.BIGINT,
      
    },
    user_address_id: {
      type: DataTypes.BIGINT,
    },
    location_id: {
      type: DataTypes.BIGINT,
    },
    language_id: {
      type: DataTypes.BIGINT,
      defaultValue: null
    },
    package_id: {
      type: DataTypes.BIGINT,
    },
    puja_kit_id: {
      type: DataTypes.BIGINT,
    },
    samagri_package_id: {
      type: DataTypes.BIGINT,
    },
    astrology_product_id: {
      type: DataTypes.BIGINT,
    },
    astrology_product_variation_id: {
      type: DataTypes.BIGINT,
    },
    tour_id: {
      type: DataTypes.BIGINT,
    },
    pandit_id: {
      type: DataTypes.BIGINT,
    },
    booking_token: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.DOUBLE,
    },
    price: {
      type: DataTypes.DOUBLE,
    },
    quantity: {
      type: DataTypes.DOUBLE,
    },
    carat: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    shipping_amount: {
      type: DataTypes.DOUBLE,
    },
    date: {
      type: DataTypes.DATE,

    },
    visiting_date: {
      type: DataTypes.DATE,

    },
    time: {
      type: DataTypes.TIME,

    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "bookings",
  }

)

Booking.hasMany(BookingPackageDetail, { foreignKey: 'booking_id' })
Booking.hasOne(BookingMatch, { foreignKey: 'booking_id' })
Booking.hasOne(BookingKundali, { foreignKey: 'booking_id' })
Booking.hasOne(BookingSession, { foreignKey: 'booking_id' })
Booking.hasMany(BookingSamagriPackageDetail, { foreignKey: 'booking_id' })
Booking.hasMany(BookingTourDetail, { foreignKey: 'booking_id' })
Booking.hasOne(BookingTourDetail, { foreignKey: 'booking_id' })

BookingSession.belongsTo(Booking, { foreignKey: 'booking_id' })
BookingKundali.belongsTo(Booking, { foreignKey: 'booking_id' })
BookingMatch.belongsTo(Booking, { foreignKey: 'booking_id' })
BookingPackageDetail.belongsTo(Booking, { foreignKey: 'booking_id' })
BookingSamagriPackageDetail.belongsTo(Booking, { foreignKey: 'booking_id' })
BookingTourDetail.belongsTo(Booking, { foreignKey: 'booking_id' })




