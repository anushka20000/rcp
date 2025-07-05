import { RequestHandler } from "express";
import { AuthRepository } from "../repositories/AuthRepository";

const data = new AuthRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     Auth:
 *       type: object
 *       required:
 *         - email
 *         - phone
 *         - otp
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the User login
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         otp:
 *           type: number
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
  *   name: Auth
  *   description: The Auth managing API
  */



/**
 * @swagger
 * /v1/login:
 *   post:
 *     summary: Login a User (Email OR Phone and Lang(en, hi) is required)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: integer
 *               lang :
 *                 type: string
 *                 required: true
 *                 enum: [ "en", "hi"]
 *                 default: en
 *     responses:
 *       200:
 *         description: The Otp is successfully sent
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {}
 *               error : 
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : {}
 *               error : 
 */
//find user and generate otp  
export const login: RequestHandler = async (req, res, next) => {
    try {
        const loginCrediential = await data.Login(req.body)
        return res.json({ success: true, data: loginCrediential, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false, data:{}, error: e.message })
    }
}

/**
 * @swagger
 * /v1/verify-otp:
 *   post:
 *     summary: Verify the otp (Email OR phone is required)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: integer
 *               booking_token :
 *                 type: string
 *               otp:
 *                 type: integer
 *                 required: true
 *     responses:
 *       200:
 *         description: The User is successfully Logged in
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImVtYWlsIjoic2hydXRpQGFzY2VudHNwYXJrLmNvbSIsInR5cGUiOjIsImlhdCI6MTY3NzA0NTQwNSwiZXhwIjoxNjc4NzczNDA1fQ.iV-igujOmrU5YtX5LVplSEkW3NRdQz4tdr5_cMC59WU}
 *               error : 
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : {}
 *               error : Incorrect OTP
 */
export const verifyOTP: RequestHandler = async (req, res, next) => {
    try {
        const loginCrediential = await data.verifyOTP(req.body)
        return res.json({ success: true, data: loginCrediential, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false,  data: null, error: e.message })
    }
}

export const adminLogin: RequestHandler = async (req, res, next) => {
    try {
        const response = await data.adminLogin(req.body);
        return res.json({ success: true, data: response, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false, data:null, error: e.message })
    }
}

export const findUserByEmail: RequestHandler = async (req, res, next) => {
    let email = req.params.email

    try {
        const response = await data.getUserByEmail(email);
        return res.json({ success: true, data: response, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false, data:null, error: e.message })
    }
}
export const findUserByEmailAdmin: RequestHandler = async (req, res, next) => {
    let email = req.params.email

    try {
        const response = await data.getUserByEmailAdmin(email);
        return res.json({ success: true, data: response, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false, data:null, error: e.message })
    }
}
export const findUserByPhoneAdmin: RequestHandler = async (req, res, next) => {
    let phone = req.params.phone

    try {
        const response = await data.getUserByPhoneAdmin(phone);
        return res.json({ success: true, data: response, error: null })
    } catch (e: any) {
        res.status(400).json({ success: false, data:null, error: e.message })
    }
}
