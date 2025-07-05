import  {RequestHandler} from "express";
import { Samagri } from "../models/Samagri";
import { SamagriRepository } from "../repositories/SamagriRepository";

const data = new SamagriRepository()
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Samagri:
//  *       type: object
//  *       required:
//  *         - image
//  *         - quantity
//  *         - type
//  *         - is_sell
//  *         - price
//  *         - discounted_price
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: The auto-generated id of the Samagri
//  *         image:
//  *           type: string
//  *           description: The img of Samagri
//  *         quantity:
//  *           type: integer
//  *           description: The quantity of the Samagri
//  *         type:
//  *           type: integer
//  *         is_sell:
//  *           type: integer
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
//   *   name: Samagris
//   *   description: The Samagri managing API
//   */


//GET 
export const samagriList: RequestHandler = async (req, res, next) => {
  try{
      const datas = await data.list()
      return res.json({success: true, data:datas})
  }catch(e:any){
    res.status(404).json({success: false, error: e.message})
  }
  };


 //CREATE 
export const samagriSave: RequestHandler = async(req, res, next)=>{
 
  try{
    const created = await data.store({...req.body})
    return res.status(201).json({success: true})
}catch(e:any){
    res.status(422).json({success: false, error: ['could not create data',e.message]})
}
  
};


//edit
export const samagriEdit: RequestHandler = async (req, res, next) => {
  const id:any = req.params.id
  try {
    const datas = await data.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


//UPDATE 
  export const samagriUpdate: RequestHandler = async (req, res, next) => {

  try{
    await data.update(req.body)
    return res.status(200).json({success: true})
  }catch(e:any){
      res.status(422).json({success: false,error: ['could not update data',e.message]})
  }
};




//DELETE 
export const samagriDestroy: RequestHandler = async (req, res, next) => {
  const id: any= req.params.id;
  try{
    const destroy: Samagri | null = await Samagri.findByPk(id);
    await data.delete(id)
    return res.json({success: true})
  }catch(e:any){
    res.status(400).json({success: false,error: e.message})
}
};

/**
 * @swagger
 * /samagri-listing/{locale}/{slug}:
 *   get:
 *     summary: Returns the list of all the Puja samagri details
 *     tags: [Samagri]
 *     responses:
 *       200:
 *         description: The list of the Puja samagri details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/samagris'
 */
// export const listingPujaSamagri: RequestHandler = async (req, res) => {
//   const locale: any = req.params.locale
//   const slug: any = req.params.slug

//   try{
//     const datas = await data.pujaSamagriListing(locale,slug)
//     return res.status(200).json({data:datas})
//   }catch(e:any){
//     res.status(422).json({error: ['could not delete data',e.message]})

//   }
// }