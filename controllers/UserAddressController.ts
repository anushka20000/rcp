import { RequestHandler } from "express";
import { UserAddress } from "../models/UserAddress";
import { UserAddressRepository } from "../repositories/UserAddressRepository";

const repo = new UserAddressRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *         - phone
 *         - alternate_phone
 *         - address
 *         - state
 *         - pincode
 *         - landmark
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the UserAddress
 *         user_id:
 *           type: integer
 *           description: The id of the user
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         alternate_phone:
 *           type: string
 *         address:
 *           type: string
 *         state:
 *           type: string
 *         pincode:
 *           type: string
 *         landmark:
 *           type: string
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
 *   name: UserAddresses
 *   description: The UserAddress managing API
 */

// /**
//  * @swagger
//  * /user-address/store:
//  *   post:
//  *     summary: Create a new UserAddress
//  *     tags: [UserAddresses]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/UserAddress'
//  *     responses:
//  *       200:
//  *         description: The UserAddress was successfully created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/UserAddress'
//  *       500:
//  *         description: Some server error
//  */

//CREATE 
export const saveUserAddress: RequestHandler = async (req, res, next) => {

  try {
    const created = await repo.store(req.body)
    return res.json({ data: created })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};
// /**
//  * @swagger
//  * /user-address:
//  *   get:
//  *     summary: Returns the list of all the UserAddresses
//  *     tags: [UserAddresses]
//  *     responses:
//  *       200:
//  *         description: The list of the UserAddress
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/UserAddress'
//  */


//GET 
export const getUserAddress: RequestHandler = async (req, res, next) => {
  try {
    const datas = await repo.get()
    return res.json({ data: datas })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
};
// /**
//  * @swagger
//  * /user-address/update/{id}:
//  *  put:
//  *    summary: Update the UserAddress by the id
//  *    tags: [UserAddresses]
//  *    parameters:
//  *      - in: path
//  *        name: id
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: The UserAddress id
//  *    requestBody:
//  *      required: true
//  *      content:
//  *        application/json:
//  *          schema:
//  *            $ref: '#/components/schemas/UserAddress'
//  *    responses:
//  *      200:
//  *        description: The UserAddress was updated
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/UserAddress'
//  *      404:
//  *        description: The UserAddress was not found
//  *      500:
//  *        description: Some error happened
//  */

//UPDATE 
export const updateUserAddress: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  try {
    const updated = await repo.update(req.body, { where: { id } })
    const updatedCategory: UserAddress | null = await UserAddress.findByPk(id);
    return res.json({ data: updatedCategory })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};
// /**
// * @swagger
// * /user-address/delete{id}:
// *   delete:
// *     summary: Remove the UserAddress by id
// *     tags: [UserAddresses]
// *     parameters:
// *       - in: path
// *         name: id
// *         schema:
// *           type: string
// *         required: true
// *         description: The UserAddress id
// * 
// *     responses:
// *       200:
// *         description: The UserAddress was deleted
// *       404:
// *         description: The UserAddress was not found
// */

//DELETE 
export const destroyUserAddress: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const destroy: UserAddress | null = await UserAddress.findByPk(id);
    await repo.delete(id)
    return res.json({ data: destroy })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

/**
 * @swagger
 * /v1/user-address:
 *   get:
 *     summary: Returns the list of all the UserAddresses
 *     tags: [UserAddresses]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {data: [0: {address: "asder", alternate_phone: "1234444444", createdAt: "2023-02-23T08:53:15.000Z", deletedAt: null, first_name: "Aabc", id: 1, landmark: null, last_name: null, phone: "1234567890", pincode: "123459", state: null, updatedAt: "2023-02-23T08:53:15.000Z", user_id: 16}], userAddresId: 1, userAddress: {address: "asder", alternate_phone: "1234444444", createdAt: "2023-02-23T08:53:15.000Z", deletedAt: null, first_name: "Aabc", id: 1, landmark: null, last_name: null, phone: "1234567890", pincode: "123459", state: null, updatedAt: "2023-02-23T08:53:15.000Z", user_id: 16}}
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

export const listingAddress: RequestHandler = async (req, res, next) => {

  try {
    const data = await repo.listingAddresses(req)

    return res.json({ success: true, data:data, error:null })
  } catch (e: any) {
    res.status(400).json({success: false,data:{}, error: e.message })
  }
};
/**
 * @swagger
 * /v1/set-address-to-cart/{id}:
 *   get:
 *     summary: Returns the list of user address
 *     tags: [UserAddresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user address id
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {datas: {address: "asder", alternate_phone: "1234444444", createdAt: "2023-02-23T08:53:15.000Z", deletedAt: null, first_name: "Aabc", id: 1, landmark: null, last_name: null, phone: "1234567890", pincode: "123459", state: null, updatedAt: "2023-02-23T08:53:15.000Z", user_id: 16}}
 *               error : 
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : "INVALID_DATA"
 *               error : "AUTH_ERROR"
 */
export const addUserAddressToCart: RequestHandler = async (req, res, next) => {
  try {
    const data = await repo.addUserAddressToCart(req)
    return res.json({ success: true , data: data, error:null })
  } catch (e: any) {
    res.status(400).json({ success: false, data:{}, error: e.message })
  }
};



/**
 * @swagger
 * /v1/add-address:
 *   post:
 *     summary: Create a new UserAddress
 *     tags: [UserAddresses]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               first_name:
 *                 type: string
 *                 required: true
 *               phone:
 *                 type: integer
 *                 required: true
 *               pincode:
 *                 type: integer
 *                 required: true
 *               address :
 *                 type: string
 *                 required: true
 *               alternate_phone:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The User is successfully Logged in
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {data: {address: "asder", alternate_phone: "1234444444",createdAt: "2023-02-23T08:53:15.829Z", first_name: "Aabc", id: 1, phone: "1234567890", pincode: "123459", updatedAt: "2023-02-23T08:53:15.829Z", user_id: 16}, datas: [0: {address: "asder", alternate_phone: "1234444444", createdAt: "2023-02-23T08:53:15.000Z", deletedAt: null, first_name: "Aabc", id: 1, landmark: null, last_name: null, phone: "1234567890", pincode: "123459", state: null, updatedAt: "2023-02-23T08:53:15.000Z", user_id: 16}]}
 *               error : 
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : "INVALID_DATA"
 *               error : "AUTH_ERROR"
 */
//adding neww address
export const addAddress: RequestHandler = async (req, res, next) => {

  try {
    const data = await repo.addAddress(req)
    return res.json({ success: true, data: data, error:null })
  } catch (e: any) {
    res.status(400).json({ success: false, data:{}, error: e.message })
  }
};

export const removeAddresses: RequestHandler = async (req, res, next) => {
  try {
    const data = await repo.removeAddress(req)
    return res.json({success: true, data: data, error:null })
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
}

