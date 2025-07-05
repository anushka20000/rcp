import { RequestHandler } from "express";
import { Booking } from "../models/Booking";
import { BookingRepository } from "../repositories/BookingRepository";

const data = new BookingRepository()
/**
 * @swagger
 * components:
 *   schemas:
 *     Bookings:
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the bookings
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         puja_id:
 *           type: integer
 *           description: The auto-generated id of the puja
 *         user_address_id:
 *           type: integer
 *           description: user_address_id
 *         puja_kit_id:
 *           type: integer
 *           description: user_address_id
 *         samagri_package_id:
 *           type: integer
 *           description: user_address_id
 *         astrology_product_id:
 *           type: integer
 *           description: user_address_id
 *         astrology_product_variation_id:
 *           type: integer
 *           description: user_address_id
 *         tour_id:
 *           type: integer
 *           description: user_address_id
 *         package_id:
 *           type: integer
 *           description: The auto-generated id of the package
 *         total:
 *           type: integer
 *           description: total
 *         shipping_amount:
 *           type: integer
 *           description: shipping_amount
 *         date:
 *           type: integer
 *           description: date
 *         time:
 *           type: integer
 *           description: time
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
 *   name: Bookings
 *   description: The bookings managing API
 */


//CREATE 
export const bookingSave: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store(req.body)
    return res.json({ data: created })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};



export const bookingEdit: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.get()
    return res.json({ data: datas })
  } catch (e: any) {
    res.status(404).json({ error: e.message })
  }
};


//UPDATE 
export const bookingUpdate: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  try {
    const updated = await data.update(req.body, { where: { id } })
    const updates: Booking | null = await Booking.findByPk(id);
    return res.json({ data: updates })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};


//DELETE 
export const bookingDestroy: RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
    const destroy: Booking | null = await Booking.findByPk(id);
    await data.delete(id)
    return res.json({ data: destroy })
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};

/**
 * @swagger
 * /v1/cart/{locale}:
 *   get:
 *     summary: Get cart Details
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: ["en", "hi"]
 *           default: en
 *         required: true
 *         description: The locale of cart
 * 
 *     responses:
 *       200:
 *         description: The items in cart
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
export const getCartDetails: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.cartDetails(req)
    return res.json({ success: true, data: datas,error:null })
  } catch (e: any) {
    res.status(404).json({ success: false, data:{}, error: e.message })
  }
};
/**
 * @swagger
 * /v1/add-to-cart:
 *   post:
 *     summary: Add a product in cart
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               samagri_package_id: 
 *                 type: integer
 *               puja_kit_id: 
 *                 type: integer
 *               booking_token: 
 *                 type: string
 *               image: 
 *                 type: string
 *               total: 
 *                 type: integer
 *               type: 
 *                 type: integer
 *                 example: 1->puja_package, 2->samagri package, 3-> astrology product, 4-> tour_id, 5-> kundli, 6-> astrologer, 7-> kundli match
 *               samagriPackageDetails: 
 *                 type: array
 *                 items: {}
 *                 example: [{id: 1, item_id: 1}]
 *     responses:
 *       200:
 *         description: The item is successfully removed from cart
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
export const addToCart: RequestHandler = async (req, res, next) => {
  try {
    await data.addToCart(req)
    return res.json({ success: true,data:{}, error:null})
  } catch (e: any) {
    res.status(400).json({ success: false,data:{}, error: e.message })
  }
};
/**
 * @swagger
 * /v1/remove-from-cart:
 *   post:
 *     summary: Remove a product from cart
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               booking_token :
 *                 type: string
 *     responses:
 *       200:
 *         description: The item is successfully removed from cart
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


export const removeFromCart: RequestHandler = async (req, res, next) => {
  try {
    await data.removeFromCart(req)
    return res.json({ success: true,data:{}, error:null})
  } catch (e: any) {
    res.status(400).json({ success: false,data:{}, error: e.message })
  }
};

// on successfully payment
export const removeItemsCart: RequestHandler = async (req, res, next) => {

  try {
    const destroy = await data.removeItemsCart(req)
    return res.json({ success: true })
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message })
  }
};