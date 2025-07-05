import { Category } from "../models/Category";
import { CategoryTranslate } from "../models/CategoryTranslate";
import { Language } from "../models/Language";
import { LanguageLocation } from "../models/LanguageLocation";
import { LanguageTranslate } from "../models/LanguageTranslate";
import { Location } from "../models/Location";
import {
  LocationTranslate,
  LocationTranslateMembers,
} from "../models/LocationTranslate";
import { PujaLocation } from "../models/PujaLocation";

const date = require('date-and-time')

class LocationRepository {

    //GET
    async list() {
      try {
        const res = await Location.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [
            {
              model: LocationTranslate,
              attributes: ["id", "location_id", "title", "locale"],
              order: [["id", "DESC"]],
            },
            {
              model: LanguageLocation,
              // attributes: ['location_id'],
              include: [
                {
                  model: Language,
                  include: [
                    {
                      model: LanguageTranslate,
                      attributes: ["language_id", "title"],
                      where:{locale:'en'}
                    }
                  ]
                }
              ]
              // where: {
              //   puja_id: id
              // }
            }
          ],
        });

        const data = await Language.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [
            {
              model: LanguageTranslate,
              attributes: ["id", "language_id", "title", "locale"],
              order: [["id", "DESC"]],
            },
          ],
        });

        const categories = await Category.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [{
              model: CategoryTranslate,
              attributes: ["id", "title", "locale"]
            }
          ]
        });

        return { Location: res, Language: data, Category: categories };
      } catch (e: any) {
        return { error: e };
      }
    }


  // POST
  async store(input: any) {
    try {
      const now  =  new Date();
      const currentFormattedDate = date.format(now,'YYYY-MM-DD HH:mm:ss');
      
      const res = await Location.create({
        image:input.Image,
        createdAt : currentFormattedDate, 
        updatedAt : currentFormattedDate, 
        deletedAt : null
      });
      // const response = await LanguageLocation.create({
      //   location_id : res.dataValues.id,
      //   language_id: input.
      //   createdAt : currentFormattedDate, 
      //   updatedAt : currentFormattedDate, 
      //   deletedAt : null
      // });
      

      if(res && input.locationTranslates) {
        input.locationTranslates.map(async (element) => {

          // if(!element.title_en || !element.title_hi){
      // throw new Error("Title not found");

      //     }
      if(element.title_en != undefined){
        await LocationTranslate.create({
          location_id: res.dataValues.id,
          locale: 'en',
          title: element.title_en,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
      if(element.title_hi != undefined){

        await LocationTranslate.create({
          location_id: res.dataValues.id,
          locale: 'hi',
          title: element.title_hi,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
        });
      }
      if(input.language_id && input.language_id.length > 0){
        // console.log(input.language_id.length)
        for (var i = 0; i < input.language_id.length; i++) {
          await LanguageLocation.create({
            location_id: res.dataValues.id,
            language_id: input.language_id[i].value,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          })
          
        }
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }

  async edit(id:bigint){
    try {
      const res = await Location.findOne({
        order: [["id", "DESC"]],
        attributes: ["id", "image"],
        include: [
          {
            model: LocationTranslate,
            attributes: ["id", "location_id", "title", "locale"],
            order: [["id", "DESC"]],
          },
          {
            model: LanguageLocation,
            // attributes: ['location_id'],
            include: [
              {
                model: Language,
                include: [
                  {
                    model: LanguageTranslate,
                    attributes: ["language_id", "title"]
                  }
                ]
              }
            ]
            // where: {
            //   puja_id: id
            // }
          }
        ],
        where: {
          id:id
        }
      });
      return { Location: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(input: any, id: any) {
    try {
      const res = await Location.findOne({where: {id:id}})
      
      if(res){
        const list = await Location.update({
          image:input.Image}, 
          { where: { id: id } });
        input.locationTranslates.map(async (element) => {
          // console.log(element)
          if(element.title_en != undefined){
            const locationTranslate = await LocationTranslate.update({title: element.title_en}, {where: {location_id:id, locale:'en'}})
    
            if(!locationTranslate){
              await LocationTranslate.create({
                location_id: res.dataValues.id,
                locale: 'en',
                title: element.title_en,
              });
            }
          }
          if(element.title_hi != undefined){

            const locationTranslate = await LocationTranslate.update({
              title: element.title_hi
            }, {where: {location_id:id, locale:'hi'}})
     
            if(!locationTranslate){
              await LocationTranslate.create({
                location_id: res.dataValues.id,
                locale: 'hi',
                title: element.title_hi,
              });
            }
          }
         
        });
        // console.log(input)
        if (input.language_id && input.language_id.length > 0) {
          this.updateLocations(input.language_id, input.id);
        }
      
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }

  async updateLocations(newLanguages, locationId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldLanguages = await LanguageLocation.findAll({where:{location_id: locationId}, attributes:['language_id']});

    
    let oldLanguageId = [];

    if (oldLanguages != null) {
      for (let i in oldLanguages) {
        oldLanguageId.push(oldLanguages[i].dataValues.language_id);
      }
    }

    if (oldLanguageId.length > 0 && newLanguages.length > 0) {
      let difference = oldLanguageId.filter(j => !newLanguages.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await LanguageLocation.destroy({ where: { location_id: locationId, language_id: difference[k] } });
        }
      }
    }
    if (newLanguages.length > 0) {
      for (var i=0; i < newLanguages.length ; i++ ) {
        // console.log(newLocations[i].value)
        let languageLocations = await LanguageLocation.findOne({ where: { location_id: locationId, language_id: newLanguages[i].value} });

        if (!languageLocations) {
          await LanguageLocation.create({
            location_id: locationId,
            language_id: newLanguages[i].value,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }
  // async updateLocations(newLanguages, locationId) {
  //   const now = new Date();
  //   const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
  //   let oldLanguages = LanguageLocation.findAll({where:{location_id: locationId}, attributes:['language_id']});
  //   let oldLanguageId = [];

  //   if (oldLanguages != null) {
  //     for (let i in oldLanguages) {
  //       oldLanguageId.push(oldLanguages[i].dataValues.language_id);
  //     }
  //   }

  //   if (oldLanguageId.length > 0 && newLanguages.length > 0) {
  //     let difference = oldLanguageId.filter(j => !newLanguages.includes(j));
  //     if (difference.length > 0) {
  //       for (let k in difference) {
  //         await LanguageLocation.destroy({ where: { location_id: locationId, language_id: difference[k] } });
  //       }
  //     }
  //   }

  //   if (newLanguages.length > 0) {
  //     for (let l in newLanguages) {
  //       let languageLocation = await LanguageLocation.findOne({ where: { location_id: locationId, language_id: newLanguages[l] } });

  //       if (!languageLocation) {
  //         await LanguageLocation.create({
  //           location_id: locationId,
  //           language_id: newLanguages[l],
  //           createdAt: currentFormattedDate,
  //           updatedAt: currentFormattedDate,
  //           deletedAt: null
  //         });
  //       }
  //     }
  //   }
  // }
  // //DELETE
  async delete(id: bigint) {
    const val = await Location.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Location.destroy({ where: { id: id } });
        if(res){
          await LocationTranslate.destroy({ where: { location_id: id } });
          await LanguageLocation.destroy({ where: { location_id: id } });
          await PujaLocation.destroy({ where: { location_id: id } });
        }

        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

}

export { LocationRepository };
