import Express, { Request, Response } from "express";
import { Contact } from "../models/Contact";
import { ContactRepository } from "../repositories/ContactRepository";

const repository = new ContactRepository()

const contactList = async (req: Request, res: Response) => {
    try {
      const datas = await repository.list()
      return res.status(200).json({ success: true, data: datas })
    } catch (e: any) {
      res.status(404).json({ success: false, error: ['could not read data', e.message] })
    }
  
  };

  const contactListById = async (req: Request, res: Response) => {
    let id:any = req.params.id
    try {
      const datas = await repository.edit(id)
      return res.status(200).json({ success: true, data: datas })
    } catch (e: any) {
      res.status(404).json({ success: false, error: ['could not read data', e.message] })
    }
  
  };

  const contactSave = async (req: Request, res: Response) => {
    try {
      const data = await repository.store({ ...req.body })
      return res.status(201).json({ success: true, datas:data })
    } catch (e: any) {
      res.status(422).json({ success: false, error: ['could not create data', e.message] })
    }
  }
  const contactUpdate= async (req: Request, res: Response) => {
   
      try{
        await repository.update(req.body)
       
        return res.status(200).json({success: true})
      }catch(e:any){
          res.status(422).json({success: false,error: ['could not update data',e.message]})
      }
  
  };
  const destroyContact = async (req: Request, res: Response) => {
    const id: any= req.params.id;
    
    try{
      const deletes: Contact | null = await Contact.findByPk(id);
      await repository.delete(id)
      return res.status(200).json({success: true})
    }catch(e:any){
      res.status(422).json({error: ['could not delete data',e.message]})
  }
 
  };

  export {contactList, contactListById, contactSave, contactUpdate, destroyContact}