import { RequestHandler } from "express";
import { SamagriPackage } from "../models/SamagriPackage";
import { SamagriPackageRepository } from "../repositories/SamagriPackageRepository";

const data = new SamagriPackageRepository()
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     SamagriPackage:
//  *       type: object
//  *       required:
//  *         - puja_kit_id
//  *         - image
//  *         - quantity
//  *         - price
//  *         - discounted-price
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: The auto-generated id of the SamagriPackage
//  *         puja_kit_id:
//  *           type: integer
//  *           description: The auto-generated id of the puja kit
//  *         image:
//  *           type: string
//  *           description: The img of SamagriPackage
//  *         quantity:
//  *           type: integer
//  *           description: The quantity of the SamagriPackage
//  *         price:
//  *           type: DOUBLE
//  *         discounted_price:
//  *           type: DOUBLE
//  *         createdAt:
//  *           type: string
//  *         updatedAt:
//  *           type: string
//  *         deletedAt:
//  *           type: string
//  */

//  /**
//   * @swagger
//   * tags:
//   *   name: SamagriPackage
//   *   description: The SamagriPackage managing API
//   */


//GET 
export const samagriPackageList: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.list()
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
}

//CREATE 
export const samagriPackageSave: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store({ ...req.body })
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not create data', e.message] })
  }

};

export const packageListByPujaKitId: RequestHandler = async (req, res, next) => {
  const puja_kit_id: any = req.params.puja_kit_id
  try {
    const datas = await data.packageByPujaKitId(puja_kit_id)
    return res.status(200).json({ success: true, data: datas })

  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

export const samagriPackageEdit: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id
  try {
    const datas = await data.edit(id)
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

//UPDATE 
export const samagriPackageUpdate: RequestHandler = async (req, res, next) => {

  try {
    await data.update(req.body);

    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not update data', e.message] })
  }
};

//DELETE 
export const samagriPackageDestroy: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const destroy: SamagriPackage | null = await SamagriPackage.findByPk(id);
    await data.delete(id)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message })
  }
};

