import { Live, instance } from "../models/Live"
import * as dotenv from 'dotenv'
import { JoineeDetail } from "../models/JoineeDetails"
import { MeetingDetail } from "../models/MeetingDetails"
import { OrderDetail } from "../models/OrderDetail"
import { OrderDetailPujaTranslate } from "../models/OrderDetailPujaTranslate"
import { Puja } from "../models/Puja"
dotenv.config()
const AWS = require('aws-sdk')
const { v4: uuid } = require('uuid')

const region = process.env.REGION

const chime = new AWS.Chime({ region })

chime.endpoint = new AWS.Endpoint(
  process.env.END_POINT
)

const credentials = {
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECERET_ACCESS_KEY,
  // sessionToken: "sessionToken"
};

class LiveRepository {
  // POST

  async store(post: instance, files: any) {
    if (!post.live_link || !post.status)
      throw new Error('Must include all fields');


    else {
      let sampleFile;

      let uploadPath;

      if (!files || Object.keys(files).length === 0) {
        throw new Error('No files were uploaded.');
      }
      sampleFile = files.image;
      var file_name = new Date().getTime() + '_' + sampleFile.name;
      uploadPath = __dirname + '/upload/' + file_name;
      const path = '/upload/' + file_name
      sampleFile.mv(uploadPath, async function (err) {
        if (err)
          throw new Error(err);

        try {
          const data: any = { image: path, live_link: post.live_link, status: post.status }

          await Live.create(data)


        } catch (e: any) {
          return { error: e.errors[0].message };
        }
      });
      return { body: "Documents Updated" };
    }
  }

  //GET
  async get() {
    try {
      const res = await Live.findAll();
      return { body: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async liveDetailsAdmin() {
   
    const today = new Date().toLocaleDateString('en-GB');
    try {
      const datas = await OrderDetail.findAll({
        // where: { user_id: user.dataValues.id, id: orderId },
        where: { is_live: 1, date:today },
        //where: { user_id: 11, id: orderId },
       
            attributes: [
              "id",
              "order_id",
              "puja_id",
              "package_id",
              "puja_kit_id",
              "samagri_package_id",
              "astrology_product_id",
              "astrology_product_variation_id",
              "tour_id",
              "image",
              "thumb_image",
              "carat",
              "total",
              "date",
              "time",
              "is_live",
              "visiting_date",
              "meeting_id",
              "meeting_url",
              "status",
              "type",
            ],
            include: [
              
              {
                model: OrderDetailPujaTranslate,
              },
              {
                model: Puja,
              },
            ],
          
      });

      return { datas };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(put: instance, files: any, id: any) {
    const val = await Live.findOne({ where: { id } });
    if (!put.status || !put.live_link)
      throw new Error('Must include title');
    else {
      let sampleFile;
      let uploadPath;

      if (!files || Object.keys(files).length === 0) {
        throw new Error('No files were uploaded.');
      }
      sampleFile = files.image;
      var file_name = new Date().getTime() + '_' + sampleFile.name;
      uploadPath = __dirname + '/upload/' + file_name;
      const path = '/upload/' + file_name
      sampleFile.mv(uploadPath, async function (err) {
        if (err)
          throw new Error(err);
        try {
          const data: any = { image: path, status: put.status, live_link: put.live_link }
          await Live.update(data, { where: { id } })
        } catch (e: any) {
          return { error: e.errors[0].message };
        }
      });
      return { body: "Documents Updated" };
    }
  }
  //DELETE
  async delete(id: bigint) {
    const val = await Live.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Live.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }

    }
  }
  async list() {
    //to be implemented
  }
  async edit() {
    //to be implemented
  }
  async create() {
    //to be implemented
  }


  // amazon chime for video call/stream

  async createMeeting() {

    try {
      const meetingResponse = await chime.createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: region,
      }).promise();
      const payload = { meetingResponse };
      return {
        result: {
          message: 'Session Created Successfully',
          meeting: payload
        }
      }
    } catch (err) {
      return { error: err }
    }
  }

  async addAttendee(meeting_id, user_id) {
    try {
      const attendeeResponse = await chime.createAttendee({
        MeetingId: meeting_id,
        ExternalUserId: user_id
      }).promise();
      const payload = { attendeeResponse };
      return {
        result: {
          message: 'successfully Added a Attendee',
          meeting: payload
        }
      }
    } catch (err) {
      return { error: err }
    }
  }

  // joinee details
  async findJoineeDetailByPujaId(unique_meeting_id) {

    try {
      const joineeDetails = await JoineeDetail.findAll({
        where: { unique_meeting_id: unique_meeting_id }
      })
      return {
        result: joineeDetails
      }
    } catch (err) {
      return { error: err }
    }
  }

  async findJoineeDetailByAttendeeId(attendeeId) {

    try {
      const joineeDetails = await JoineeDetail.findOne({
        where: { attendeeId: attendeeId }
      })
      return {
        result: joineeDetails
      }
    } catch (err) {
      return { error: err }
    }
  }

  async findJoineeDetailByMeetingId(meetingId) {

    try {
      const joineeDetails = await JoineeDetail.findAll({
        where: { MeetingId: meetingId }
      })
      return {
        result: joineeDetails
      }
    } catch (err) {
      return { error: err }
    }
  }

  async createJoineeDetail(input) {

    try {
      const joineeDetails = await JoineeDetail.create({
        attendeeId: input.attendeeId,
        ExternalUserId: input.ExternalUserId,
        MeetingId: input.meetingId,
        unique_meeting_id: input.unique_meeting_id,
        name: input.name,
        user_id: input.user_id,
        JoinToken: input.JoinToken,
      })
    } catch (err) {
      return { error: err }
    }
  }

  async findMeetingDetailByUniqueMeetingId(unique_meeting_id) {

    try {
      const MeetingDetails = await MeetingDetail.findOne({
        where: { unique_meeting_id: unique_meeting_id }
      })
      return {
        result: MeetingDetails
      }
    } catch (err) {
      return { error: err }
    }
  }

  async findMeetingDetailByMeetingId(meeting_id) {

    try {
      const MeetingDetails = await MeetingDetail.findOne({
        where: { MeetingId: meeting_id }
      })
      return {
        result: MeetingDetails
      }
    } catch (err) {
      return { error: err }
    }
  }

  async createMeetingDetail(input) {
    try {
      const joineeDetails = await MeetingDetail.create({
        AudioFallbackUrl: input.AudioFallbackUrl,
        AudioHostUrl: input.AudioHostUrl,
        EventIngestionUrl: input.EventIngestionUrl,
        MediaRegion: input.MediaRegion,
        MeetingId: input.MeetingId,
        unique_meeting_id: input.unique_meeting_id,
        ScreenDataUrl: input.ScreenDataUrl,
        ScreenSharingUrl: input.ScreenSharingUrl,
        ScreenViewingUrl: input.ScreenViewingUrl,
        SignalingUrl: input.SignalingUrl,
        TurnControlUrl: input.TurnControlUrl,
      })
    } catch (err) {
      return { error: err }
    }
  }


}



export { LiveRepository };