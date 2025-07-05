import { DataTypes, Model } from 'sequelize';
import db from '../config/db'
import { Puja } from './Puja';
import { User } from './User';


interface MeetingDetails {
    id: BigInt,
    unique_meeting_id: String,
    MeetingId: String,
    AudioFallbackUrl: String,
    AudioHostUrl: string,
    EventIngestionUrl: string,
    ScreenDataUrl: string,
    ScreenSharingUrl: string,
    ScreenViewingUrl: string,
    SignalingUrl: string,
    TurnControlUrl: string,
    MediaRegion: string,
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

class MeetingDetail extends Model<MeetingDetails>{
    //
}

MeetingDetail.init({
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
    MeetingId: {
        type: DataTypes.STRING,
    },
    AudioFallbackUrl: {
        type: DataTypes.STRING,
    },
    AudioHostUrl: {
        type: DataTypes.STRING,
    },
    EventIngestionUrl: {
        type: DataTypes.STRING,
    },
    ScreenDataUrl: {
        type: DataTypes.STRING,
    },
    ScreenSharingUrl: {
        type: DataTypes.STRING,
    },
    ScreenViewingUrl: {
        type: DataTypes.STRING,
    },
    SignalingUrl: {
        type: DataTypes.STRING,
    },
    TurnControlUrl: {
        type: DataTypes.STRING,
    },
    MediaRegion: {
        type: DataTypes.STRING,
    },
},
    {

        timestamps: true,
        paranoid: true,
        sequelize: db,
        tableName: "meeting_details",
    })

export { MeetingDetail, MeetingDetails }






// Puja.belongsTo(MeetingDetail, { foreignKey: 'puja_id' })

// MeetingDetail.hasMany(Puja, { foreignKey: 'puja_id' })



