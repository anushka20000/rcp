import { Pandit } from "../models/Pandit";
import {
  PanditTranslate,
  PanditTranslateMembers,
} from "../models/PanditTranslate";
const { Op } = require("sequelize");
const date = require('date-and-time')

class PanditRepository {

    //GET
    async list() {
      try {
        const res = await Pandit.findAll({
          order: [["id", "DESC"]],
          attributes: ["id", "status", "phone", "email"],
          include: [
            {
              model: PanditTranslate,
              attributes: ["id", "pandit_id", "title", "locale", "createdAt"],
              order: [["id", "DESC"]],
              where: { locale: 'en' }
            },
          ],
        });
        return { res: res };
      } catch (e: any) {
        return { error: e };
      }
    }

    async panditList(locale:any) {
      try {
        const res = await Pandit.findAll({
          include: [
            {
              model: PanditTranslate,
              attributes: ["title"],
              where: {locale: locale}
              // order: [["id", "DESC"]],
            },
          ],
        });
        return { res: res };
      } catch (e: any) {
        return { error: e };
      }
    }


  // POST
  async store(input: any) {
    const phoneno = /^\d{10}$/;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNumber = String(input.phone);
    const phone_number = await Pandit.findOne({ where: { phone: phoneNumber } });
    const email = await Pandit.findOne({ where: { email: input.email } });
    if (input.phone && !phoneNumber.match(phoneno)) {
      throw new Error("Contact no. is not valid");
    } else if (phone_number) {
      throw new Error("Contact no. is already present in the database");
    } else if (input.email && !input.email.match(mailformat)) {
      throw new Error("Email is not valid");
    } else if (email) {
      throw new Error("Email is already present in the database");
    } else {
    try {
      const now  =  new Date();
      const currentFormattedDate = date.format(now,'YYYY-MM-DD HH:mm:ss');
      
      const res = await Pandit.create({
        phone:input.phone,
        status: input.status,
        email: input.email,
        createdAt : currentFormattedDate, 
        updatedAt : currentFormattedDate, 
        deletedAt : null
      });
      if(res) {
        await PanditTranslate.create({
          pandit_id: res.dataValues.id,
          title: input.title_en,
          locale: 'en', 
        });

        await PanditTranslate.create({
          pandit_id: res.dataValues.id,
          title: input.title_hi,
          locale: 'hi', 
        });
      //   input.panditTranslates.map(async (element) => {
      //     if(!element.title){
      // throw new Error("Title not found");

      //     }
      //     await PanditTranslate.create({
      //       pandit_id: res.dataValues.id,
      //       locale: element.locale,
      //       title: element.title,
      //       createdAt : currentFormattedDate, 
      //       updatedAt : currentFormattedDate, 
      //       deletedAt : null
      //     }); 
      //   });
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }
  }

  async edit(id:bigint){
    try {
      const res = await Pandit.findOne({
        order: [["id", "DESC"]],
        attributes: ["id", "status", "phone", "email"],
        include: [
          {
            model: PanditTranslate,
            attributes: ["id", "pandit_id", "title", "locale", "createdAt"],
            order: [["id", "DESC"]],
          },
        ],
        where: {
          id:id
        }
      });
      return { Pandit: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(input: any) {
    const phoneno = /^\d{10}$/;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNumber = String(input.phone);
    const phone_number = await Pandit.findOne({ where: { phone: phoneNumber, id: { [Op.ne] : input.id}} });
    const email = await Pandit.findOne({ where: { email: input.email, id: { [Op.ne] : input.id} } });
    if (input.phone && !phoneNumber.match(phoneno)) {
      throw new Error("Contact no. is not valid");
    } else if (phone_number) {
      throw new Error("Contact no. is already present in the database");
    } else if (input.email && !input.email.match(mailformat)) {
      throw new Error("Email is not valid");
    } else if (email) {
      throw new Error("Email is already present in the database");
    } else {
    try {
      const res = await Pandit.findOne({where: {id:input.id}})
      
      if(res){
        const pandit = await Pandit.update({
          phone:input.phone,
          status: input.status,
          email: input.email,
        }, {where: {id:input.id}})
if(pandit){
        const pujaTranslateEn = await PanditTranslate.update(
          {
            title: input.title_en,
            locale: 'en'
          } ,
          {where: {pandit_id: input.id, locale: 'en'}})
          const pujaTranslateHi = await PanditTranslate.update(
            {
              title: input.title_hi,
              locale: 'hi'
            } ,
            {where: {pandit_id:input.id,locale: 'hi'}})
        if(!pujaTranslateEn){
          await PanditTranslate.create({
            pandit_id: res.dataValues.id,
            title: input.title_en,
            locale: 'en', 
          });
        }
        if(!pujaTranslateHi){
          await PanditTranslate.create({
            pandit_id: res.dataValues.id,
            title: input.title_hi,
            locale: 'hi', 
          });
        }
      }
        // input.panditTranslates.map(async (element) => {
        //   // console.log(element)
          
        //   const panditTranslate = await PanditTranslate.update(element, {where: {pandit_id:input.id,locale:element.locale}})
         
        //   if(!panditTranslate){
        //     await PanditTranslate.create({
        //       pandit_id: res.dataValues.id,
        //       locale: element.locale,
        //       title: element.title,
        //     });
        //   }
        // });
      
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }
  }
  // //DELETE
  async delete(id: bigint) {
    const val = await Pandit.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Pandit.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

}

export { PanditRepository };
