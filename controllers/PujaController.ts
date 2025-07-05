import Express, { Request, Response } from "express";
import { Puja } from "../models/Puja";
import { PujaRepository } from "../repositories/PujaRepository";

const repository = new PujaRepository()

/**
 * @swagger
 *  components:
 *   schemas:
 *    pujas:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          image :
 *            type: string
 *            description: image 
 *          on_site  :
 *            type: tinyint
 *            description: on_site  .
 *          on_location  :
 *            type: tinyint
 *            description: on_location  .
 *          show_on_pooja_page :
 *            type: tinyint
 *            description: show_on_pooja_page .
 *          can_book  :
 *            type: tinyint
 *            description: can_book .
 *          order  :
 *            type: integer
 *            description: order  .
 *          status :
 *            type: tinyint
 *            description: status.
 *          createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation.
 *          updatedAt:
 *            type: string
 *            format: date
 *            description: The date of the record updation.
 *          deletedAt:
 *            type: string
 *            format: date
 *            description: The date of the record deletion.
 */

/**
 * @swagger
 * tags:
 *   name: Puja
 *   description: The Puja managing API
 */



const pujaList = async (req: Request, res: Response) => {
  try {
    const datas = await repository.list()
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: ['could not read data', e.message] })
  }

};



const pujaSave = async (req: Request, res: Response) => {
  try {
    const created = await repository.store({ ...req.body })
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(400).json({ success: false, error: ['could not create data', e.message] })
  }

};

const pujaEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


const pujaUpdate = async (req: Request, res: Response) => {
  try {
    await repository.update(req.body)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not update data', e.message] })
  }

};


const pujaDestroy = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: Puja | null = await Puja.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not delete data', e.message] })
  }

};

/**
 * @swagger
 * /v1/pujas/{locale}:
 *   get:
 *     summary: Returns the list of all the Pujas
 *     tags: [Puja]
 *     parameters:
 *       - in: path
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [ "en", "hi"]
 *         required: true
 *         default: en
 *         description: locale
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {categories : [0: {id: 1, CategoryTranslates: [{category_id: 1, title: "Ceremonial Puja"}]}],
 *                       datas : [0: {Puja: {PujaCategories: [{id: 1, puja_id: 1, category_id: 1}], PujaLocations: [{id: 1, puja_id: 1, location_id: 2}], PujaTranslates: [{0: {description: "<p>Lorem Ipsum is simply publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>", id: 1, locale: "en", puja_id: 1, samagri_description: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting<p>", short_description: "", slug: "satyanarayan-puja", title: "Satyanarayan Puja"}}], id: 1, image: "https://cdn.pujapathbooking.com/puja/cate-img1_pujapath_thumbnail.jpg", on_location: 1, on_site: 1, order: 5, show_on_pooja_page: 1, status: 1}}, puja_id: 1],
 *                       locations : [0: {LocationTranslates: [{location_id: 1, title: "Delhi"}], id: 1, image: "https://cdn.pujapathbooking.com/location/c-5_pujapath_thumbnail.png"}]
 *                      }
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
const pujaListing = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const location: any = req.query.location && !Number.isNaN(req.query.location) ? req.query.location : 0;
  const category: any = req.query.category && !Number.isNaN(req.query.category) ? req.query.category : 0;
  const search: any = req.query.search && req.query.search != '' ? req.query.search : null;

  try {
    const datas = await repository.lists(locale, location, category, search)
    return res.status(200).json({ success: true, data: datas, error: null })
  } catch (e: any) {
    res.status(422).json({ success: false, data: null, error: ['could not delete data', e.message] })
  }
}

/**
 * @swagger
 * /v1/online-booking-puja/{slug}/{locale}:
 *  get:
 *    summary:  Puja 
 *    tags: [Puja]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *        description: The Puja slug
 *      - in: path
 *        name: locale
 *        schema:
 *          type: string
 *          enum: [ "en", "hi"]
 *        required: true
 *        default: en
 *        description: locale
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {datas : [0 : {Puja: {PujaImages: [0: {id: 1, image: "https://cdn.pujapathbooking.com/puja/cate-img1_pujapath_thumbnail.jpg"}], PujaLocations: [0: {Location: {id: 2, LocationTranslates: [{location_id: 2, title: "Kolkata"}]}, id: 1, location_id: 2, puja_id: 1}], PujaTranslates: [0: {description: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>", samagri_description: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>", short_description: "<strong>Lorem Ipsum</strong> ", title: "Satyanarayan Puja"}], galleries: [0: {id: 1, image: "https://cdn.pujapathbooking.com/puja/cate-img1.jpg"}], id: 1, image: "https://cdn.pujapathbooking.com/puja/cate-img1_pujapath_thumbnail.jpg", on_location: 1, on_site: 1, order: 5, show_on_pooja_page: 1, status: 1}, id: 1, puja_id: 1}],
 *                     
 *                     }
 *              error:
 *      500:
 *        description: Some server error
 *        content:
 *          application/json:
 *            example:
 *              success : false
 *              data : {}
 *              error:
 */

const pujaFrontendAPI = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const slug: any = req.params.slug
  try {
    const datas = await repository.pujaFrontendList(locale, slug)
    return res.status(200).json({ success:true, data: datas, error: null })
  } catch (e: any) {
    res.status(422).json({ success: false, data:{}, error: ['Unable To Find Data', e.message] })

  }
}


// /**
//  * @swagger
//  * /v1/puja/{slug}/{locale}:
//  *   get:
//  *     summary: Returns the list of all the Pujas
//  *     tags: [Puja]
//  *     parameters:
//  *       - in: path
//  *         name: slug
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: slug
//  *         content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/pujas'
//  *       - in: path
//  *         name: locale
//  *         schema:
//  *           type: string
//  *         required: false
//  *         default: en
//  *         description: locale
//  *         content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/pujas'
//  *     responses:
//  *       200:
//  *         description: The list of the Puja details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/pujas'
//  */
const pujaDetails = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const slug: any = req.params.slug

  try {
    const datas = await repository.pujaDetails(slug, locale)
    return res.status(200).json({ success: true, data: datas, error: null })
  } catch (e: any) {
    res.status(422).json({ success: false,  data: null, error: ['could not delete data', e.message] })

  }
}

const pujaSeo = async (req: Request, res: Response) => {
  const slug: any = req.params.slug

  try {
    const seo = await repository.pujaSeo(slug)
    return res.status(200).json({ success: true, data: seo})
  } catch (e: any) {
    res.status(422).json({ success: false,  data: null, error: ['could not delete data', e.message] })

  }
}

export { pujaList, pujaSave, pujaEdit, pujaDestroy, pujaUpdate, pujaFrontendAPI, pujaDetails, pujaListing, pujaSeo }
