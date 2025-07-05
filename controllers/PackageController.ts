import Express, { Request, Response } from "express";
import { Package } from "../models/Package";
import { PackageRepository } from "../repositories/PackageRepository";

const repository = new PackageRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    packages:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          puja_id:
 *            type: integer
 *            description: The puja id
 *          price  :
 *            type: DOUBLE
 *            description: price  .
 *          discounted_price  :
 *            type: DOUBLE
 *            description: discounted_price  .
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
 *   name: Package
 *   description: The Package managing API
 */


const packageList = async (req: Request, res: Response) => {
  try {
    const datas = await repository.getAll()
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: ['could not read data', e.message] })
  }

};


const packageSave = async (req: Request, res: Response) => {
  try {

    const created = await repository.store({ ...req.body }, req.files)
    return res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message })
  }

};


const packageEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

const packageListByPujaId = async (req: Request, res: Response) => {
  const puja_id: any = req.params.puja_id
  try {
    const datas = await repository.packageByPujaId(puja_id)

    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


const packageUpdate = async (req: Request, res: Response) => {
  // const id: any = req.params.id;
  try {
    await repository.update(req.body)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not update data', e.message] })
  }

};



const packageDestroy = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: Package | null = await Package.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not delete data', e.message] })
  }

};

/**
 * @swagger
 * /v1/package/{locale}/{slug}/{on_site}/{location}/{date}:
 *  get:
 *    summary:  Package listing
 *    tags: [Package]
 *    parameters:
 *      - in: path
 *        name: slug
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: locale
 *        schema:
 *          type: string
 *          enum: ["en", "hi"]
 *          default: en
 *        required: true
 *      - in: path
 *        name: on_site
 *        schema:
 *          type: integer
 *        required: true
 *      - in: path
 *        name: location
 *        schema:
 *          type: integer
 *        required: true
 *      - in: path
 *        name: Date
 *        schema:
 *          type: string
 *          format: date
 *          example: '2022-07-01'
 *        required: true
 *    responses:
 *      200:
 *        description: success
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {data : {Puja: {id: 2, status: 1, on_site: 1, PujaTranslates: [{slug: "griha-pravesh-puja"}], Packages: []}, id: 3, puja_id: 2},
 *                      locations : [0: {id: 1, LocationTranslates: [{id: 1, location_id: 1, title: "Delhi"}]}]
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

const listingPackage = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : 'en'
  const slug: any = req.params.slug
  const on_site: any = req.params.on_site
  const location_id: any = req.params.location_id
  const date: any = req.params.date
  try {
    const datas = await repository.list(locale, slug, on_site, location_id, date)
    return res.status(200).json({success:true, data: datas, error: null })
  } catch (e: any) {
    res.status(404).json({success:false, data:{}, error: ['could not read data', e.message] })
  }
}

/**
 * @swagger
 * /v1/puja-packages/{slug}/{locale}:
 *   get:
 *     summary: Returns the list of all the Packages
 *     tags: [Package]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: slug
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
 *         description: success
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {data : {Puja: {id: 2, status: 1, on_site: 1, PujaTranslates: [{slug: "griha-pravesh-puja"}], Packages: []}, id: 3, puja_id: 2},
 *                       locations : [0: {id: 1, LocationTranslates: [{id: 1, location_id: 1, title: "Delhi"}]}]
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
const pujaPackages = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : 'en'
  const slug: any = req.params.slug

  try {
    const data = await repository.pujaPackages(slug, locale)
    return res.status(200).json({ success: true, data: data, error: null })
  } catch (e: any) {
    res.status(404).json({ success: false, data: null, error: ['could not read data', e.message] })
  }
}

export { packageList, packageSave, packageEdit, packageUpdate, packageDestroy, listingPackage, pujaPackages, packageListByPujaId }