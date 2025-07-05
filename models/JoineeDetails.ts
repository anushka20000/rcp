import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { Puja } from './Puja';
import { User } from './User';


interface JoineeDetails {
    id: BigInt,
    unique_meeting_id: String,
    user_id: BigInt,
    MeetingId: string,
    attendeeId: string,
    ExternalUserId: string,
    name: string,
    JoinToken: string,
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class JoineeDetail extends Model<JoineeDetails>{
    //
}

JoineeDetail.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    unique_meeting_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        comment: 'nullable'
    },
    MeetingId: {
        type: DataTypes.STRING,

    },
    attendeeId: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    ExternalUserId: {
        type: DataTypes.STRING,
    },
    JoinToken: {
        type: DataTypes.STRING,
    },
},
    {

        timestamps: true,
        paranoid: true,
        sequelize: db,
        tableName: "joinee_details",
    })

export { JoineeDetail, JoineeDetails }


// relations
// JoineeDetail.belongsTo(Puja, { foreignKey: 'puja_id' })
// JoineeDetail.belongsTo(User, { foreignKey: 'user_id' })

// Puja.hasMany(JoineeDetail, { foreignKey: 'puja_id' })
// User.hasMany(JoineeDetail, { foreignKey: 'user_id' })





