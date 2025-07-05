import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { AstrologyProductVariation } from './AstrologyProductVariation';
import { AstrologyProductTranslate } from './AstrologyProductTranslate';
import { Booking } from './Booking';
import { OrderDetail } from './OrderDetail';
import { OrderDetailAstrologyProductTranslate } from './OrderDetailAstrologyProductTranslate';

interface AstrologyProductMembers{
  id: BigInt;
  image: string;
  price: number;
  type: Number;
  meta_title: string;
  meta_keywords: Text;
  meta_image: string;
  meta_description:Text;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class AstrologyProduct extends Model<AstrologyProductMembers>{
  //
}

AstrologyProduct.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
  type: {
    type: DataTypes.TINYINT,
    comment: '1->Stone, 2-> Non-stone'
  },
  meta_title: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  meta_image: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  meta_description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
},
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "astrology_products",
  })

export { AstrologyProduct, AstrologyProductMembers }

AstrologyProductVariation.belongsTo(AstrologyProduct, { foreignKey: 'astrology_product_id' })
AstrologyProductTranslate.belongsTo(AstrologyProduct, { foreignKey: 'astrology_product_id' })
Booking.belongsTo(AstrologyProduct, { foreignKey: 'astrology_product_id' })
OrderDetail.belongsTo(AstrologyProduct, { foreignKey: 'astrology_product_id' })
OrderDetailAstrologyProductTranslate.belongsTo(AstrologyProduct, { foreignKey: 'product_id' })

AstrologyProduct.hasMany(AstrologyProductTranslate, { foreignKey: 'astrology_product_id' })
AstrologyProduct.hasMany(AstrologyProductVariation, { foreignKey: 'astrology_product_id' }) 
AstrologyProduct.hasMany(OrderDetailAstrologyProductTranslate, { foreignKey: 'product_id' })
AstrologyProduct.hasMany(OrderDetail, { foreignKey: 'product_id' })
AstrologyProduct.hasMany(Booking, { foreignKey: 'product_id' })