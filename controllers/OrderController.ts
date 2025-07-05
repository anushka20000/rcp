import Express, { Request, Response } from "express";
import { Order } from "../models/Order";
import { OrderRepository } from "../repositories/OrderRepository";
const date = require("date-and-time");
const repository = new OrderRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    orders:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          user_id :
 *            type: integer
 *            description: userid.
 *          user_address_id :
 *            type: integer
 *            description: userid.
 *          order_id :
 *            type: integer
 *            description: userid.
 *          payment_id :
 *            type: integer
 *            description: userid.
 *          total :
 *            type: DOUBLE
 *            description: total.
 *          shipping_amount :
 *            type: DOUBLE
 *            description: shipping_amount.
 *          name :
 *            type: string
 *            description: name.
 *          phone :
 *            type: string
 *            description: phone.
 *          alternate_phone :
 *            type: string
 *            description: alternate_phone.
 *          address :
 *            type: string
 *            description: address.
 *          state :
 *            type: string
 *            description: state.
 *          pincode :
 *            type: string
 *            description: pincode.
 *          status  :
 *            type: tinyint
 *            description: status .
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
 *   name: orders
 *   description: The orders managing API
 */




const allorderList = async (req: Request, res: Response) => {
  try {
    const datas = await repository.getAll() 
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};


const orderSave = async (req: Request, res: Response) => {
  try {
    const created = await repository.store({ ...req.body })
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not create data', e.message] })
  }
}



//edit
const orderEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

const orderUpdate = async (req: Request, res: Response) => {
   const id: any = req.body.id;
  try {
    await repository.update(req.body)
    const updatedastro: Order | null = await Order.findByPk(id);
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not update data', e.message] })
  }

};



const orderDestroy = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: Order | null = await Order.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ success: true })
  } catch (e: any) {
    res.status(422).json({ success: false, error: ['could not delete data', e.message] })
  }

};
/**
 * @swagger
 * /v1/orders/{status}/{listType}/{locale}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: orders
 *    tags: [orders]
 *    parameters:
 *      - in: query
 *        name: status
 *        schema:
 *          type: integer
 *        required: true
 *        description: status
 *      - in: query
 *        name: listType
 *        schema:
 *          type: integer
 *        required: true
 *        description: listType
 *      - in: query
 *        name: locale
 *        schema:
 *          type: string
 *          enum: ["en", "hi"]
 *        required: true
 *        description: locale
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {"datas": [0: {OrderDetails: [0: {astrology_product_id: null, astrology_product_variation_id: null, carat: null, createdAt: "2023-02-23T13:05:27.000Z", date: null, id: 135, image: "https://cdn.pujapathbooking.com/samagri_package/thali_pujapath_thumbnail.jpeg", is_live: null, meeting_id: null, meeting_url: null, order_id: 90, package_id: null, puja_id: null, puja_kit_id: 1, samagri_package_id: 1, status: 0, thumb_image: null, time: null, total: 780, tour_id: null, type: 2}], address: null, alternate_phone: null, createdAt: "2023-02-23T13:05:27.000Z", id: 90, name: null, order_id: "ORD-000090", payment_id: null, phone: null, pincode: null, shipping_amount: null, state: null, status: 0, total: 3840, user_address_id: 2, user_id: 16}]}
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

const orders = async (req: Request, res: Response) => {
  const now = new Date();
  const time = date.addDays(now, -30);
  const status = req.params.status ? req.params.status : -1
  const listType = req.params.listType ? req.params.listType : time
  try {
    const datas = await repository.orders(req, status, listType)
    return res.json({success: true, data: datas, error:null })
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
};
/**
 * @swagger
 * /v1/order-details/{id}/{locale}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: get the order by the id
 *    tags: [orders]
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order id
 *      - in: query
 *        name: locale
 *        schema:
 *          type: string
 *          enum: ["en", "hi"]
 *        required: true
 *        description: The order locale
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {"datas": [0: {OrderDetails: [], address: null, alternate_phone: null, createdAt: "2023-02-23T13:05:27.000Z", id: 90, name: null, order_id: "ORD-000090", payment_id: null, phone: null, pincode: null, shipping_amount: null, state: null, status: 0, total: 3840, user_address_id: 2, user_id: 16}]}
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
const orderDetails = async (req: Request, res: Response) => {
  try {
    const datas = await repository.orderDetails(req)
    return res.json({success: true, data: datas, error:null})
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
}

const orderDetailsAdmin = async (req: Request, res: Response) => {
  try {
    const datas = await repository.orderDetailsAdmin(req)
    return res.json({success: true, data: datas, error:null})
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
}
/**
 * @swagger
 * /v1/order-detail-item/{id}/{locale}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    summary: get the order by the id
 *    tags: [orders]
 *    parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order id
 *      - in: query
 *        name: locale
 *        schema:
 *          type: string
 *          enum: ["en", "hi"]
 *        required: true
 *        default: en
 *        description: The order locale
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {"datas": {}}
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
const orderDetailItem = async (req: Request, res: Response) => {
  try {
    const datas = await repository.orderDetailItem(req)
    return res.json({success: true, data: datas, error:null })
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
};

// /**
//  * @swagger
//  * /v1/remove-carts/:
//  *  delete:
//  *    security:
//  *      - bearerAuth: []
//  *     summary: deletion
//  *     tags: [orders]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: orders id
//  *         content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/components/schemas/orders'
//  *     responses:
//  *       200:
//  *         content:
//  *           application/json:
//  *             example:
//  *               success : true
//  *               data : {}
//  *               error:
//  *       500:
//  *         description: Some server error
//  *         content:
//  *           application/json:
//  *             example:
//  *               success : false
//  *               data : {}
//  *               error:
//  */

/**
 * @swagger
 * /v1/remove-carts/:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    summary: get the order by the id
 *    tags: [orders]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            example:
 *              success : true
 *              data : {}
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

const removeCarts = async (req: Request, res: Response) => {
  try {
    await repository.removeCarts(req)
    return res.json({success: true, data:{}, error:null })
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
}

const downloadInvoice = async (req: Request, res: Response) => {
  try {
    const data = await repository.downloadInvoice(req)
    return res.json({success: true, data: data, error:null })
  } catch (e: any) {
    res.status(404).json({ success:false, data:{}, error: e.message })
  }
}


/**
 * @swagger
 * /v1/add-to-orders:
 *   get:
 *     summary: Returns the list of all the orders
 *     tags: [orders]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {"datas": {orderNumber: "ORD-000097", razorpayOrder: {amount: 434000, amount_due: 434000, amount_paid: 0, attempts: 0, created_at: 1677216438, currency: "INR", entity: "order", id: "order_LKALAxLckJOupN", notes: [], offer_id: null, receipt: "ORD-000097", status: "created"}, total: 4340}}
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
const addToOrder = async (req: Request, res: Response) => {
  try {
    const data = await repository.addToOrder(req)
    return res.json({success: true, datas: data, error:null})
  } catch (e: any) {
    res.status(404).json({ success:false,data:{}, error: e.message })
  }
}

/**
* @swagger
* /v1/verify-order:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Verify a order
*     tags: [orders]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/orders'
*     responses:
*       200:
*         description: The orders was successfully verified
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/orders'
*       500:
*         description: Some server error
*/
const verifyOrder = async (req: Request, res: Response) => {
  try {
    const data = await repository.verifyOrder(req, req.body)
    return res.json({success: true, datas: data})
  } catch (e: any) {
    res.status(404).json({ success:false, error: e.message })
  }
}

export { orderSave, orderEdit, orderUpdate, orderDestroy, orders, orderDetails, orderDetailsAdmin,removeCarts, addToOrder, verifyOrder, orderDetailItem, downloadInvoice, allorderList}