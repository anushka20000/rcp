import { Category, instance } from "../models/Category";
import {
  CategoryTranslate,
  CategoryTranslateMembers,
} from "../models/CategoryTranslate";
import { PujaCategory } from "../models/PujaCategory";

const date = require('date-and-time')

class CategoryRepository {

    //GET
    async list() {
      try {
        const res = await Category.findAll({
          order: [["id", "DESC"]],
          attributes: ["id"],
          include: [
            {
              model: CategoryTranslate,
              attributes: ["id", "category_id", "title", "locale", "createdAt"],
              order: [["id", "DESC"]],
            },
          ],
        });
        return { Category: res };
      } catch (e: any) {
        return { error: e };
      }
    }


  // POST
  async store(input: any) {
    try {
      const now  =  new Date();
      const currentFormattedDate = date.format(now,'YYYY-MM-DD HH:mm:ss');
      
      const res = await Category.create({
        createdAt : currentFormattedDate, 
        updatedAt : currentFormattedDate, 
        deletedAt : null
      });

      if(res && input.categoryTranslates) {
        input.categoryTranslates.map(async (element) => {

          // if(!element.title_en || !element.title_hi){
      // throw new Error("Title not found");

      //     }
      if(element.title_en != undefined){
        await CategoryTranslate.create({
          category_id: res.dataValues.id,
          locale: 'en',
          title: element.title_en,
          createdAt : currentFormattedDate, 
          updatedAt : currentFormattedDate, 
          deletedAt : null
        }); 
      }
      if(element.title_hi != undefined){

        await CategoryTranslate.create({
          category_id: res.dataValues.id,
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
      const res = await Category.findOne({
        order: [["id", "DESC"]],
        attributes: ["id"],
        include: [
          {
            model: CategoryTranslate,
            attributes: ["id", "category_id", "title", "locale", "createdAt"],
            order: [["id", "DESC"]],
          },
        ],
        where: {
          id:id
        }
      });
      return { Category: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(input: any, id: any) {
    try {
      const res = await Category.findOne({where: {id:id}})
      if(res){
        input.categoryTranslates.map(async (element) => {
          // console.log(element)
          if(element.title_en != undefined){
            const categoryTranslate = await CategoryTranslate.update({title: element.title_en}, {where: {category_id:id, locale:'en'}})
    
            if(!categoryTranslate){
              await CategoryTranslate.create({
                category_id: res.dataValues.id,
                locale: 'en',
                title: element.title_en,
              });
            }
          }
          if(element.title_hi != undefined){

            const categoryTranslate = await CategoryTranslate.update({
              title: element.title_hi
            }, {where: {category_id:id, locale:'hi'}})
     
            if(!categoryTranslate){
              await CategoryTranslate.create({
                category_id: res.dataValues.id,
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
    const val = await Category.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Category.destroy({ where: { id: id } });
        if(res){
          await CategoryTranslate.destroy({ where: { category_id: id } });
          await PujaCategory.destroy({ where: { category_id: id } });
        }
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

}

export { CategoryRepository };
