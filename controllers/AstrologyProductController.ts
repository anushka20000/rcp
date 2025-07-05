import Express, { Request, Response } from "express";
import { AstrologyProduct } from "../models/AstrologyProduct";
import { AstrologerStoreRepository } from "../repositories/AstrologyProductRepository";

const repository = new AstrologerStoreRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    astrology_products:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          price :
 *            type: DOUBLE
 *            description: price.
 *          image :
 *            type: string
 *            description: image.
 *          type :
 *            type: tinyint
 *            description: type.
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
 *   name: Astrology product
 *   description: The Astrology product managing API
 */



const astrologyProductList = async (req: Request, res: Response) => {
  try {
    const datas = await repository.list()
    return res.status(200).json({ success: true, data:datas, error:null })
  } catch (e: any) {
    res.status(404).json({ success: false, data:{}, error: ['could not read data', e.message] })
  }
};


const astrologyProductSave = async (req: Request, res: Response) => {
  try {
    const datas = await repository.store({ ...req.body })
    return res.status(201).json({ success: true, data: datas, error:null   })
  } catch (e: any) {
    res.status(422).json({success: false, data:{}, error: ['could not create data', e.message] })
  }
}


const astrologyProductEdit = async (req: Request, res: Response) => {
  const id:any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas, error:null  })
  } catch (e: any) {
    res.status(404).json({ success: false, data:{}, error: e.message })
  }
};

const astrologyProductUpdate = async (req: Request, res: Response) => {
  
  try {
    const datas = await repository.update(req.body)
    return res.status(200).json({ success: true, data:{}, error:null })
  } catch (e: any) {
    res.status(422).json({success: false, data:{},  error: ['could not update data', e.message] })
  }

};

const astrologyProductDestroy = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: AstrologyProduct | null = await AstrologyProduct.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success: true, data:{}, error:null})
  } catch (e: any) {
    res.status(422).json({success: false, data:{}, error: ['could not delete data', e.message] })
  }

};



/**
 * @swagger
 * /v1/astrologies/{locale}:
 *   get:
 *     summary: Returns the list of all the Astrology product
 *     tags: [Astrology product]
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
 *               data : {datas : [0 : {AstrologyProduct: {AstrologyProductTranslates: [0: {astrology_product_id: 6, description: "", id: 11, locale: "en", slug: "blue-saphire-6-en", title: "Blue Saphire 6"}], id: 6, image: "https://cdn.pujapathbooking.com/astrology/astro-1_pujapath_thumbnail.jpg", price: 30000}, astrology_product_id: 6} ],
 *                       categories : [0: {CmsTranslates: [0: {id: 13, cms_id: 7, title: "Session with Astrologer", link: "astrology/book-session-with-astrologer"}], id: 7, image: "https://cdn.pujapathbooking.com/cms/astrology-one_pujapath_thumbnail.jpg", status: 1, type: 3}],
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

const astrologyProductListing = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const search:any = req.query.search && req.query.search != '' ? req.query.search : null
  const order :any = req.query.order && req.query.order != '' ? req.query.order : null
  try {
    const datas = await repository.lists(locale, search, order)
    return res.status(200).json({success:true, data: datas, error:null})
  } catch (e: any) {
    res.status(422).json({success:false, data:{}, error: ['could not delete data', e.message] })

  }
}

// /**
//  * @swagger
//  * /v1/astrology-product/{slug}/{locale}:
//  *   get:
//  *     summary: Returns the list of all the Astrology product
//  *     tags: [Astrology product]
//  *     parameters:
//  *       - in: path
//  *         name: slug
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: slug
//  *       - in: path
//  *         name: locale
//  *         schema:
//  *           type: string
//  *         required: false
//  *         default: en
//  *         description: locale
//  *     responses:
//  *       200:
//  *         description: The list of the Astrology product
//  */
const astrologyProductDetail = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const slug:any = req.params.slug

  try {
    const datas = await repository.astrologyProductDetails(slug, locale)
    return res.status(200).json({success: true, data:datas, error:null})
  } catch (e: any) {
    res.status(422).json({success:false, data:{}, error: ['could not delete data', e.message] })

  }
}

const astrologyProductDetailSeo = async (req: Request, res: Response) => {
  const slug:any = req.params.slug

  try {
    const seo = await repository.astrologyProductDetailSeo(slug)
    return res.status(200).json({success: true, data:seo, error:null})
  } catch (e: any) {
    res.status(422).json({success:false, data:{}, error: ['could not delete data', e.message] })

  }
}

export { astrologyProductList , astrologyProductSave , astrologyProductEdit , astrologyProductUpdate, astrologyProductDestroy , astrologyProductListing, astrologyProductDetail, astrologyProductDetailSeo}