import { RequestHandler } from "express";
import { Category } from "../models/Category";
import { CategoryRepository } from "../repositories/CategoryRepository";

const data = new CategoryRepository()

//GET 
export const categoryList: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.list()
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


//CREATE 
export const categorySave: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store({ ...req.body })
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(422).json({success: false, error: ['could not create data', e.message] })
  }

};


//edit
export const categoryEdit: RequestHandler = async (req, res, next) => {
  const id:any = req.params.id
  try {
    const datas = await data.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


//UPDATE 
export const categoryUpdate: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  try {
    await data.update(req.body, id)
    const updatedastro: Category | null = await Category.findByPk(id);
    return res.status(200).json({ success: true})
  } catch (e: any) {
    res.status(422).json({ error: ['could not update data', e.message] })
  }
};


//DELETE 
export const categoryDestroy : RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
   
    await data.delete(id)
    return res.json({success : true})
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};