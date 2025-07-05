import  Express , {Request,Response} from "express";
import { Magazine } from "../models/Magazine";
import { MagazineRepository } from "../repositories/MagazineRepository";

const repository = new MagazineRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    Magazine:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          title:
 *            type: string
 *            description: title
 *          image :
 *            type: string
 *            description: image .
 *          file:
 *            type: string
 *            description: file.
 *          published_date :
 *            type: date
 *            description: published date .
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
  *   name: Magazines
  *   description: The magazine managing API
  */


const magazineList = async (req: Request, res: Response) => {

  try{
    const datas = await repository.list()
    return res.status(200).json({ success: true, data: datas })
}catch(e:any){
  res.status(404).json({success: false,error: e.message})
}


  };
 

const magazineSave = async (req: Request, res: Response) =>{
  
    try{
        const created = await repository.store({...req.body})
        return res.status(201).json({success: true})
    }catch(e:any){
        res.status(422).json({success: false,error: ['could not create data',e.message]})
    }
}


const magazineEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

    const magazineUpdate= async (req: Request, res: Response) => {

          try{
            await repository.update(req.body)
         
            return res.status(200).json({success: true})
          }catch(e:any){
              res.status(422).json({success: false,error: ['could not update data',e.message]})
          }
      
      };



      const magazineDestroy = async (req: Request, res: Response) => {
        const id: any= req.params.id;
        
        try{
          const deletes: Magazine | null = await Magazine.findByPk(id);
          await repository.delete(id)
          return res.status(200).json({success: true})
        }catch(e:any){
          res.status(422).json({success: false,error: ['could not delete data',e.message]})
      }
     
      };
/**
 * @swagger
 * /v1/magazines:
 *   get:
 *     summary: Returns the list of all the magazines
 *     tags: [Magazines]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {res: [0: {createdAt: "2023-01-05T15:01:30.000Z", deletedAt: null, file: "https://cdn.pujapathbooking.com/magazine/magazine-img1.938cbfd1_pujapath_thumbnail.jpg", id: 3, image: "https://cdn.pujapathbooking.com/magazine/magazine-img1.938cbfd1_pujapath_thumbnail.jpg", published_date: "2022-12-05T00:00:00.000Z", title: "Tour magazine", updatedAt: "2023-01-05T15:01:30.000Z"}]}
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

      const magazineListing = async (req: Request, res: Response) => {
  let typeId = req.params.type_id ? req.params.type_id : null;

        try{
          const datas = await repository.listing(typeId)
          return res.status(200).json({success:true, data:datas, error:null})
      }catch(e:any){
        res.status(404).json({success:false, data:{}, error: ['could not read data',e.message]})
      }
      }

      export {magazineList,magazineSave, magazineEdit, magazineUpdate, magazineDestroy, magazineListing}