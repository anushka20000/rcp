import  {RequestHandler} from "express";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

const repo = new UserRepository()
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - type
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the User
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         type:
 *           type: integer
 *         status:
 *           type: integer
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *         deletedAt:
 *           type: string
 */

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: The User managing API
  */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Create a new User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
 //CREATE 
export const saveUser: RequestHandler = async(req, res, next)=>{
 
  try{
      const created = await repo.store(req.body)
      return res.json({success: true, data: created})
  }catch(e:any){
      res.status(400).json({success: false, error: ['could not read data', e.message]})
  }
};
// /**
//  * @swagger
//  * /user:
//  *   get:
//  *     summary: Returns the list of all the Users
//  *     tags: [Users]
//  *     responses:
//  *       200:
//  *         description: The list of the User
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/User'
//  */



//GET 
export const getUser: RequestHandler = async (req, res, next) => {
  try{
      const datas = await repo.get()
      return res.json({ success: true, data: datas })
  }catch(e:any){
    res.status(404).json({success: false, error: ['could not read data', e.message]})
  }
  };

  export const getUserById: RequestHandler = async (req, res, next) => {
  let id = req.params.id
  try {
    const datas = await repo.getById(id)
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: ['could not read data', e.message] })
  }
};

/**
 * @swagger
 * /v1/profile-info:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns the list of all the User details
 *     tags: [Users]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {data : {createdAt: "2023-02-22T04:35:45.000Z", deletedAt: null, email: "shruti@ascentspark.com", first_name: null, id: 16, is_verified: 1, last_name: null, otp: null, password: null, phone: null, status: 1, type: 2, updatedAt: "2023-02-22T19:56:29.000Z", user_id: null}
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
export const listingUser: RequestHandler = async (req, res, next) => {

  try {
    const data = await repo.list(req)

    return res.json({ success: true, data:data, error: null })
  } catch (e: any) {
    res.status(400).json({ success: false, data: null,error: e.message })
  }
};
// /**
//  * @swagger
//  * /user/edit/{id}:
//  *  put:
//  *    summary: Update the User by the id
//  *    tags: [Users]
//  *    parameters:
//  *      - in: path
//  *        name: id
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: The User id
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            $ref: '#/components/schemas/User'
//  *    responses:
//  *      200:
//  *        description: The User was updated
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/User'
//  *      404:
//  *        description: The User was not found
//  *      500:
//  *        description: Some error happened
//  */
  //UPDATE 
  export const updateUser: RequestHandler = async (req, res, next) => {
  
      try{
        const updated = await repo.edit(req.body)
       
        return res.json({success: true})
      }catch(e:any){
          res.status(400).json({success: false, error: ['could not update data', e.message]})
      }
  };

  /**
 * @swagger
 * /v1/profile-info/update:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update a User (Email OR Phone and Lang(en, hi) is required)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 required: true
 *               email:
 *                 type: string
 *               phone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The user is successfully updated
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
 *               error : 
 */
  export const editUser: RequestHandler = async (req, res, next) => {
  
    try{
      const updated = await repo.update(req)
     
      return res.json({success: true, data: updated, error: null})
    }catch(e:any){
        res.status(400).json({success: false, data: null, error: ['could not edit data', e.message]})
    }
};
export const editProfile: RequestHandler = async (req, res, next) => {
  
  try{
    const updated = await repo.updatePassword(req)
   
    return res.json({success: true, data: updated, error: null})
  }catch(e:any){
      res.status(400).json({success: false, data: null, error: ['could not edit data', e.message]})
  }
};
export const editProfileAdmin: RequestHandler = async (req, res, next) => {
  
  try{
    const updated = await repo.editAdmin(req)
   
    return res.json({success: true, data: updated, error: null})
  }catch(e:any){
      res.status(400).json({success: false, data: null, error: ['could not edit data', e.message]})
  }
};
//   /**
//  * @swagger
//  * /user/delete{id}:
//  *   delete:
//  *     summary: Remove the User by id
//  *     tags: [Users]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: The User id
//  * 
//  *     responses:
//  *       200:
//  *         description: The User was deleted
//  *       404:
//  *         description: The User was not found
//  */
//DELETE 
export const destroyUser: RequestHandler = async (req, res, next) => {
  const id: any= req.params.id;
  try{
    const destroy: User | null = await User.findByPk(id);
    await repo.delete(id)
    return res.json({success: true})
  }catch(e:any){
    res.status(400).json({success: false, error: ['could not update data', e.message]})
}
};

export const listingProfileAddress: RequestHandler = async (req, res, next) => {

  try {
    const data = await repo.listingProfileAddresses(req)

    return res.json({ success: true, data })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};