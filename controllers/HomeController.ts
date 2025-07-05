import Express, { Request, Response } from "express";
import { HomeRepository } from "../repositories/HomeRepository";

const repository = new HomeRepository()

/**
 * @swagger
 * tags:
 *   name: Home
 *   description: The home managing API
 */


/**
 * @swagger
 * /v1/home/{locale}:
 *   get:
 *     summary: Returns the list of items
 *     tags: [Home]
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
 *               data : {list : [0 : {CmsTranslates: [0: {id: 1, cms_id: 1, description: "", title: "Puj Booking", slug: "online-puja-booking", label: "On Site / On Location", link: "online-puja-booking", locale: "en"}], id: 1, type: 2, status: 1, image: "https://cdn.pujapathbooking.com/cms/hs1_pujapath_thumbnail.jpg"} ],
 *                       location : [0: {LocationTranslates: [0: {id: 1, location_id: 1, title: "Delhi", locale: "en"}], id: 1, status: 1}],
 *                       puja : [0: {PujaTranslates: [0: {id: 1, puja_id: 1, title: "Satyanarayan Puja", locale: "en", slug: "satyanarayan-puja"}], id: 1, status: 1}],
 *                       seo : {id: 11, meta_description: "PUJAPATH - home", meta_image: "https://cdn.pujapathbooking.com/cms/astrology-three.jpg", meta_title: "home", page: "home"}
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
export const homeListing = async (req: Request, res: Response) => {
    const locale = req.params.locale ? req.params.locale : 'en'

    try {
        const datas = await repository.lists(locale)
        return res.status(200).json({ success: true, data: datas, error: null })

    } catch (e: any) {
        res.status(404).json({ success: false, data: null, error: ['could not read data', e.message] })
    }
}


