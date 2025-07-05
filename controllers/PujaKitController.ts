import { RequestHandler } from "express";
import { PujaKit } from "../models/PujaKit";
import { PujaKitRepository } from "../repositories/PujaKitRepository";

const data = new PujaKitRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     puja_kits:
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the PujaKit
 *         image:
 *           type: string
 *           description: The img of PujaKit
 *         price:
 *           type: DOUBLE
 *           description: The price of the PujaKit
 *         is_show:
 *           type: integer
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
 *   name: Puja Kits
 *   description: The Puja Kit managing API
 */
// /**
//  * @swagger
//  * /puja-kit:
//  *   get:
//  *     summary: Returns the list of all the PujaKits
//  *     tags: [Puja Kits]
//  *     responses:
//  *       200:
//  *         description: The list of the PujaKit
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/puja_kits'
//  */

//GET 
export const pujaKitList: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.list()
    return res.status(200).json({success:true, data: datas })
  } catch (e: any) {
    res.status(404).json({success: false, error: ['could not read data', e.message] })
  }
};


// /**
//  * @swagger
//  * /puja-kit/store:
//  *   post:
//  *     summary: Create a new PujaKit
//  *     tags: [Puja Kits]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *           multipart/form-data:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                 price :
//  *                   type: DOUBLE
//  *                 is_show :
//  *                   type: integer
//  *                 image:
//  *                   type: string
//  *                   format: base64
//  *     responses:
//  *       200:
//  *         description: The PujaKit was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/puja_kits'
//  *       500:
//  *         description: Some server error
//  */
//CREATE 
export const savePujaKit: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store({ ...req.body })
    return res.status(201).json({ success:true })
  } catch (e: any) {
    res.status(422).json({success:false, error: ['could not create data', e.message] })
  }

};
//edit


export const pujaKitEdit: RequestHandler = async (req, res, next) => {
  const id:any = req.params.id
  try {
    const datas = await data.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


// /**
//  * @swagger
//  * /puja-kit/update/{id}:
//  *  put:
//  *    summary: Update the PujaKit by the id
//  *    tags: [Puja Kits]
//  *    parameters:
//  *      - in: path
//  *        name: id
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: The PujaKit id
//  *    requestBody:
//  *      required: true
//  *      content:
//  *           multipart/form-data:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 price :
//  *                   type: DOUBLE
//  *                 is_show :
//  *                   type: integer
//  *                 image:
//  *                   type: string
//  *                   format: base64
//  *    responses:
//  *      200:
//  *        description: The PujaKit was updated
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/puja_kits'
//  *      404:
//  *        description: The PujaKit was not found
//  *      500:
//  *        description: Some error happened
//  */
//UPDATE 
export const updatePujaKit: RequestHandler = async (req, res, next) => {

  try {
    await data.update(req.body)
    return res.status(200).json({ success:true })
  } catch (e: any) {
    res.status(422).json({ success:false,error: ['could not update data', e.message] })
  }
};
// /**
//  * @swagger
//  * /puja-kit/delete/{id}:
//  *   delete:
//  *     summary: Remove the PujaKit by id
//  *     tags: [Puja Kits]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The PujaKit id
//  *         content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/puja_kits'
//  *     responses:
//  *       200:
//  *         description: The PujaKit was deleted
//  *       404:
//  *         description: The PujaKit was not found
//  */


//DELETE 
export const destroyPujaKit: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const destroy: PujaKit | null = await PujaKit.findByPk(id);
    await data.delete(id)
    return res.json({ success:true })
  } catch (e: any) {
    res.status(400).json({ success:false,error: e.message })
  }
};

/**
 * @swagger
 * /v1/puja-kits/{locale}:
 *   get:
 *     summary: Returns the list of all the Puja Kits
 *     tags: [Puja Kits]
 *     parameters:
 *       - in: path
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ "en", "hi"]
 *         required: true
 *         default: en
 *         description: locale
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: order
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {datas : [0: {PujaKit: {PujaKitTranslates: [0: {id: 1, puja_kit_id: 1, title: "puja kit", slug: "puja-kit", locale: "en"}], id: 1, image: "https://cdn.pujapathbooking.com/samagri/cate-img1_pujapath_thumbnail.jpg", price: 560}, puja_kit_id: 1} ],
 *                      }
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
export const pujaKitListing = async (req, res, next) => {
  const locale: any = req.params.locale ? req.params.locale : 'en'
  const search :any = req.query.search && req.query.search != '' ? req.query.search : null
  const order :any = req.query.order && req.query.order != '' ? req.query.order : null

  try {
    const datas = await data.lists(locale, search, order)
    return res.status(200).json({success:true, data:datas, error:null})
  } catch (e: any) {
    res.status(422).json({success:false,data:{}, error: ['Unable To Find Data', e.message] })

  }
}


/**
 * @swagger
 * /v1/samagri-packages/{slug}/{locale}:
 *   get:
 *     summary: Returns the list of all the puja kit
 *     tags: [Puja Kits]
 *     parameters:
 *       - in: path
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ "en", "hi"]
 *         required: true
 *         default: en
 *         description: locale
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: slug
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {datas : [0 : {PujaKit: {PujaKitTranslates: [0: {id: 3, puja_kit_id: 2, title: "premium puja kit", slug: "premium-puja-kit", locale: "en"}], SamagriPackages: [], id: 2, image: "https://cdn.pujapathbooking.com/samagri/cate-img1_pujapath_thumbnail.jpg", is_show: 1, price: 1500}, id: 3, puja_kit_id: 2, slug: "premium-puja-kit"} ],
 *                      }
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

export const pujaKitDetail = async (req, res, next) => {
  const locale: any = req.params.locale ? req.params.locale : 'en'
  const slug :any = req.params.slug
  try {
    const datas = await data.pujaKitDetails(slug, locale)
    return res.status(200).json({success: true, data:datas, error:null})
  } catch (e: any) {
    res.status(422).json({success:true, data:{}, error: ['Unable To Find Data', e.message] })

  }
}

export const pujaKitSeo = async (req, res, next) => {
  const slug :any = req.params.slug
  try {
    const seo = await data.pujaKitSeo(slug)
    return res.status(200).json({success: true, data:seo, error:null})
  } catch (e: any) {
    res.status(422).json({success:true, data:{}, error: ['Unable To Find Data', e.message] })

  }
}