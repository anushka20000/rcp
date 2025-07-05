import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { OrderDetail } from './OrderDetail';


interface OrderMembers {
  id: BigInt;
  user_id: BigInt
  user_address_id: BigInt
  order_id: string,
  razorpay_order_id: string,
  payment_id: string
  total: Number;
  shipping_amount: Number;
  address: string;
  alternate_phone: string;
  order_date: Date;
  name: string;
  phone: string;
  state: string;
  pincode: string;
  status: Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Order extends Model<OrderMembers>{
  //
}

Order.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
  },
  order_id: {
    type: DataTypes.STRING,
  },
  razorpay_order_id: {
    type: DataTypes.STRING,
  },
  payment_id: {
    type: DataTypes.STRING,
  },
  user_address_id: {
    type: DataTypes.BIGINT,
  },
  name: {
    type: DataTypes.STRING,
  },
  shipping_amount: {
    type: DataTypes.DOUBLE,
  },
  total: {
    type: DataTypes.DOUBLE,
  },
  phone: {
    type: DataTypes.STRING,
  },
  alternate_phone: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.TINYINT,
  },
  pincode: {
    type: DataTypes.STRING,
  },
  order_date: {
    type: DataTypes.DATE,
    defaultValue: null
  },
},
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "orders",
  })

export { Order, OrderMembers }

OrderDetail.belongsTo(Order, { foreignKey: 'order_id' })
// OrderDetailTranslate.belongsTo(Order, { foreignKey: 'order_id' })

Order.hasMany(OrderDetail, { foreignKey: ("order_id") })