import { Op } from "sequelize";
import { Magazine } from "../models/Magazine";
import { MagazineType } from "../models/MagazineType";
import { Type } from "../models/Type";
import { TypeTranslate } from "../models/TypeTranslate";
const date = require('date-and-time')
export class MagazineRepository {
  async list() {
    try {
      let res;
         res = await Magazine.findAll({
          order: [["id", "DESC"]],
        });
      return {  res };
    } catch (e: any) {
      return { error: e };
    }
  }
  
  async listing(type_id:any) {
    try {
      let res;
      let today = new Date().toLocaleDateString();
      if(type_id == 0 || type_id == undefined){
         res = await Magazine.findAll({
          order: [["id", "DESC"]],
          where: {published_date : {[Op.lte]: today}}
        });
      }else{
        res = await MagazineType.findAll({
          where: {type_id: type_id},
          include: [{model: Magazine, where: {published_date : {[Op.lte]: today}}}]
        })
      }
      return {  res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: any) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    if (
      !post.title ||
      !post.published_date 
    ) {
      throw new Error("empty field");
    }
   else {
           try {
            const fileData: any = {
              image: post.Image,
              file: post.file,
              title: post.title,
              published_date: post.published_date
            };

            const res = await Magazine.create(fileData);
            if(post.type_id.length > 0){
              for (var i = 0; i < post.type_id.length; i++) {
                await MagazineType.create({
                 magazine_id: res.dataValues.id,
                 type_id: post.type_id[i].value,
                 createdAt: currentFormattedDate,
                 updatedAt: currentFormattedDate,
                 deletedAt: null
               });
             }
            }
            return { body: res, msg: "Documents Updated" };
          } catch (e: any) {
            return { error: e.errors[0].message };
          }
    }
  }

  async edit(id: bigint) {
    try {
      const res = await MagazineType.findAll({
        where: {
          magazine_id: id
        },
        include: [
        {
          model: Type,
          include: [{model: TypeTranslate}]
        }
      ]
      });
      const magazine = await Magazine.findOne({
        where: {id: id}
      })
      return { res, magazine };
    } catch (e: any) {
      return { error: e };
    }
  }
  async update(post: any) {

    const val = await Magazine.findOne({ where: { id: post.id } });
    
    if (!val) {
      throw new Error("Id not found");
    }

    if (
    
      !post.title ||
      !post.published_date
  
    ) {
      throw new Error("empty field");
    }
    else {
            try {
              const fileData: any = {
              image: post.Image,
              file: post.file,
              title: post.title,
              published_date: post.published_date
              };

              const res = await Magazine.update(fileData, { where: { id: post.id } });

              if (post.type_id.length > 0) {
                this.updateMagazineType(post.type_id, post.id);
              }
  
              return { body: res, msg: "Documents Updated" };
            } catch (e: any) {
              return { error: e.errors[0].message };
            }
    }
  }
  async updateMagazineType(newType, magazineId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldType = await MagazineType.findAll({where:{magazine_id: magazineId}, attributes:['type_id']});

    
    let oldTypeId = [];

    if (oldType != null) {
      for (let i in oldType) {
        oldTypeId.push(oldType[i].dataValues.type_id);
      }
    }

    if (oldTypeId.length > 0 && newType.length > 0) {
      let difference = oldTypeId.filter(j => !newType.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await MagazineType.destroy({ where: { magazine_id: magazineId, type_id: difference[k] } });
        }
      }
    }
    if (newType.length > 0) {
      for (var i=0; i < newType.length ; i++ ) {
        let magazineType = await MagazineType.findOne({ where: { magazine_id: magazineId, type_id: newType[i].value} });

        if (!magazineType) {
          await MagazineType.create({
            magazine_id: magazineId,
            type_id: newType[i].value,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }
  async delete(id: bigint) {
    const delData = await Magazine.findAll({ where: { id: id } });
    const del = await Magazine.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await Magazine.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    } else {
      if (del.length != 0) {
        throw new Error("details got deleted earlier");
      } else {
        throw new Error("details don't exist. please enter a valid id!");
      }
    }
  }

 
}
