import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { Language } from './Language';

interface LanguageLocationMembers {
  id: BigInt;
  language_id: BigInt;
  location_id: BigInt;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class LanguageLocation extends Model<LanguageLocationMembers>{
  //
}

LanguageLocation.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  language_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  location_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
},
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "language_locations",
  })

export { LanguageLocation, LanguageLocationMembers }


