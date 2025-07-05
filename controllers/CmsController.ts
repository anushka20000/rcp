import Express, { Request, Response } from "express";
import { cms } from "../models/Cms";
import { CmsRepository } from "../repositories/CmsRepository";

const repository = new CmsRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    cms:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
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
 *   name: Cms
 *   description: The cms managing API
 */



const cmsList = async (req: Request, res: Response) => {
  try {
    const datas = await repository.list()
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: ['could not read data', e.message] })
  }

};

const cmsListById = async (req: Request, res: Response) => {
  let id = req.params.id
  try {
    const datas = await repository.cmsListById(id)
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: ['could not read data', e.message] })
  }

};



const cmsSave = async (req: Request, res: Response) => {
  try {
    await repository.store({ ...req.body } )
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not create data', e.message] })
  }
}
//edit

const cmsEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


const cmsUpdate = async (req: Request, res: Response) => {
  const id: any = req.params.id;
  try {
    await repository.update(req.body)

    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not update data', e.message] })
  }

};


const cmsDestroy = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: cms | null = await cms.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not delete data', e.message] })
  }

};


/**
 * @swagger
 * /v1/cms/{slug}/{locale}:
 *   get:
 *     summary: Returns the list of all the cms
 *     tags: [Cms]
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
 *               data : {datas : [0 : {"id": 1, "cms_id": 1, "slug": "online-puja-booking", "cm": { "id": 1, "status": 1, "type": 2, "CmsTranslates": [0: { "id": 1, "cms_id": 1, "slug": "online-puja-booking", "title": "Puj Booking", "label": "On Site / On Location", "locale": "en", "description": ""}]}} ],
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



const cmsDetails = async (req: Request, res: Response) => {
  const locale: any = req.params.locale ? req.params.locale : "en"
  const slug: any = req.params.slug
  try {
    const data = await repository.lists(slug, locale)
    return res.status(200).json({ success: true, data:data, error:null})
  } catch (e: any) {
    res.status(422).json({ success: false, data:{}, error: ['Unable To Find Data', e.message] })

  }
}

const seo = async (req: Request, res: Response) => {
  const slug: any = req.params.slug
  try {
    const data = await repository.seo(slug)
    return res.status(200).json({ success: true, data:data, error:null})
  } catch (e: any) {
    res.status(422).json({ success: false, data:{}, error: ['Unable To Find Data', e.message] })

  }
}

export { cmsList, cmsSave, cmsEdit, cmsUpdate, cmsDestroy, cmsDetails, cmsListById, seo }
