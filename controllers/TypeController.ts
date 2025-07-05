import { RequestHandler } from "express";
import { Type } from "../models/Type";
import { TypeRepository } from "../repositories/TypeRepository";

const data = new TypeRepository()

//GET 
export const typeList: RequestHandler = async (req, res, next) => {
  try {
    const datas = await data.list()
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

export const typeLists: RequestHandler = async (req, res, next) => {
  const lang = req.params.locale ? req.params.locale : 'en'
    try {
      const datas = await data.lists(lang)
      return res.json({ success: true, data: datas })
    } catch (e: any) {
      res.status(404).json({ success: false, error: e.message })
    }
  };
//CREATE 
export const typeSave: RequestHandler = async (req, res, next) => {

  try {
    const created = await data.store({ ...req.body })
    return res.status(201).json({ success: true })
  } catch (e: any) {
    res.status(422).json({success: false, error: ['could not create data', e.message] })
  }

};


//edit
export const typeEdit: RequestHandler = async (req, res, next) => {
  const id:any = req.params.id
  try {
    const datas = await data.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};


//UPDATE 
export const typeUpdate: RequestHandler = async (req, res, next) => {
  const id = req.body.id
  try {
    await data.update(req.body, id)
    const updatedastro: Type | null = await Type.findByPk(id);
    return res.status(200).json({ success: true})
  } catch (e: any) {
    res.status(422).json({ error: ['could not update data', e.message] })
  }
};


//DELETE 
export const typeDestroy : RequestHandler = async (req, res, next) => {
  const id: any = req.params.id;
  try {
   
    await data.delete(id)
    return res.json({success : true})
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
};