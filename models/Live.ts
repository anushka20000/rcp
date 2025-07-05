import { DataTypes, Model } from 'sequelize';
import db from '../config/db';


export interface instance {
  id: BigInt;
  image: string;
  live_link: string;
  status:Number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Live extends Model<instance>{
 
}

Live.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
 
    },
    live_link: {
        type: DataTypes.STRING,
      
      }, 
       status: {
        type: DataTypes.TINYINT,
     
      },
  },
  {
    timestamps: true,
    paranoid: true,
    sequelize: db,
    tableName: "lives",
  }

)
