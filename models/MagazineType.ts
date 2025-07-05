import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { OrderDetail } from './OrderDetail';


interface MagazineTypeMembers {
  id: BigInt;
  type_id: BigInt;
  magazine_id: BigInt;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class MagazineType extends Model<MagazineTypeMembers>{
  //
}

MagazineType.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  type_id: {
    type: DataTypes.BIGINT,
    // allowNull: false,
  },
  magazine_id: {
    type: DataTypes.BIGINT,
    // allowNull: false,
  }

},

  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "magazine_types",
  })

export { MagazineType, MagazineTypeMembers }


