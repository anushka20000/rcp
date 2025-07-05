import { RequestHandler } from "express";
import { Live } from "../models/Live";
import { LiveRepository } from "../repositories/LiveRepository";

const data = new LiveRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     Live:
 *       type: object
 *       required:
 *         - live_link
 *         - status
 *         - image
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the Live
 *         live_link:
 *           type: string
 *           description: The title of Live
 *         status:
 *           type: string
 *           description: The status of Live 
 *         image:
 *           type: string
 *           description: The image of the Live
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         deletedAt:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Lives
 *   description: The Live managing API
 */


// /**
//  * @swagger
//  * /live/store:
//  *   post:
//  *     summary: Create a new Live
//  *     tags: [Lives]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *           multipart/form-data:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                 live_link :
//  *                   type: string
//  *                 image:
//  *                   type: string
//  *                   format: base64
//  *     responses:
//  *       200:
//  *         description: The Live was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Live'
//  *       500:
//  *         description: Some server error
//  */
//CREATE 
export const saveLive: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store({ ...req.body }, req.files)
    return res.status(201).json({ data: created })
  } catch (e: any) {
    res.status(422).json({ error: ['could not create data', e.message] })
  }

};
// /**
//  * @swagger
//  * /live:
//  *   get:
//  *     summary: Returns the list of all the Lives
//  *     tags: [Lives]
//  *     responses:
//  *       200:
//  *         description: The list of the Live
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Live'
//  */


//GET 
export const getLive: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.get()
    return res.json({ data: datas })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
};
export const livePuja: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.liveDetailsAdmin()
    return res.json({ data: datas })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
};
// /**
// * @swagger
// * /live/update/{id}:
// *  put:
// *    summary: Update the Live by the id
// *    tags: [Lives]
// *    parameters:
// *      - in: path
// *        name: id
// *        schema:
// *          type: string
// *        required: true
// *        description: The Live id
// *    requestBody:
// *      required: true
// *      content:
// *        application/json:
// *          schema:
// *            $ref: '#/components/schemas/Live'
// *    responses:
// *      200:
// *        description: The Live was updated
// *        content:
// *          application/json:
// *            schema:
// *              $ref: '#/components/schemas/Live'
// *      404:
// *        description: The Live was not found
// *      500:
// *        description: Some error happened
// */
//UPDATE 
export const updateLive: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  try {
    await data.update(req.body, req.files, id)
    const updatedastro: Live | null = await Live.findByPk(id);
    return res.status(200).json({ data: updatedastro })
  } catch (e: any) {
    res.status(422).json({ error: ['could not update data', e.message] })
  }
};

// /**
//  * @swagger
//  * /live/delete{id}:
//  *   delete:
//  *     summary: Remove the Live by id
//  *     tags: [Lives]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The Live id
//  * 
//  *     responses:
//  *       200:
//  *         description: The Live was deleted
//  *       404:
//  *         description: The Live was not found
//  */


//DELETE 
export const destroyLive: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const destroy: Live | null = await Live.findByPk(id);
    await data.delete(id)
    return res.json({ data: destroy })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};


//create meeting 
export const createMeeting: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const createMeeting = await data.createMeeting();
    return res.json({ success: true, data: createMeeting })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// add attendee
export const addAttendee: RequestHandler = async (req, res, next) => {
  const meeting_id: any = req.params.meeting_id;
  const user_id: any = req.params.user_id;
  try {
    const addAttendee = await data.addAttendee(meeting_id, user_id);
    return res.json({ success: true, data: addAttendee })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/joinee-detail/puja-id/{puja_id}:
//  *   get:
//  *     summary: Returns the list of joinee details
//  *     tags: [Lives]
//  *     parameters:
//  *       - in: path
//  *         name: puja_id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The puja id
//  *     responses:
//  *       200:
//  *         description: The list of the joinee details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/lives'
//  */

export const findJoineeDetailByPujaId: RequestHandler = async (req, res, next) => {
  const unique_meeting_id: any = req.params.unique_meeting_id;
  try {
    const pujaDetail = await data.findJoineeDetailByPujaId(unique_meeting_id);
    return res.json({ success: true, data: pujaDetail })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/joinee-detail/attendeeId/{attendeeId}:
//  *   get:
//  *     summary: Returns the list of joinee details
//  *     tags: [Lives]
//  *     parameters:
//  *       - in: path
//  *         name: attendeeId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The attendeeId
//  *     responses:
//  *       200:
//  *         description: The list of the joinee details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/lives'
//  */

export const findJoineeDetailByAttendeeId: RequestHandler = async (req, res, next) => {
  const attendeeId: any = req.params.attendeeId;
  try {
    const pujaDetail = await data.findJoineeDetailByAttendeeId(attendeeId);
    return res.json({ success: true, data: pujaDetail })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/joinee-detail/meetingId/{meetingId}:
//  *   get:
//  *     summary: Returns the list of joinee details
//  *     tags: [Lives]
//  *     parameters:
//  *       - in: path
//  *         name: meetingId
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The meetingId
//  *     responses:
//  *       200:
//  *         description: The list of the joinee details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/lives'
//  */

export const findJoineeDetailByMeetingId: RequestHandler = async (req, res, next) => {
  const meetingId: any = req.params.meetingId;
  try {
    const pujaDetail = await data.findJoineeDetailByMeetingId(meetingId);
    return res.json({ success: true, data: pujaDetail })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/create-joinee-detail/:
//  *   post:
//  *     summary: Create a new joinee
//  *     tags: [Lives]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Live'
//  *     responses:
//  *       200:
//  *         description: The joinee was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Live'
//  *       500:
//  *         description: Some server error
//  */
export const createJoineeDetail: RequestHandler = async (req, res, next) => {

  try {
    const pujaDetail = await data.createJoineeDetail(req.body);
    return res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/meeting-detail/puja-id/{puja_id}:
//  *   get:
//  *     summary: Returns the list of meeting details
//  *     tags: [Lives]
//  *     parameters:
//  *       - in: path
//  *         name: puja_id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The puja id
//  *     responses:
//  *       200:
//  *         description: The list of the meeting details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/lives'
//  */

export const findMeetingDetailByPujaId: RequestHandler = async (req, res, next) => {
  const unique_meeting_id: any = req.params.unique_meeting_id;
  try {
    const meetingDetail = await data.findMeetingDetailByUniqueMeetingId(unique_meeting_id);
    return res.json({ success: true, data: meetingDetail })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

export const findMeetingDetailByMeetingId: RequestHandler = async (req, res, next) => {
  const meeting_id: any = req.params.meeting_id;
  try {
    const meetingDetail = await data.findMeetingDetailByMeetingId(meeting_id);
    return res.json({ success: true, data: meetingDetail, meeting_id: req.params.meeting_id })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/admin/create-meeting-detail/:
//  *   post:
//  *     summary: Create a new meeting
//  *     tags: [Lives]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Live'
//  *     responses:
//  *       200:
//  *         description: The metting was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Live'
//  *       500:
//  *         description: Some server error
//  */
export const createMeetingDetail: RequestHandler = async (req, res, next) => {

  try {
    const meetingDetails = await data.createMeetingDetail(req.body);
    return res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};