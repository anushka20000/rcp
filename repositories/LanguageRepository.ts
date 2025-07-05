import { Language} from "../models/Language";
import { LanguageLocation } from "../models/LanguageLocation";
import {
  LanguageTranslate,
  LanguageTranslateMembers,
} from "../models/LanguageTranslate";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";

const date = require('date-and-time')

class LanguageRepository {

    //GET
    async list() {
      // try {
        const res = await Language.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [
            {
              model: LanguageTranslate,
              attributes: ["id", "language_id", "title", "locale", "createdAt"],
              order: [["id", "DESC"]],
            },
            // {
            //   model: Location,
            //   include: [
            //     {
            //       model: LocationTranslate,
            //       where:{locale:'en'}
            //     }
            //   ]
            // }
          ],
        });
        return { Language: res };
      // } catch (e: any) {
      //   return { error: e };
      // }
    }


  // POST
  async store(input: any) {
    try {
      const now  =  new Date();
      const currentFormattedDate = date.format(now,'YYYY-MM-DD HH:mm:ss');
      
      const res = await Language.create({
        // location_id:input.location_id,
        createdAt : currentFormattedDate, 
        updatedAt : currentFormattedDate, 
        deletedAt : null
      });

      if(res && input.languageTranslates) {
        input.languageTranslates.map(async (element) => {

          // if(!element.title_en || !element.title_hi){
      // throw new Error("Title not found");

      //     }
      if(element.title_en != undefined){
        await LanguageTranslate.create({
          language_id: res.dataValues.id,
          locale: 'en',
          title: element.title_en,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
      if(element.title_hi != undefined){

        await LanguageTranslate.create({
          language_id: res.dataValues.id,
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
      const res = await Language.findOne({
        order: [["id", "DESC"]],
        attributes: ["id"],
        include: [
          {
            model: LanguageTranslate,
            attributes: ["id", "language_id", "title", "locale", "createdAt"],
            order: [["id", "DESC"]],
          },
        ],
        where: {
          id:id
        }
      });
      return { Language: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(input: any, id: any) {
    try {
      const res = await Language.findOne({where: {id:id}})
      // const response = await Language.update({ 
      //   location_id:input.location_id},{where: {id:id}});
      if(res){
        input.languageTranslates.map(async (element) => {
          // console.log(element)
          if(element.title_en != undefined){
            const languageTranslate = await LanguageTranslate.update({title: element.title_en}, {where: {language_id:id, locale:'en'}})
    
            if(!languageTranslate){
              await LanguageTranslate.create({
                language_id: res.dataValues.id,
                locale: 'en',
                title: element.title_en,
              });
            }
          }
          if(element.title_hi != undefined){

            const languageTranslate = await LanguageTranslate.update({
              title: element.title_hi
            }, {where: {language_id:id, locale:'hi'}})
     
            if(!languageTranslate){
              await LanguageTranslate.create({
                language_id: res.dataValues.id,
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
    const val = await Language.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Language.destroy({ where: { id: id } });
        if(res){
          await LanguageLocation.destroy({ where: { language_id: id } })
        }
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

}

export { LanguageRepository };
