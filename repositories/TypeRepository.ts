import { Type} from "../models/Type";
import {
  TypeTranslate,
  TypeTranslateMembers,
} from "../models/TypeTranslate";

const date = require('date-and-time')

class TypeRepository {

    //GET
    async list() {
      try {
        const res = await Type.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [
            {
              model: TypeTranslate,
              attributes: ["id", "type_id", "title", "locale", "createdAt"],
              order: [["id", "DESC"]],
            },
          ],
        });
        return { Type: res };
      } catch (e: any) {
        return { error: e };
      }
    }
    async lists(locale:any) {
        try {
          const res = await Type.findAll({
            order: [["id", "DESC"]],
            attributes: ["id"],
            include: [
              {
                model: TypeTranslate,
                attributes: ["id", "type_id", "title", "locale", "createdAt"],
                where: {locale: locale},
                order: [["id", "DESC"]],
              },
            ],
          });
          return { Type: res };
        } catch (e: any) {
          return { error: e };
        }
      }


  // POST
  async store(input: any) {
    try {
      const now  =  new Date();
      const currentFormattedDate = date.format(now,'YYYY-MM-DD HH:mm:ss');
      
      const res = await Type.create({
        createdAt : currentFormattedDate, 
        updatedAt : currentFormattedDate, 
        deletedAt : null
      });

      if(res && input.typeTranslates) {
        input.typeTranslates.map(async (element) => {
      if(element.title_en != undefined){
        await TypeTranslate.create({
          type_id: res.dataValues.id,
          locale: 'en',
          title: element.title_en,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
      if(element.title_hi != undefined){

        await TypeTranslate.create({
          type_id: res.dataValues.id,
          locale: 'hi',
          title: element.title_hi,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
        });
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }

  async edit(id:bigint){
    try {
      const res = await Type.findOne({
        order: [["id", "DESC"]],
        attributes: ["id"],
        include: [
          {
            model: TypeTranslate,
            attributes: ["id", "type_id", "title", "locale", "createdAt"],
            order: [["id", "DESC"]],
          },
        ],
        where: {
          id:id
        }
      });
      return { Type: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(input: any, id: any) {
    try {
      const res = await Type.findOne({where: {id:id}})
      if(res){
        input.typeTranslates.map(async (element) => {
          if(element.title_en != undefined){
            const typeTranslate = await TypeTranslate.update({title: element.title_en}, {where: {type_id:id, locale:'en'}})
    
            if(!typeTranslate){
              await TypeTranslate.create({
                type_id: res.dataValues.id,
                locale: 'en',
                title: element.title_en,
              });
            }
          }
          if(element.title_hi != undefined){

            const typeTranslate = await TypeTranslate.update({
              title: element.title_hi
            }, {where: {type_id:id, locale:'hi'}})
     
            if(!typeTranslate){
              await TypeTranslate.create({
                type_id: res.dataValues.id,
                locale: 'hi',
                title: element.title_hi,
              });
            }
          }
         
        });
      
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }
  // //DELETE
  async delete(id: bigint) {
    const val = await Type.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Type.destroy({ where: { id: id } });
        if(res){
          await TypeTranslate.destroy({ where: { type_id: id } })
        }
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

}

export { TypeRepository };
