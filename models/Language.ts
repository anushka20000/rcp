import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { LanguageLocation } from './LanguageLocation';
import { LanguageTranslate } from './LanguageTranslate';
import { OrderDetail } from './OrderDetail';


interface LanguageMembers {
  id: BigInt;
  status: number;
  location_id: bigint;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Language extends Model<LanguageMembers>{
  //
}

Language.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  location_id: {
    type: DataTypes.BIGINT,
    // allowNull: false,
  }

},

  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "languages",
  })

export { Language, LanguageMembers }

LanguageTranslate.belongsTo(Language, { foreignKey: 'language_id' })
LanguageLocation.belongsTo(Language, { foreignKey: 'language_id' })
OrderDetail.belongsTo(Language, { foreignKey: 'language_id' })

Language.hasMany(LanguageTranslate, { foreignKey: 'language_id' })
Language.hasMany(LanguageLocation, { foreignKey: "language_id" }) 
Language.hasMany(OrderDetail, { foreignKey: "language_id" }) 


