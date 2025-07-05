import { PackageMembers, Package } from "../models/Package";
import { PackageDetail } from "../models/PackageDetail";
import { PackageDetailItem } from "../models/PackageDetailItem";
import { PackageDetailTranslate } from "../models/PackageDetailTranslate";
import { PujaTranslate } from "../models/PujaTranslate";
import { PackageTranslate } from "../models/PackageTranslate";
import { Puja } from "../models/Puja";
import { PackageDetailItemTranslate } from "../models/PackageDetailItemTranslate";
import { PujaLocation } from "../models/PujaLocation";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";
import { Language } from "../models/Language";
import { LanguageTranslate } from "../models/LanguageTranslate";
import { Booking } from "../models/Booking";

const date = require('date-and-time')

export class PackageRepository {
  async getAll() {
    try {
      const res: Package[] = await Package.findAll({
        attributes: ["id", "puja_id", "discounted_price", "price"],
        include: [
          {
            model: PackageTranslate,
            attributes: ["id", "package_id", "title", "locale", "description"],
            order: [["id", "DESC"]],
          }
        ]
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(input: any, files: any) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');

    const puja = await Puja.findOne({
      where: { id: input.puja_id },
    });

    if (!input.puja_id ) {
      throw new Error("empty field");
    }

    if (!puja) {
      throw new Error("puja id not found");
    }
  
    else {
      if(input.details){
        input.details.map((det)=>{
          if(det.title_en == '' || det.title_hi == '' || det.is_required == ''){
        throw new Error("details not found");
          }
        //   if(det.is_required != 1 ){
        //     if(det.price == null || det.price == 0){
        // throw new Error("price not found");
  
        //     }
        //   }
          else{
            if(det.pandit_required == '' || det.pandit_required != 1){
  
              det.items.map((it)=>{
                if(it.title_en == '' || it.title_hi == '' ){
          throw new Error("details not found");
    
                }
              })
            }
            if(det.is_required != 1){
              det.items.map((it)=>{
                if(it.title_en == '' || it.title_hi == '' || it.price == 0 || it.price == null){
          throw new Error("details not found");
    
                }
              })
            }
            // else{
            //   if(det.price == null || det.price == 0){
            //     throw new Error("price not found");
          
            //         }
            // }
          }
        })
      }
      
      let totalItemPrice:number = 0;
      let totalDetailPrice:number = 0;
      let totalPrice:number = 0;
      let finalPriceValue:number = 0
      // try {

        const createPackage = await Package.create({
          puja_id: puja.dataValues.id,
          price: totalItemPrice,
          discounted_price: input.packageData.discount_price,
          createdAt: currentFormattedDate,
          updatedAt: currentFormattedDate,
          deletedAt: null
        });

        if (createPackage) {
          await PackageTranslate.create({
            package_id: createPackage.dataValues.id,
            title: input.packageData.title_en,
            locale: 'en',
            description: input.packageData.description_en,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          await PackageTranslate.create({
            package_id: createPackage.dataValues.id,
            title: input.packageData.title_hi,
            locale: 'hi',
            description: input.packageData.description_hi,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          let details = input.details;
          if(input.details.length != 0){

            for (var i = 0; i < details.length; i++) {
              var element = details[i];
              let DetailPrice=0;
              for(var j=0; j<element.items.length; j++){
                 DetailPrice += parseFloat(element.items[j].price);
                }
              let sum:number = DetailPrice;
              DetailPrice=0;
              const packageDetail = await PackageDetail.create({
                package_id: createPackage.dataValues.id,
                is_required: element.is_required,
                item_selectable: element.is_required == 1 ? 0 : 1,
                pandit_required: element.pandit_required == 1 ? 1 : 0,
                price: element.pandit_required == 1 ? Number(element.price) : sum,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
              if(packageDetail.dataValues.is_required < 3){
  
                finalPriceValue+= packageDetail.dataValues.price
              }
  
              if (packageDetail) {
                PackageDetailTranslate.create({
                  package_detail_id: packageDetail.dataValues.id,
                  title: element.title_en,
                  locale: 'en',
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
  
                PackageDetailTranslate.create({
                  package_detail_id: packageDetail.dataValues.id,
                  title: element.title_hi,
                  locale: 'hi',
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
          
            
            if(element.items.length != 0){
  
              for (var j = 0; j < element.items.length; j++) {
                var item = element.items[j];
                totalItemPrice += item.price;
                let packageDetailItem = await PackageDetailItem.create({
                  package_detail_id: packageDetail.dataValues.id,
                  quantity: item.quantity == '' ? null : item.quantity,
                  price: item.price == 0 ? null : item.price,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
  
                if (packageDetailItem) {
                  PackageDetailItemTranslate.create({
                    package_detail_item_id: packageDetailItem.dataValues.id,
                    title: item.title_hi == '' ? null : item.title_hi,
                    locale: 'hi',
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null
                  });
  
                  PackageDetailItemTranslate.create({
                    package_detail_item_id: packageDetailItem.dataValues.id,
                    title: item.title_en == '' ? null : item.title_en,
                    locale: 'en',
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null
                  });
                }
              }
            }
  
                
              }
              await Package.update({price: finalPriceValue},{where: {id: createPackage.dataValues.id }})
            }
          }
        }

      // } catch (e: any) {
      //   return { error: e.errors[0].message };
      // }
    }
  }

  async edit(id: bigint) {
    try {
      const res = await Package.findOne({
        attributes: ["id", "puja_id", "discounted_price", "price"],
        include: [
          {
            model: PackageTranslate,
            attributes: ["id", "package_id", "title", "locale", "description"],
            order: [["id", "DESC"]],
            where: {
              package_id: id
            }
          },
          {
            model: PackageDetail,
            include: [
              {
                model: PackageDetailTranslate
              },
              {
                model: PackageDetailItem,
                include: [
                  {
                    model: PackageDetailItemTranslate
                  }
                ]
              }
            ]
          }
        ],
        where: {
          id: id
        }
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async packageByPujaId(puja_id: bigint) {
    try {
      const res = await Package.findAll({
        attributes: ["id", "puja_id", "discounted_price", "price"],
        order: [["id", "DESC"]],
        include: [
          {
            model: PackageTranslate,
            attributes: ["id", "package_id", "title", "locale", "description"],
            order: [["id", "DESC"]],
          },
          {
            model: PackageDetail,
            include: [
              {
                model: PackageDetailTranslate
              },
              {
                model: PackageDetailItem,
                include: [
                  {
                    model: PackageDetailItemTranslate
                  }
                ]
              }
            ]
          }
        ],
        where: {
          puja_id: puja_id
        }
      });
    
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }


  async update(input: any) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    const puja = await Puja.findOne({where: { id: input.puja_id }});
    const del = await Puja.findAll({
      where: { id: input.puja_id, deletedAt: null },
    });
    const val = await Package.findOne({ where: { id: input.package_id } });
    if (!val) {
      throw new Error("Id not found");
    }
    if (!input.puja_id ) {
      throw new Error("empty field");
    }
    if (del.length == 0) {
      throw new Error("puja id has been deleted earlier");
    }
    if (!puja) {
      throw new Error("puja id not found");
    }
    else {
      if(input.details){
        input.details.map((det)=>{
          if(det.title_en == '' || det.title_hi == '' || det.is_required == ''){
        throw new Error("details not found");
          }
        //   if(det.is_required != 1 ){
        //     if(det.price == null || det.price == 0){
        // throw new Error("price not found");
  
        //     }
        //   }
          else{
            if(det.pandit_required == '' || det.pandit_required != 1){
  
              det.items.map((it)=>{
                if(it.title_en == '' || it.title_hi == ''){
          throw new Error("details not found");
    
                }
              })
            }  if(det.is_required != 1){
              det.items.map((it)=>{
                if(it.title_en == '' || it.title_hi == '' || it.price == 0 || it.price == null){
          throw new Error("details not found");
    
                }
              })
            }
            // else{
            //   if(det.price == null || det.price == 0){
            //     throw new Error("price not found");
          
            //         }
            // }
          }
        })
      }
      //try {
        let totalItemPrice:number = 0;
    
        const createPackage = await Package.update({
          puja_id: puja.dataValues.id,
          price: totalItemPrice,
          discounted_price: input.packageData.discount_price,
          createdAt: currentFormattedDate,
          updatedAt: currentFormattedDate,
        }, { where: { id: input.package_id } });
       
        if (createPackage) {
          await PackageTranslate.update({
            title: input.packageData.title_en,
            locale: 'en',
            description: input.packageData.description_en,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          }, { where: { package_id: input.package_id, locale: 'en' } });

          await PackageTranslate.update({
            title: input.packageData.title_hi,
            locale: 'hi',
            description: input.packageData.description_hi,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          }, { where: { package_id: input.package_id, locale: 'hi' } });

          let details = input.details;

          if (details != null) {
            let oldPackageDetails = await PackageDetail.findAll({
              where: { package_id: input.package_id }, attributes: ['id'],
              // include: [{ model: PackageDetailItem }] //1
            });
            details.map(async (det)=>{
              if(det.pandit_required == 1){
                det.items.map(async (it)=>{
                  await PackageDetailItem.destroy({where: {id: it.id}})                  
                })
              }
              // else if(det.is_required == 1 && det.pandit_required != 1){
              //   await PackageDetail.update({price: 0},{where: {id: det.id}})
              // }  //2
            })
        //  console.log('1',oldPackageDetails)
        //  console.log('2',details)
        //  console.log('3',input.package_id)

            this.updatePackageDetails(oldPackageDetails, details, input.package_id); 
          }
        }
      // } catch (e: any) {
      //   return { error: e.errors[0].message };
      // }
    }
  }

  async updatePackageDetails(oldDetails, newDetails, packageId) {
    const now = new Date();

    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldDetailId = [];
    let newDetailId = [];
    let total:number = 0;
    let checkPackagePrice;
    if (oldDetails != null) {
      for (let i in oldDetails) {
        oldDetailId.push(oldDetails[i].dataValues.id);
      }
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        if (!isNaN(newDetails[i].id)) {
          newDetailId.push(newDetails[i].id);
        }
      }
    }

    if (oldDetailId.length > 0 && newDetailId.length > 0) {
      let difference = oldDetailId.filter(j => !newDetailId.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await PackageDetail.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await PackageDetail.destroy({ where: { package_id: packageId } });
    }
    if (newDetails != null) {
      for (let i in newDetails) {
        let minPrice:number = 0;
        if(newDetails[i].pandit_required == 1 && newDetails[i].is_required == 1){
          total = total + parseFloat(newDetails[i].price)
        }else{

          for (let j in newDetails[i].items) {
            if(newDetails[i].is_required < 3 && newDetails[i].pandit_required != 1 ) {
              if(newDetails[i].items[j].price != undefined ){
                total = total + parseFloat(newDetails[i].items[j].price);
              }
            }

            minPrice = minPrice + parseFloat(newDetails[i].items[j].price);
          }
        }

        if (!isNaN(newDetails[i].id)) {
          await PackageDetail.update({
              is_required: newDetails[i].is_required,
              item_selectable: newDetails[i].is_required == 1 ? 0 : 1,
              pandit_required: newDetails[i].pandit_required,
              price: newDetails[i].pandit_required == 1 ? Number(newDetails[i].price) : Number(minPrice),
            },
            {where: { id: newDetails[i].id }
          });

          PackageDetailTranslate.update({
            title: newDetails[i].title_en,
            updatedAt: currentFormattedDate
          }, { where: { package_detail_id: newDetails[i].id, locale: 'en' } });

          PackageDetailTranslate.update({
            title: newDetails[i].title_hi,
            updatedAt: currentFormattedDate
          }, { where: { package_detail_id: newDetails[i].id, locale: 'hi' } });

          let oldPackageDetailItems = await PackageDetailItem.findAll({ where: { package_detail_id: newDetails[i].id }, attributes: ['id'] });
          this.updatePackageDetailItems(oldPackageDetailItems, newDetails[i].items, newDetails[i].id);
        }
        else {
          let packageDetail = await PackageDetail.create({
            package_id: packageId,
            is_required: newDetails[i].is_required,
            item_selectable: newDetails[i].is_required == 1 ? 0 : 1,
            pandit_required: newDetails[i].pandit_required ? newDetails[i].pandit_required : 0,
            price: newDetails[i].pandit_required == 1 ? (newDetails[i].price) : minPrice, //4
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          PackageDetailTranslate.create({
            package_detail_id: packageDetail.dataValues.id,
            title: newDetails[i].title_en,
            locale: 'en',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          PackageDetailTranslate.create({
            package_detail_id: packageDetail.dataValues.id,
            title: newDetails[i].title_hi,
            locale: 'hi',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          if (packageDetail) {
            for (let j in newDetails[i].items) {
              let packageDetailItem = await PackageDetailItem.create({
                package_detail_id: packageDetail.dataValues.id,
                price: newDetails[i].items[j].price,
                quantity: newDetails[i].items[j].quantity,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              PackageDetailItemTranslate.create({
                package_detail_item_id: packageDetailItem.dataValues.id,
                title: newDetails[i].items[j].title_hi,
                locale: 'en',
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              PackageDetailItemTranslate.create({
                package_detail_item_id: packageDetailItem.dataValues.id,
                title: newDetails[i].items[j].title_en,
                locale: 'hi',
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
            }
          }
        }
      
      }
       checkPackagePrice = await Package.findOne({where: { id: packageId }});
      await Package.update({price: total},{where: { id: packageId }});
    }


    if(checkPackagePrice && checkPackagePrice.dataValues.price != total) {
      await Booking.destroy({ where: { package_id: packageId } });
    }
    
  }

  async updatePackageDetailItems(oldDetails, newDetails, packageDetailId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldDetailId = [];
    let newDetailId = [];
    
    if (oldDetails != null) {
      for (let i in oldDetails) {
        oldDetailId.push(oldDetails[i].dataValues.id);
      }
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        if (!isNaN(newDetails[i].id)) {
          newDetailId.push(newDetails[i].id);
        }
      }
    }

    if (oldDetailId.length > 0 && newDetailId.length > 0) {
      let difference = oldDetailId.filter(j => !newDetailId.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await PackageDetailItem.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await PackageDetailItem.destroy({ where: { package_detail_id: packageDetailId } });
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        if (!isNaN(newDetails[i].id) 
        // && newDetails[i].price > 0
        ) {
     
          PackageDetailItem.update({quantity: newDetails[i].quantity, price: newDetails[i].price,}, {where: { id: newDetails[i].id }});

          PackageDetailItemTranslate.update({
            
            title: newDetails[i].title_en,
           
          
          
          },{where: {package_detail_item_id: newDetails[i].id,locale: 'en'}});

          PackageDetailItemTranslate.update({
       
            title: newDetails[i].title_hi,
         
      
          },{where: {package_detail_item_id: newDetails[i].id, locale: 'hi'}});          
        }
        else if(newDetails[i].id != '' 
        // && newDetails[i].price > 0 
        ){
      
          let packageDetailItem = await PackageDetailItem.create({
            package_detail_id: packageDetailId,
            price: parseFloat(newDetails[i].price),
            quantity:newDetails[i].quantity,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          PackageDetailItemTranslate.create({
            package_detail_item_id: packageDetailItem.dataValues.id,
            title: newDetails[i].title_en,
            locale: 'en',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          PackageDetailItemTranslate.create({
            package_detail_item_id: packageDetailItem.dataValues.id,
            title: newDetails[i].title_hi,
            locale: 'hi',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }

  async delete(id: bigint) {
    const delData = await Package.findAll({ where: { id: id } });
    const del = await Package.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const list = await Package.destroy({ where: { id: id } });
        if(list){
          await Booking.destroy({ where: { package_id: id } });
        }
        return { body: list };
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

  async list(locale: number, slug: string, on_site: number, location_id: number, date: string) {
    //
  }

  async pujaPackages(slug: any, locale: any) {
    let data;
    let locations;
    let language;
    try {
      locations = await Location.findAll({
        attributes: ['id'],
        include: [
          {model: LocationTranslate, attributes:['id', 'location_id', 'title'], where:{locale:locale}}
        ]
      })
      language = await Language.findAll({
        attributes: ['id'],
        include: [
          {model: LanguageTranslate, attributes:['id', 'language_id', 'title'], where:{locale:locale}}
        ]
      })
      data = await PujaTranslate.findOne({
        attributes: ["id", "puja_id"],
        where: {
          slug: slug,
        },
        include: [
          {
            model: Puja,
            attributes: ["id", "status", "on_site"],
            where: {
              status: 1
            },
            include: [
              {
                model: PujaTranslate,
                attributes: ["slug"],
                where: {
                  locale: locale,
                },
              },
              {
                model: Package,
                attributes: ["id", "puja_id", "price", "discounted_price"],
                include: [
                  {
                    model: PackageTranslate,
                    attributes: ["id", "package_id", "title", "locale", "description"],
                    where: {
                      locale: locale,
                    }
                  },
                  {
                    model: PackageDetail,
                    attributes: ["id", "package_id", "type", "price", "is_required", "item_selectable", 'pandit_required'],
                    include: [
                      {
                        model: PackageDetailTranslate,
                        attributes: ["id", "package_detail_id", "title", "locale"],
                        where: {
                          locale: locale
                        }
                      },
                      {
                        model: PackageDetailItem,
                        attributes: ["id", "package_detail_id", "quantity", "price"],
                        include: [
                          {
                            model: PackageDetailItemTranslate,
                            attributes: ["id", "package_detail_item_id", "title", "locale"],
                            where: {
                              locale: locale
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });
    } catch (e: any) {
      return { error: e };
    }
    return { data, locations, language };
  }
}
