import { RequestHandler } from "express";
import { Setting } from "../models/Setting";
import { SettingRepository } from "../repositories/SettingRepository";

const data = new SettingRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the Settings
 *         session_amount:
 *           type: double
 *           description: session amount
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
 *   name: settings
 *   description: The Settings managing API
 */



/**
 * @swagger
 * /v1/setting-details/{id}:
 *   get:
 *     summary: Returns the list of all the Settings
 *     tags: [settings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The settings id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {"datas": {"id": 1, "session_amount": 1000, "kundli_amount": 1000, "kundli_match_amount": 1000}}
 *               error:
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : {}
 *               error:
 */

//GET 
export const settingDetails: RequestHandler = async (req, res, next) => {
    let id = req.params.id
    try {
      const datas = await data.getById(id)
      return res.status(200).json({ success: true, data: datas, error:null })
    } catch (e: any) {
      res.status(404).json({ success: false, data:{}, error: ['could not read data', e.message] })
    }
  };

 
export const settingEdit: RequestHandler = async (req, res, next) => {
  try {
    const id:any = req.params.id
    const datas = await data.edit(id)
    return res.json({success:true, data: datas })
  } catch (e: any) {
    res.status(404).json({success:false, error: e.message })
  }
};




//UPDATE 
export const settingUpdate: RequestHandler = async (req, res, next) => {
  const id = req.body.id
  try {
    const updated = await data.update(req.body)
    const updates: Setting | null = await Setting.findByPk(id);
    return res.json({success: true })
  } catch (e: any) {
    res.status(400).json({success: false, error: e.message })
  }
};
