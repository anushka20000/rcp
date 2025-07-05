import Express, { Request, Response } from "express";
import { Tour } from "../models/Tour";
import { TourRepository } from "../repositories/TourRepository";

const repository = new TourRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    tours:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          location_id:
 *            type: bigint
 *            description: location_id
 *          thumb_image :
 *            type: string
 *            description: thumb_image .
 *          image:
 *            type: string
 *            description: image.
 *          address :
 *            type: string
 *            description: address.
 *          visit_date :
 *            type: date
 *            description: visit date .
 *          price :
 *            type: DOUBLE
 *            description: price .
 *          discounted_price :
 *            type: DOUBLE
 *            description: discounted_price  .
 *          status :
 *            type: tinyint
 *            description: status  .
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
 *   name: tour
 *   description: The tour managing API
 */


const saveTour = async (req: Request, res: Response) => {

  try {
    const created = await repository.store({ ...req.body })
    return res.status(201).json({ success:true,data: created })
  } catch (e: any) {
    res.status(422).json({success:false, error: ['could not create data', e.message] })
  }
}

const readTour = async (req: Request, res: Response) => {
  try {
    const datas = await repository.create()
    return res.status(200).json({success:true, data: datas })
  } catch (e: any) {
    res.status(404).json({success:false, error: ['could not read data', e.message] })
  }

};

const editTour = async (req: Request, res: Response) => {
  const id: any = req.params.id

  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

const updateTour = async (req: Request, res: Response) => {
  
  try {
    await repository.update(req.body)
    return res.status(200).json({success:true})
  } catch (e: any) {
    res.status(422).json({success:false, error: ['could not update data', e.message] })
  }

};


const destroyTour = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: Tour | null = await Tour.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success:true,data: deletes })
  } catch (e: any) {
    res.status(422).json({success:false, error: ['could not delete data', e.message] })
  }

};



/**
 * @swagger
 * /v1/religious-tours/{locale}:
 *   get:
 *     summary: Returns the list of all the tour
 *     tags: [tour]
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
 *         name: location
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {datas : [0 : {Tour: {Location: {LocationTranslates: [0: {id: 1, location_id: 1, title: "Delhi"}], id: 1, image: "https://cdn.pujapathbooking.com/location/c-5_pujapath_thumbnail.png"}, TourTranslates: [0: {description: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>", id: 1, locale: "en", slug: "ganpati-puja", title: "Ganpati Puja", tour_id: 1}], address: "NABI MUMBAI", discounted_price: null, id: 1, image: "https://cdn.pujapathbooking.com/tour/cate-img1.jpg", location_id: 1, price: 20000, status: 1, thumb_image: "https://cdn.pujapathbooking.com/tour/cate-img1_pujapath_thumbnail.jpg", visit_date: "2023-01-04T06:04:27.000Z"}, id: 1, tour_id: 1} ],
 *                       location : [0: {LocationTranslates: [0: {id: 1, location_id: 1, title: "Delhi"}], id: 1, image: "https://cdn.pujapathbooking.com/location/c-5_pujapath_thumbnail.png"}],
 *                       locations : [0: {LocationTranslates: [0: {id: 1, location_id: 1, title: "Delhi"}], id: 1, image: "https://cdn.pujapathbooking.com/location/c-5_pujapath_thumbnail.png"}]
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
const tourListing = async (req: Request, res: Response) => {
  const locale = req.params.locale ? req.params.locale : 'en';
  const search = req.query.search && req.query.search != '' ? req.query.search : null;
  const locationId = req.query.location && req.query.location != '' ? req.query.location : null;
  try {
    const datas = await repository.lists(locale, search, locationId);
    return res.status(200).json({ success: true, data: datas, error:null });
  } catch (e: any) {
    res.status(404).json({ success: false, data:{}, error: ['could not read data', e.message] })
  }
}


/**
 * @swagger
 * /v1/religious-tour/{slug}/{locale}:
 *   get:
 *     summary: Returns the list of all the tour
 *     tags: [tour]
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
 *               data : {datas : [0: {Tour: {TourDetails: [0: {TourDetailItems: [0: {TourDetailItemTranslates: [0: {id: 1, tour_detail_item_id: 1, title: "curd", locale: "en"}], id: 1, price: 100, quantity: "500gm", tour_detail_id: 1}], TourDetailTranslates: [0: {0: {id: 1, tour_detail_id: 1, title: "Samagri", locale: "en"}}], id: 1, is_required: 1, item_selectable: 0, price: 500, tour_id: 1}], TourTranslates: [0: {description: "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>", id: 1, locale: "en", slug: "ganpati-puja", title: "Ganpati Puja", tour_id: 1}], address: "NABI MUMBAI", discounted_price: null, id: 1, image: "https://cdn.pujapathbooking.com/tour/cate-img1.jpg", location_id: 1, price: 20000, status: 1, thumb_image: "https://cdn.pujapathbooking.com/tour/cate-img1_pujapath_thumbnail.jpg", visit_date: "2023-01-04T06:04:27.000Z"}, id: 1}] 
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
const tourDetail = async (req: Request, res: Response) => {
  const locale = req.params.locale ? req.params.locale : 'en';
  const slug = req.params.slug;
  const search = req.query.search && req.query.search != '' ? req.query.search : null;
  try {
    const datas = await repository.tourDetails(slug, locale, search);
    return res.status(200).json({success: true, data: datas})
  } catch (e: any) {
    res.status(404).json({ success: false,data:{}, error: ['could not read data', e.message] })
  }
}

const tourDetailSeo = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  
  try {
    const seo = await repository.tourDetailSeo(slug);
    return res.status(200).json({success: true, data: seo})
  } catch (e: any) {
    res.status(404).json({ success: false,data:{}, error: ['could not read data', e.message] })
  }
}

export { saveTour, readTour, updateTour, destroyTour, tourListing, tourDetail, editTour, tourDetailSeo }