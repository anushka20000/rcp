import { Booking } from "../models/Booking";
import { BookingSamagriPackageDetailItem } from "../models/BookingSamagriPackageDetailItem";
import { PujaKit } from "../models/PujaKit";
import { Samagri } from "../models/Samagri";
import { SamagriPackage, instance } from "../models/SamagriPackage";
import { SamagriPackageDetail } from "../models/SamagriPackageDetail";
import { SamagriPackageDetailTranslate } from "../models/SamagriPackageDetailTranslate";
import { SamagriPackageItem } from "../models/SamagriPackageItem";
import { SamagriPackageTranslate } from "../models/SamagriPackageTranslate";
import { SamagriTranslate } from "../models/SamagriTranslate";
const date = require('date-and-time');

class SamagriPackageRepository {
  async list() {
    try {
      const res: SamagriPackage[] = await SamagriPackage.findAll({
        attributes: [
          "id",
          "puja_kit_id",
          "image",
          "quantity",
          "price",
          "discounted_price",
        ],
        include: [
          {
            model: SamagriPackageTranslate,
            attributes: ["id", "samagri_package_id", "title", "locale"],
            order: [["id", "DESC"]],
          },
        ],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async packageByPujaKitId(puja_kit_id: bigint) {
    try {
      const res = await SamagriPackage.findAll({
        order: [["id", "DESC"]],
        where: {
          puja_kit_id: puja_kit_id,
        },
        attributes: ["id", "puja_kit_id", "discounted_price", "price"],
        include: [
          {
            model: SamagriPackageTranslate,
            attributes: ["samagri_package_id", "title", "locale"],
            order: [["id", "DESC"]],
          },
        ],
      });
      if(res.length == 0){
        await PujaKit.update({price: 0, is_show: 0},{where: {id: puja_kit_id}})
      }else{
        await PujaKit.update({is_show: 1},{where:{id: puja_kit_id}})
      }
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  // POST
  async store(post: any) {
    // if( !post.quantity || !post.price  || !post.discounted_price )
    // throw new Error('Must include all Fields');
    // else {
    //   let sampleFile;
    //   let uploadPath;

    //   if (!files || Object.keys(files).length === 0) {
    //     throw new Error('No files were uploaded.');
    //  }
    //  sampleFile = files.image;
    //  var file_name = new Date().getTime() +'_'+sampleFile.name;
    //  uploadPath = __dirname + '/upload/' + file_name;
    //  const path ='/upload/' + file_name
    //  sampleFile.mv(uploadPath, async function(err) {
    //      if (err)
    //        throw new Error(err);

    try {
      if(post.details){
        post.details.map((det)=>{
          if(det.is_required == '' || det.title_en == '' || det.title_hi == ''){
            throw new Error("Details required");
          }else{
            det.items.map((it)=>{
              if(it.samagri_id == ''){
                throw new Error("Invalid samagri id");
              }
            })
          }
        })
      }
      let samagriPackageAmount = 0;
      let typeTwoAmount;
      let otherAmount = 0
      let amount=0
      let typeThreeAmount = 0 ;
      const res = await SamagriPackage.create({
        image: post.image,
        puja_kit_id: post.puja_kit_id,
        quantity: post.quantity,
        price: post.price,
        // discounted_price: post.discounted_price,
      });

      await SamagriPackageTranslate.create({
        samagri_package_id: res.dataValues.id,
        title: post.title_En,
        locale: "en",
      });
      await SamagriPackageTranslate.create({
        samagri_package_id: res.dataValues.id,
        title: post.title_Hi,
        locale: "hi",
      });
      let details = post.details;
      let samagriItemdata;
      let result;
      let sum = 0;
   
      if (details) {
        for (var i = 0; i < details.length; i++) {
          let sumRequiredAndChecked = 0;
          let sumRequiredAndOptional = 0;
          let sumRequiredAndUnchecked = 0;

          result = await SamagriPackageDetail.create({
            samagri_package_id: res.dataValues.id,
            is_required: details[i].is_required,
            item_selectable:
              details[i].is_required == 1
                ? 0
                : details[i].is_required == 2
                  ? 1
                  : details[i].is_required == 3
                    ? 1
                    : 0,
          });
          await SamagriPackageDetailTranslate.create({
            samagri_package_detail_id: result.dataValues.id,
            title: details[i].title_en,
            locale: "en",
          });
          await SamagriPackageDetailTranslate.create({
            samagri_package_detail_id: result.dataValues.id,
            title: details[i].title_hi,
            locale: "hi",
          });
        
          for (var j = 0; j < details[i].items.length; j++) {
            samagriItemdata = await SamagriPackageItem.create({
              samagri_id: details[i].items[j].samagri_id,
              samagri_package_detail_id: result.dataValues.id,
              type: details[i].is_required == 1 ? 1 : details[i].is_required == 2 ? 2 : 3
            });

            if(details[i].is_required == 1){
              let findPrice = await Samagri.findOne({
                where: {id: samagriItemdata.dataValues.samagri_id},
                attributes: ['price']
              })

              if(findPrice) {
                samagriPackageAmount += findPrice.dataValues.price;
                sumRequiredAndChecked += findPrice.dataValues.price;
              }
            }else if(details[i].is_required == 2){
              
              let findPrice = await Samagri.findOne({
                where: {id: samagriItemdata.dataValues.samagri_id},
                attributes: ['price']
              })

              if(findPrice) {
                samagriPackageAmount += findPrice.dataValues.price;
                sumRequiredAndOptional += findPrice.dataValues.price;
              }
            }
            else{
              let findPrice = await Samagri.findOne({
                where: {id: samagriItemdata.dataValues.samagri_id},
                attributes: ['price']
              })

              if(findPrice) {
                sumRequiredAndUnchecked += findPrice.dataValues.price;
              }
            }
          }

          if(details[i].is_required == 1){
            await SamagriPackageDetail.update({price: sumRequiredAndChecked},{where: {samagri_package_id: res.dataValues.id, is_required: 1}})
          }else if(details[i].is_required == 2){
            await SamagriPackageDetail.update({price: sumRequiredAndOptional},{where: {samagri_package_id: res.dataValues.id, is_required: 2}})
          }else{
            await SamagriPackageDetail.update({price: sumRequiredAndUnchecked},{where: {samagri_package_id: res.dataValues.id, is_required: 3}})
          }
        }

        await SamagriPackage.update({price: samagriPackageAmount},{where: {id: res.dataValues.id}})
      }      
      const samagriPackagePrice = await SamagriPackage.findAll({
        where: { puja_kit_id: post.puja_kit_id},
        attributes: ['price']
      });
    
      for (var i = 0; i < samagriPackagePrice.length; i++) {
       
        if(samagriPackagePrice.length > 1){
          for (var j = i + 1; j < samagriPackagePrice.length; j++) {
           await PujaKit.update(
              {
                price: Math.min(
                  samagriPackagePrice[i].dataValues.price,
                  samagriPackagePrice[j].dataValues.price
                ),
              },
              {
                where: {
                  id: post.puja_kit_id,
                },
              }
            );
          
          }
        }else if(samagriPackagePrice.length == 1){
          await PujaKit.update({price: samagriPackagePrice[i].dataValues.price},{where: { id: post.puja_kit_id}})
        }
      }

    } catch (e: any) {
      return { error: e.errors[0].message };
    }
    //});

    //  }
  }

  async edit(id: bigint) {
    try {
      const res = await SamagriPackage.findOne({
        attributes: [
          "id",
          "puja_kit_id",
          "image",
          "quantity",
          "price",
          "discounted_price",
        ],
        include: [
          {
            model: SamagriPackageTranslate,
            attributes: ["id", "samagri_package_id", "title", "locale"],
            order: [["id", "DESC"]],
            where: {
              samagri_package_id: id,
            },
          },
          {
            model: SamagriPackageDetail,
            attributes: ["is_required", "id"],
            where: {
              samagri_package_id: id,
            },
            include: [
              {
                model: SamagriPackageDetailTranslate,
              },
              {
                model: SamagriPackageItem,
                include: [
                  {
                    model: Samagri,
                  },
                ],
              },
            ],
          },
        ],
        where: {
          id: id,
        },
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(put: any) {
    const val = await SamagriPackage.findOne({
      where: { id: put.samagri_package_id },
    });
    if (!val) throw new Error("Invalid Id");
    else {
      if(put.details){
        put.details.map((det)=>{
          if(det.is_required == '' || det.title_en == '' || det.title_hi == ''){
            throw new Error("Details required");
          }else{
            det.items.map((it)=>{
              if(it.samagri_id == ''){
                throw new Error("Invalid samagri id");
              }
            })
          }
        })
      }
      try {
        const res = await SamagriPackage.findOne({ where: { id: put.samagri_package_id } });
        const data: any = {
          image: put.image,
          quantity: put.quantity,
          price: put.price
        };

        if (res) {
          const list = await SamagriPackage.update(data, {where: { id: put.samagri_package_id }});

          if (list) {
            const samagriPackageTranslateEn =
              await SamagriPackageTranslate.update(
                {
                  title: put.title_En,
                },
                { where: { samagri_package_id: put.samagri_package_id, locale: "en" } }
              );
            const samagriPackageTranslateHi =
              await SamagriPackageTranslate.update(
                {
                  title: put.title_Hi,
                },
                { where: { samagri_package_id: put.samagri_package_id, locale: "hi" } }
              );

            if (!samagriPackageTranslateEn) {
              await SamagriPackageTranslate.create({
                samagri_package_id: put.samagri_package_id,
                title: put.title_En,
                locale: "en",
              });
            }
            if (!samagriPackageTranslateHi) {
              await SamagriPackageTranslate.create({
                samagri_package_id: put.samagri_package_id,
                title: put.title_Hi,
                locale: "hi",
              });
            }
            let details = put.details;

            if (details.length > 0) {
              let oldPackageDetails = await SamagriPackageDetail.findAll({
                where: { samagri_package_id:put.samagri_package_id }, attributes: ['id'],
                include: [{ model: SamagriPackageItem }]
              });

              this.updatePackageDetails(oldPackageDetails, details, put.samagri_package_id, res.dataValues.puja_kit_id);
            }
          }
        }
      } catch (e: any) {
        return { error: e.errors[0].message };
      }
    }
  }

  async updatePackageDetails(oldDetails, newDetails, samagriPackageId, pujaKitIt) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldDetailId = [];
    let newDetailId = [];
    let total = 0;
    let totalItemOldPrice = 0;
    let totalItemNewPrice = 0;

    if (oldDetails != null) {
      for (let i in oldDetails) {
        if(oldDetails['SamagriPackageItems']) {
          for(let j in oldDetails['SamagriPackageItems']) {
            totalItemOldPrice += oldDetails['SamagriPackageItems'][j].dataValues.price;
          }
        }
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
          await SamagriPackageDetail.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await SamagriPackageDetail.destroy({ where: { samagri_package_id: samagriPackageId } });
    }


    if (newDetails != null) {
      for (let i in newDetails) {
        let minPrice = 0;
        for (let j in newDetails[i].items) {
          let samagri = await Samagri.findOne({ where: { id: newDetails[i].items[j].samagri_id } });

          if (samagri) {
            if(newDetails[i].is_required < 3) {
              total += samagri.dataValues.price;
            }

            minPrice += samagri.dataValues.price;
            totalItemNewPrice += samagri.dataValues.price;
          }
        }

        if (!isNaN(newDetails[i].id)) {
          await SamagriPackageDetail.update({
              is_required: newDetails[i].is_required,
              item_selectable: newDetails[i].is_required == 1 ? 0 : (newDetails[i].is_required == 2 ? 1 : (newDetails[i].is_required == 3 ? 1 : 0)),
              price: minPrice
            },
            {where: { id: newDetails[i].id }
          });
          await SamagriPackageDetailTranslate.update({
            title: newDetails[i].title_en
          },{where: {samagri_package_detail_id: newDetails[i].id, locale: 'en' }})
          await SamagriPackageDetailTranslate.update({
            title: newDetails[i].title_hi
          },{where: {samagri_package_detail_id: newDetails[i].id, locale: 'hi' }})

          let oldPackageDetailItems = await SamagriPackageItem.findAll({ where: { samagri_package_detail_id: newDetails[i].id }, attributes: ['id'] });
          this.updatePackageDetailItems(oldPackageDetailItems, newDetails[i].items, newDetails[i].id, newDetails[i]);
        }
        else {
          let samagriPackageDetail = await SamagriPackageDetail.create({
            samagri_package_id: samagriPackageId,
            is_required: newDetails[i].is_required,
            item_selectable: newDetails[i].is_required == 1 ? 0 : (newDetails[i].is_required == 2 ? 1 : (newDetails[i].is_required == 3 ? 1 : 0)),
            price: minPrice,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          if (samagriPackageDetail) {
            await SamagriPackageDetailTranslate.create({
              samagri_package_detail_id: samagriPackageDetail.dataValues.id,
              locale: 'en',
              title: newDetails[i].title_en
            })
            await SamagriPackageDetailTranslate.create({
              samagri_package_detail_id: samagriPackageDetail.dataValues.id,
              locale: 'hi',
              title: newDetails[i].title_hi
            })

            for (let j in newDetails[i].items) {
          
              await SamagriPackageItem.create({
                samagri_id: newDetails[i].items[j].samagri_id,
                samagri_package_detail_id: samagriPackageDetail.dataValues.id,
                type: newDetails[i].is_required == 1 ? 1 : newDetails[i].is_required == 2 ? 2 : 3,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
            }
          }
        }
      }
    }

    await SamagriPackage.update({price: total}, {where: { id: samagriPackageId }});

    if(totalItemNewPrice != totalItemOldPrice) {
      await Booking.destroy({ where: { samagri_package_id: samagriPackageId } });
    }

    let pujaKit = await PujaKit.findOne({where: {id: pujaKitIt}, 
      include:[{model: SamagriPackage}]
    }); 

    if(pujaKit) {
      let minPrice = 0;

      if(pujaKit['SamagriPackages']) {
        for(let i=0; i < pujaKit['SamagriPackages'].length; i++) {
          if(i == 0) {
            minPrice = pujaKit['SamagriPackages'][i].dataValues.price != null ? pujaKit['SamagriPackages'][i].dataValues.price : 0;
          }
          else {
            let currentPrice = pujaKit['SamagriPackages'][i].dataValues.price;

            minPrice = minPrice > currentPrice ? currentPrice : minPrice;
          }
          
          let kit = await PujaKit.update({price: minPrice}, {where: { id: pujaKit.dataValues.id }});

        }
      }
    }
  }

  async updatePackageDetailItems(oldDetails, newDetails, samagriPackageDetailId, samagriDetails) {
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
      if(oldDetailId.length >= newDetailId.length){
        let difference = oldDetailId.filter(j => !newDetailId.includes(j));
        if (difference.length > 0) {
          for (let k in difference) {
            const del = await SamagriPackageItem.destroy({ where: { id: difference[k] } });
          }
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await SamagriPackageItem.destroy({ where: { samagri_package_detail_id: samagriPackageDetailId } });
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        if (!isNaN(newDetails[i].id) && newDetails[i].samagri_id != '') { 
    
          await SamagriPackageItem.update({
            samagri_id: newDetails[i].samagri_id,
            samagri_package_detail_id: samagriPackageDetailId,
            type: samagriDetails.is_required == 1 ? 1 : samagriDetails.is_required == 2 ? 2 : 3,
          }, {where: { id: newDetails[i].id }});
        }
        else if(newDetails[i].samagri_id != '' && newDetails[i].id != ''){
          await SamagriPackageItem.create({
            samagri_id: newDetails[i].samagri_id,
            samagri_package_detail_id: samagriPackageDetailId,
            type: samagriDetails.is_required == 1 ? 1 : samagriDetails.is_required == 2 ? 2 : 3,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }

  //DELETE
  async delete(id: bigint) {
    const val = await SamagriPackage.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await SamagriPackage.destroy({ where: { id: id } });
        if(res){
          await Booking.destroy({ where: {  samagri_package_id: id } });
        }
        let pujaKit = await PujaKit.findOne({where: {id: val.dataValues.puja_kit_id}, 
          include:[{model: SamagriPackage}]
        }); 
    
        if(pujaKit) {
          let minPrice = 0;
    
          if(pujaKit['SamagriPackages']) {
            if(pujaKit['SamagriPackages'].length > 0){
              for(let i=0; i < pujaKit['SamagriPackages'].length; i++) {
                if(i == 0) {
                  minPrice = pujaKit['SamagriPackages'][i].dataValues.price != null ? pujaKit['SamagriPackages'][i].dataValues.price : 0;
                }
                else {
                  let currentPrice = pujaKit['SamagriPackages'][i].dataValues.price;
                  minPrice = minPrice > currentPrice ? currentPrice : minPrice;
                }
                
                await PujaKit.update({price: minPrice}, {where: { id: pujaKit.dataValues.id }});
             
              }

            }else{
              await PujaKit.update({price:0},{where: {id: val.dataValues.puja_kit_id}})
            }
          }
        }
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  async create() {
    //to be implemented
  }
}

export { SamagriPackageRepository };
