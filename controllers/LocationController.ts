import  Express , {Request,Response} from "express";
import { Location } from "../models/Location";
import { LocationRepository } from "../repositories/LocationRepository";

const repository = new LocationRepository()

const saveLocation = async (req: Request, res: Response) =>{
    try{
        const created = await repository.store({...req.body})
        return res.status(201).json({success: true, data:created})
    }catch(e:any){
        res.status(422).json({success: false, error: ['could not create data',e.message]})
    }
}

const locationList = async (req: Request, res: Response) => {
    try{
        const datas = await repository.list()
        return res.status(200).json({success:true, data:datas})
    }catch(e:any){
      res.status(404).json({error: ['could not read data',e.message]})
    }
  
    };
    const editLocation = async (req: Request, res: Response) => {
      const id: any  = req.params.id
      try{
          const datas = await repository.edit(id)
          return res.status(200).json({success:true, data:datas})
      }catch(e:any){
        res.status(404).json({success: false, error: ['could not read data',e.message]})
      }
    
      };

    const updateLocation= async (req: Request, res: Response) => {
        const id: any= req.params.id;
          try{
           const data =  await repository.update(req.body, id)
    
            return res.status(200).json({success: true})
          }catch(e:any){
              res.status(422).json({error: ['could not update data',e.message]})
          }
      
      };


      const destroyLocation = async (req: Request, res: Response) => {
        const id: any= req.params.id;
        
        try{
          const deletes: Location | null = await Location.findByPk(id);
          await repository.delete(id)
          return res.status(200).json({success: true})
        }catch(e:any){
          res.status(422).json({success:false, error: ['could not delete data',e.message]})
      }
     
      };

      export {saveLocation, locationList, updateLocation, destroyLocation, editLocation}