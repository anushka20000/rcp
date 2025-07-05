import  Express , {Request,Response} from "express";
import { MagazineSubmission } from "../models/MagazineSubmission";
import { BlogRepository } from "../repositories/MagazineSubmissionRepository";

const repository = new BlogRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    magazine_submissions:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          user_id:
 *            type: integer
 *            description: The user id
 *          title:
 *            type: string
 *            description: title
 *          image :
 *            type: string
 *            description: image .
 *          file:
 *            type: string
 *            description: file.
 *          author_name :
 *            type: string
 *            description: author name .
 *          author_contact_number :
 *            type: string
 *            description: author contact number .
 *          status :
 *            type: tinyint
 *            description: status.
 *          description:
 *            type: text
 *            description:  comment.
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
  *   name: Magazine Submission
  *   description: The Magazine Submission managing API
  */


const magazineSubmissionList = async (req: Request, res: Response) => {
  try{
      const datas = await repository.list()
      return res.status(200).json({success:true, data:datas})
  }catch(e:any){
    res.status(404).json({success:false, error: ['could not read data',e.message]})
  }

  };
 
 /**
 * @swagger
 * /v1/magazine-submission/store:
 *   post:
 *     summary: Create a Magazine Submission
 *     tags: [Magazine Submission]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               author_name:
 *                 type: string
 *                 required: true
 *               author_contact_number:
 *                 type: integer
 *                 required: true
 *               description :
 *                 type: string
 *               title :
 *                 type: string
 *                 required: true
 *               file:
 *                 type: string
 *                 format: base64
 *                 required: true
 *     responses:
 *       200:
 *         description: The Magazine Submission is successfully done
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {}
 *               error : 
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : {}
 *               error : "could not create data empty field"
 */
const magazineSubmissionSave = async (req: Request, res: Response) =>{
  
    try{
        const created = await repository.store({...req.body})
        return res.status(201).json({success:true,data: created, error:null})
    }catch(e:any){
        res.status(422).json({success:false,data:{},error: ['could not create data',e.message]})
    }
}


const magazineSubmissionEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

    const magazineSubmissionUpdate = async (req: Request, res: Response) => {
       
          try{
            await repository.update(req.body)
           
            return res.status(200).json({success:true})
          }catch(e:any){
              res.status(422).json({success:true,error: ['could not update data',e.message]})
          }
      
      };



      const magazineSubmissionDestroy = async (req: Request, res: Response) => {
        const id: any= req.params.id;
        
        try{
          const deletes: MagazineSubmission | null = await MagazineSubmission.findByPk(id);
          await repository.delete(id)
          return res.status(200).json({success:true})
        }catch(e:any){
          res.status(422).json({success:false,error: ['could not delete data',e.message]})
      }
     
      };

      export {magazineSubmissionList,magazineSubmissionSave,magazineSubmissionEdit, magazineSubmissionUpdate,magazineSubmissionDestroy}