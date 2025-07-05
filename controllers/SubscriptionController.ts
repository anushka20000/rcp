import  Express , {Request,Response} from "express";
import { Subscription } from "../models/Subscription";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";

const repository = new SubscriptionRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    Subscription:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          email :
 *            type: string
 *            description: email.
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
  *   name: Subscription
  *   description: The Subscription managing API
  */



 /**
 * @swagger
 * /v1/add-subscriber:
 *   post:
 *     summary: Create a Subscription
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               status:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The User is successfully subscribed
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

const saveSubscription = async (req: Request, res: Response) =>{
    try{
        const created = await repository.store({...req.body})
        return res.status(201).json({success:true, data:created, error:null})
    }catch(e:any){
        res.status(422).json({success:false,data:{}, error: ['could not create data',e.message]})
    }
}
// /**
//  * @swagger
//  * /subscription:
//  *   get:
//  *     summary: Returns the list of all the Subscription
//  *     tags: [Subscription]
//  *     responses:
//  *       200:
//  *         description: The list of the Subscription
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Subscription'
//  */

const readSubscription = async (req: Request, res: Response) => {
    try{
        const datas = await repository.list()
        return res.status(200).json({success: true, data: datas})
    }catch(e:any){
      res.status(404).json({error: ['could not read data',e.message]})
    }
  
    };

    const subscriptionEdit = async (req: Request, res: Response) => {
      const id: any = req.params.id
      try {
        const datas = await repository.edit(id)
        return res.json({ success: true, data: datas })
      } catch (e: any) {
        res.status(404).json({ success: false, error: e.message })
      }
    };
// /**
//  * @swagger
//  * /subscription/update/{id}:
//  *  put:
//  *    summary: Update the Subscription by the id
//  *    tags: [Subscription]
//  *    parameters:
//  *      - in: path
//  *        name: id
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: The Subscription id
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            $ref: '#/components/schemas/Subscription'
//  *    responses:
//  *      200:
//  *        description: The Subscription was updated
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/Subscription'
//  *      404:
//  *        description: The Subscription was not found
//  *      500:
//  *        description: Some error happened
//  */
    const updateSubscription= async (req: Request, res: Response) => {
    
          try{
            await repository.update(req.body)
        
            return res.status(200).json({success: true})
          }catch(e:any){
              res.status(422).json({success:false, error: ['could not update data',e.message]})
          }
      
      };

// /**
//  * @swagger
//  * /subscription/delete/{id}:
//  *   delete:
//  *     summary: deletion
//  *     tags: [Subscription]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Subscription id
//  *         content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/Subscription'
//  *     responses:
//  *       200:
//  *         description: success
//  *       404:
//  *         description: not found
//  */

      const destroySubscription = async (req: Request, res: Response) => {
        const id: any= req.params.id;
        
        try{
          const deletes: Subscription | null = await Subscription.findByPk(id);
          await repository.delete(id)
          return res.status(200).json({success: true,data:deletes})
        }catch(e:any){
          res.status(422).json({success: false,error: ['could not delete data',e.message]})
      }
     
      };

      export {saveSubscription,readSubscription,subscriptionEdit, updateSubscription,destroySubscription}