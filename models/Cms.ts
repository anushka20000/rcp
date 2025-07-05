import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { CmsTranslate } from './CmsTranslate';

interface Cms {
  id: BigInt;
  status: Number;
  type: Number;
  image: string;
  page: string;
  meta_title: string;
  meta_keywords: Text;
  meta_image: string;
  meta_description:Text;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class cms extends Model<Cms>{
  //
}

cms.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },

  status: {
    type: DataTypes.TINYINT,
  },
  type: {
    type: DataTypes.TINYINT,
    comment: '1--> normal, 2-->homepage card, 3--> astrology category card'
  },
  image: {
    type: DataTypes.STRING,
  },
  page: {
    type: DataTypes.STRING,
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
    tableName: "cms",
  })

export { Cms, cms }

CmsTranslate.belongsTo(cms, { foreignKey: 'cms_id' })

cms.hasMany(CmsTranslate, { foreignKey: 'cms_id' })
