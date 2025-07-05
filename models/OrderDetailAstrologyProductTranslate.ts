import { DataTypes, Model } from 'sequelize';
import db from '../config/db'

interface OrderDetailAstrologyProductTranslateMembers {
  id: BigInt;
  ord_dt_id: BigInt;
  title: string;
  locale: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class OrderDetailAstrologyProductTranslate extends Model<OrderDetailAstrologyProductTranslateMembers>{
  //
}

OrderDetailAstrologyProductTranslate.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ord_dt_id: {
    type: DataTypes.BIGINT,
  },
  title: {
    type: DataTypes.STRING,
  },
  locale: {
    type: DataTypes.STRING,
  }
},
  {

    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "ord_dt_ast_prod_translates",
  })

export { OrderDetailAstrologyProductTranslateMembers, OrderDetailAstrologyProductTranslate }