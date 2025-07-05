import { DataTypes, Model } from 'sequelize';
import db from '../config/db';
import { Booking } from './Booking';
import { OrderDetail } from './OrderDetail';
import { OrderDetailAstrologyProductTranslate } from './OrderDetailAstrologyProductTranslate';

interface AstrologyProductVariationMembers {
  id: BigInt;
  astrology_product_id: BigInt
  carat: number;
  price: number;
  discounted_price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class AstrologyProductVariation extends Model<AstrologyProductVariationMembers>{
  //
}

AstrologyProductVariation.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  astrology_product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  carat: {
    type: DataTypes.DOUBLE,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  discounted_price: {
    type: DataTypes.DOUBLE,

  },
},
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "astrology_product_variations",
  })

export { AstrologyProductVariationMembers, AstrologyProductVariation }


Booking.belongsTo(AstrologyProductVariation, { foreignKey: 'astrology_product_variation_id' })
OrderDetail.belongsTo(AstrologyProductVariation, { foreignKey: 'astrology_product_variation_id' })

