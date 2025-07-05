import {Samagri,instance} from "../models/Samagri"
import { SamagriTranslate } from "../models/SamagriTranslate";

class SamagriRepository {

  async list() {
    try {
      const res: Samagri[] = await Samagri.findAll({
        attributes: ["id","image","quantity","type","is_sell","price","discounted_price"],
        order: [["id", "DESC"]],
        include: [
          {
            model: SamagriTranslate,
            attributes: ["id", "samagri_id", "title", "locale"],
            order: [["id", "DESC"]],
          }
        ]
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  // POST
  async store(post: any) {
    // if( !post.Quantity || !post.Price || !post.sell || !post.discounted_price)
    // throw new Error('Must include all Fields');
    // else {  
         try{
           
            const res = await Samagri.create({
              image:post.Image,
              quantity:post.quantity,
              type:post.type,
              is_sell:post.sell,
              price:post.Price,
              discounted_price:post.discounted_price
            });
        
          if(res){
            await SamagriTranslate.create({
              samagri_id: res.dataValues.id,
              title: post.title_en,
              locale: 'en', 
            });

            await SamagriTranslate.create({
              samagri_id: res.dataValues.id,
              title: post.title_hi,
              locale: 'hi', 
            });
          }
        } catch (e: any) {
             return { error: e.errors[0].message };
       }
    //  }
  }  
  async edit(id:bigint) {
    try {
      const res: Samagri[] = await Samagri.findAll({
        attributes: ["id","image","quantity","type","is_sell","price","discounted_price"],
        include: [
          {
            model: SamagriTranslate,
            attributes: ["id", "samagri_id", "title", "locale"],
            order: [["id", "DESC"]],
            where: {
              samagri_id: id
            }
          },
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

//UPDATE
  async update(put: any) {
    const val = await Samagri.findOne({where:{id: put.id}});
    // if(!val)
    // throw new Error('Invalid Id');
    // else if( !put.quantity || !put.price || !put.is_sell || !put.discounted_price ||!put.type)
    // throw new Error('Must include all Fields');
    // else{
    //   let sampleFile;
    // let uploadPath;
    
    // if (!files || Object.keys(files).length === 0) {
    //    throw new Error('No files were uploaded.');
    // }
    // sampleFile = files.image;
    // var file_name = new Date().getTime() +'_'+sampleFile.name;
    // uploadPath = __dirname + '/upload/' + file_name;
    // const path ='/upload/' + file_name
    // sampleFile.mv(uploadPath, async function(err) {
    //     if (err)
    //       throw new Error(err);
        try{
                   
          const res = await Samagri.findOne({where: {id:put.id}})
   
          if(res){
            const list = await Samagri.update({
              image:put.Image,
              quantity:put.quantity,
              price:put.Price,
              is_sell:put.is_sell, 

            },
              { where: { id: put.id } });
            if(list){

              const pujaTranslateEn = await SamagriTranslate.update(
                {
                  title: put.title_en,
                  locale: 'en'
                } ,
                {where: {samagri_id: put.id, locale: 'en'}})
                const pujaTranslateHi = await SamagriTranslate.update(
                  {
                    title: put.title_hi,
                    locale: 'hi'
                  } ,
                  {where: {samagri_id:put.id,locale: 'hi'}})
              if(!pujaTranslateEn){
                await SamagriTranslate.create({
                  samagri_id: res.dataValues.id,
                  title: put.title_en,
                  locale: 'en', 
                });
              }
              if(!pujaTranslateHi){
                await SamagriTranslate.create({
                  samagri_id: res.dataValues.id,
                  title: put.title_hi,
                  locale: 'hi', 
                });
              }
            }
           
          }
          
        } 
        catch (e: any) {
            return { error: e.errors[0].message };
      }
    //  });
      // }
  }
//DELETE
  async delete( id: bigint) {
    const val = await Samagri.findOne({ where: { id:id} });
  if (!val) {
    throw new Error("id not found");
  }else if (val) {  
      try{
          const res = await Samagri.destroy({where:{id:id}});
          return { body: res };
       }catch(e:any){
          return { error: e };
       }
    
  }
}

// async pujaSamagriListing(locale: number, slug: string) {

//   if (locale && slug == '0') {
//     if (locale == 1) {
//       const pujaHindiData = await SamagriTranslate.findAll({
//         where: {
//           locale: 1,
//         },
//         attributes: ["id", "samagri_id", "title", "slug"],
//         include: [
//           {
//             model: Samagri,
//             attributes: ["id", "image", "price"],
//           },
//         ],
//       });
//       const pujaData = JSON.parse(JSON.stringify(pujaHindiData))
//       return ({ body: pujaData })
//     } else if (locale == 2) {
//       const pujaEnglishData = await SamagriTranslate.findAll({
//         where: {
//           locale: 2,
//         },
//         attributes: ["id", "samagri_id", "title", "slug"],
//         include: [
//           {
//             model: Samagri,
//             attributes: ["id", "image", "price"],
//           },
//         ],
//       });
//       const pujaData = JSON.parse(JSON.stringify(pujaEnglishData))
//       return ({ body: pujaData })
//     }
//   } else if (locale && slug != '0') {
//     // from Puja Translate and puja Table 
//     const pujaHindiData = await SamagriTranslate.findAll({
//       where: {
//         locale: locale,
//         // slug: slug
//       },
//       attributes: ["id", "samagri_id", "title", "slug", "description"],
//       include: [
//         {
//           model: Samagri,
//           attributes: ["id", "image", "quantity", "price",],
//         },
//       ],
//     });
//     const pujaData = JSON.parse(JSON.stringify(pujaHindiData))

//     // puja Samagries Data
//     const pujaSamagri = await PujaSamagri.findAll({
//       where: {
//         samagri_id: pujaData[0].samagri_id
//       },
//       attributes: ["id","puja_id","samagri_id"],
//       include: [
//         {
//           model: SamagriTranslate,
//           attributes: ["title"],
//           where: { locale: locale }
//         },
      
//       ]
//     });
//     const pujaSamagriData = JSON.parse(JSON.stringify(pujaSamagri))
//     return ({ Pujadata: pujaData, PujaSamagri: pujaSamagriData })
//   } else {
//     throw new Error("Inavlid Parameter!");
//   }
// }

  
  }


export { SamagriRepository };