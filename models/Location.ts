import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { Booking } from './Booking';
import { Language } from './Language';
import { LanguageLocation } from './LanguageLocation';
import { LocationTranslate } from './LocationTranslate';
import { OrderDetail } from './OrderDetail';
import { OrderDetailTour } from './OrderDetailTour';
import { PujaLocation } from './PujaLocation';
import { Tour } from './Tour';


interface LocationMembers {
  id: BigInt;
  status: number;
  image: string
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Location extends Model<LocationMembers>{
  //
}

Location.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  status: {
    type: DataTypes.TINYINT,
    defaultValue:1
  },
  image: {
    type: DataTypes.STRING,
  }
},
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "locations",
  })

export { LocationMembers, Location }

LocationTranslate.belongsTo(Location, { foreignKey: 'location_id' })
PujaLocation.belongsTo(Location, { foreignKey: 'location_id' })
OrderDetailTour.belongsTo(Location, { foreignKey: 'location_id' })
Tour.belongsTo(Location, { foreignKey: "location_id" })
Booking.belongsTo(Location, { foreignKey: "location_id" })
OrderDetail.belongsTo(Location, { foreignKey: "location_id" })
// Language.belongsTo(Location, { foreignKey: "location_id" })
LanguageLocation.belongsTo(Location, { foreignKey: 'location_id' })

Location.hasMany(PujaLocation, { foreignKey: "location_id" })
Location.hasMany(LocationTranslate, { foreignKey: "location_id" })
Location.hasMany(Tour, { foreignKey: "location_id" })
Location.hasMany(Booking, { foreignKey: "location_id" })
Location.hasMany(OrderDetail, { foreignKey: "location_id" })
// Location.hasMany(Language, { foreignKey: "location_id" })
Location.hasMany(LanguageLocation, { foreignKey: "location_id" })




