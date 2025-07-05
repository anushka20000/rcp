import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import { OrderDetailSession } from "./OrderDetailSession";
import { OrderDetailMatch } from "./OrderDetailMatch";
import { OrderDetailKundli } from "./OrderDetailKundli";
import { OrderDetailPujaParticipant } from "./OrderDetailPujaParticipant";
import { OrderDetailSamagriPackage } from "./OrderDetailSamagriPackage";
import { OrderDetailPujaKit } from "./OrderDetailPujaKit";
import { OrderDetailTour } from "./OrderDetailTour";
import { OrderDetailPujaTranslate } from "./OrderDetailPujaTranslate";
import { OrderDetailPackageTranslate } from "./OrderDetailPackageTranslate";
import { OrderDetailPackageDetail } from "./OrderDetailPackageDetail";
import { OrderDetailAstrologyProductTranslate } from "./OrderDetailAstrologyProductTranslate";
import { OrderDetailKitPackageTranslate } from "./OrderDetailKitPackageTranslate";
import { Location } from "./Location";

interface OrderDetailMembers {
  id: BigInt;
  order_id: BigInt;
  puja_id: BigInt;
  package_id: BigInt;
  puja_kit_id: BigInt;
  pandit_id: bigint;
  samagri_package_id: BigInt;
  astrology_product_id: BigInt;
  astrology_product_variation_id: BigInt;
  tour_id: BigInt;
  image: string;
  thumb_image: string;
  carat: string;
  total: Number;
  date: Date;
  time: TimeRanges;
  is_live: Number;
  visiting_date: Date;
  meeting_id: string;
  meeting_url: string;
  status: number;
  type: Number;
  location_id: BigInt;
  language_id: BigInt;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class OrderDetail extends Model<OrderDetailMembers> {
  //
}

OrderDetail.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    puja_id: {
      type: DataTypes.BIGINT,

    },
    package_id: {
      type: DataTypes.BIGINT,

    },
    puja_kit_id: {
      type: DataTypes.BIGINT,

    },
    pandit_id: {
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
    total: {
      type: DataTypes.DOUBLE,

    },
    image: {
      type: DataTypes.STRING,

    },
    thumb_image: {
      type: DataTypes.STRING,

    },
    location_id: {
      type: DataTypes.BIGINT,
      defaultValue: null
    },
    language_id: {
      type: DataTypes.BIGINT,
      defaultValue: null
    },
    carat: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
    visiting_date: {
      type: DataTypes.DATE,
    },
    time: {
      type: DataTypes.TIME,
    },
    is_live: {
      type: DataTypes.TINYINT,
    },
    meeting_id: {
      type: DataTypes.STRING,
    },
    meeting_url: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.TINYINT,
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      comment: '1->puja_package, 2->samagri package, 3-> astrology product, 4-> tour_id, 5-> kundli, 6-> astrologer, 7-> kundli match'
    }
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "order_details",
  })

export { OrderDetailMembers, OrderDetail };

OrderDetail.hasOne(OrderDetailPujaParticipant, { foreignKey: 'ord_dt_id' })
OrderDetail.hasOne(OrderDetailMatch, { foreignKey: 'ord_dt_id' })
OrderDetail.hasOne(OrderDetailKundli, { foreignKey: 'ord_dt_id' })
OrderDetail.hasOne(OrderDetailSession, { foreignKey: 'ord_dt_id' })
OrderDetail.hasMany(OrderDetailSamagriPackage, { foreignKey: 'order_detail_id' })
OrderDetail.hasMany(OrderDetailPujaKit, { foreignKey: 'order_detail_id' })
OrderDetail.hasOne(OrderDetailTour, { foreignKey: 'order_detail_id' })
OrderDetail.hasMany(OrderDetailPackageDetail, { foreignKey: 'order_detail_id' })
OrderDetail.hasMany(OrderDetailPackageTranslate, { foreignKey: 'order_detail_id' })
OrderDetail.hasMany(OrderDetailAstrologyProductTranslate, { foreignKey: 'ord_dt_id' })
OrderDetail.hasMany(OrderDetailPujaTranslate, { foreignKey: 'order_detail_id' })
OrderDetail.hasMany(OrderDetailKitPackageTranslate, { foreignKey: 'ord_dt_id' })

OrderDetailPujaParticipant.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailMatch.belongsTo(OrderDetail, { foreignKey: 'ord_dt_id' })
OrderDetailKundli.belongsTo(OrderDetail, { foreignKey: 'ord_dt_id' })
OrderDetailSession.belongsTo(OrderDetail, { foreignKey: 'ord_dt_id' })
OrderDetailSamagriPackage.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailPujaKit.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailTour.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailPackageDetail.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailPackageTranslate.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailAstrologyProductTranslate.belongsTo(OrderDetail, { foreignKey: 'ord_dt_id' })
OrderDetailPujaTranslate.belongsTo(OrderDetail, { foreignKey: 'order_detail_id' })
OrderDetailKitPackageTranslate.belongsTo(OrderDetail, { foreignKey: 'ord_dt_id' })





