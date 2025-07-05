import { Model, Op, QueryTypes } from "sequelize";
import db from "../config/db";
import {
  AstrologyProductMembers,
  AstrologyProduct,
} from "../models/AstrologyProduct";
import { AstrologyProductTranslate } from "../models/AstrologyProductTranslate";
import { AstrologyProductVariation } from "../models/AstrologyProductVariation";
import { cms } from "../models/Cms";
import { CmsTranslate } from "../models/CmsTranslate";
import Slug from "slug";
import { Booking } from "../models/Booking";
const date = require('date-and-time');

export class AstrologerStoreRepository {
  async list() {
    try {
      const res: AstrologyProduct[] = await AstrologyProduct.findAll({
        attributes: ["id", "price", "type", "image"],
        order: [["id", "DESC"]],
        include: [
          {
            model: AstrologyProductTranslate,
            attributes: [
              "id",
              "astrology_product_id",
              "title",
              "slug",
              "locale",
              "description",
            ],
            order: [["id", "DESC"]],
          },
          {
            model: AstrologyProductVariation,
            attributes: [
              "id",
              "astrology_product_id",
              "carat",
              "price",
              "discounted_price",
            ],
            order: [["id", "DESC"]],
          },
        ],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: any) {
    if (!post.type) {
      throw new Error("empty field");
    }
    // else {
    // let sampleFile;
    // let uploadPath;

    // if (!files || Object.keys(files).length === 0) {
    //   throw new Error('No files were uploaded.');
    // }
    // sampleFile = files.image;
    // var file_name = new Date().getTime() + '_' + sampleFile.name;
    // uploadPath = __dirname + '/upload/' + file_name;
    // const path = '/upload/' + file_name
    // sampleFile.mv(uploadPath, async function (err) {
    //   if (err)
    //     throw new Error(err);

    try {
      let minPrice;
      let slugEn = Slug(post.title_en);
      const findSlug = await AstrologyProductTranslate.findOne({
        where: { slug: slugEn },
      });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slugEn = Slug(post.title_en + " " + UniqueString + " " + "en");
      }

      let slugHi = Slug(post.title_en + " " + "hi");
      const findSlugHi = await AstrologyProductTranslate.findOne({
        where: { slug: slugHi },
      });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slugHi = Slug(post.title_hi + " " + UniqueString + " " + "hi");
      }

      const res = await AstrologyProduct.create({
        image: post.image,
        type: post.type,
        price: post.price,
      });

      if (res) {
        await AstrologyProductTranslate.create({
          astrology_product_id: res.dataValues.id,
          title: post.title_en,
          slug: slugEn,
          locale: "en",
          description: post.description_en,
        });
        await AstrologyProductTranslate.create({
          astrology_product_id: res.dataValues.id,
          title: post.title_hi,
          slug: slugHi,
          locale: "hi",
          description: post.description_hi,
        });
        let details = post.details;

        if (details) {

          if(post.type == 2) {
            for (let k = 0; k < post.details.length; k++) {
              if (k == 0) {
                minPrice = post.details[k].Price;
              }
              else if(post.details[k].Price > 0) {
                minPrice = minPrice > post.details[k].Price ? post.details[k].Price : minPrice;
              }
            }
            for (var i = 0; i < details.length; i++) {
              await AstrologyProductVariation.create({
                astrology_product_id: res.dataValues.id,
                carat: details[i].carat,
                price: details[i].Price
              })
            }
          }
        }

        await AstrologyProduct.update({ price: post.type == 2 ? minPrice : post.price }, { where: { id: res.dataValues.id } });
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }

  async edit(id: bigint) {
    try {
      const checkVariation = await AstrologyProduct.findOne({
        attributes: ["id", "price", "type", "image"],
        where: {
          id: id,
        }
      })

      if (checkVariation) {

        const res = await AstrologyProduct.findOne({
          attributes: ["id", "price", "type", "image"],
          where: {
            id: id,
          },
          include:
            //  checkVariation.dataValues.type == 2 ? 
            [
              {
                model: AstrologyProductVariation,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "carat",
                  "price",

                ],
                // order: [["id", "DESC"]],

                // where: {
                //   astrology_product_id: id,
                // },
              },
              {

                model: AstrologyProductTranslate,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "title",
                  "slug",
                  "locale",
                  "description",
                ],
                order: [["id", "DESC"]],

                where: {
                  astrology_product_id: id,
                },

              },
            ]
          // :
          //  [{

          //   model: AstrologyProductTranslate,
          //   attributes: [
          //     "id",
          //     "astrology_product_id",
          //     "title",
          //     "slug",
          //     "locale",
          //     "description",
          //   ],
          //   order: [["id", "DESC"]],

          //   where: {
          //     astrology_product_id: id,
          //   },

          // }],
        });

        return { res };
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  async update(put: any) {
    //try {
      /*let slugEn = Slug(put.title_en + " " + "en");
      const findSlug = await AstrologyProductTranslate.findOne({ where: { slug: slugEn } });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slugEn = Slug(put.title_en + " " + UniqueString + " " + "en");
      }

      let slugHi = Slug(put.title_en + " " + "hi");
      const findSlugHi = await AstrologyProductTranslate.findOne({ where: { slug: slugHi } });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slugHi = Slug(put.title_hi + " " + UniqueString + " " + "hi");
      }*/

      const res = await AstrologyProduct.findOne({ where: { id: put.id } });
      if (res) {
        const list = await AstrologyProduct.update({
          image: put.image,
          type: put.type,
        },
          { where: { id: put.id } }
        );
      }

      const astrologyTranslateEn = await AstrologyProductTranslate.update({title: put.title_en, description: put.description_en},{
          where: { astrology_product_id: put.id, locale: "en" }
        });

      const astrologyTranslateHi = await AstrologyProductTranslate.update({title: put.title_hi,description: put.description_hi},{
          where: { astrology_product_id: put.id, locale: "hi" }
        });

      if (!astrologyTranslateEn) {
        await AstrologyProductTranslate.create({
          astrology_product_id: res.dataValues.id,
          title: put.title_en,
          locale: "en",
          description: put.description_en,
        });
      }
      if (!astrologyTranslateHi) {
        await AstrologyProductTranslate.create({
          astrology_product_id: res.dataValues.id,
          title: put.title_hi,
          locale: "hi",
          description: put.description_hi,
        });
      }

      let minPrice;

      if (put.type == 2 && put.details.length > 0) {
        for (let k = 0; k < put.details.length; k++) {
          let variantPrice = await AstrologyProductVariation.findAll({where: {astrology_product_id: put.id}})
          variantPrice.map(async (v)=>{
          if(v.dataValues.price != put.details[k].Price){
            await Booking.destroy({where: {astrology_product_id: put.id}})
          }
          })
          if (k == 0) {
            minPrice = put.details[k].Price;
          }
          else {
            if (put.details[k].Price > 0) {
              minPrice = minPrice > put.details[k].Price ? put.details[k].Price : minPrice;
            }
          }
        }

        let oldVariations = await AstrologyProductVariation.findAll({ where: { astrology_product_id: put.id }, attributes: ['id'] });

        this.updateAstrologyProductVariations(oldVariations, put.details, put.id);

        await AstrologyProduct.update({ price: minPrice }, { where: { id: res.dataValues.id } });
        
      }
      else {
        let product = await AstrologyProduct.findOne({where: {id: put.id}})
        await AstrologyProductVariation.destroy({ where: { astrology_product_id: put.id } });
        await AstrologyProduct.update({ price: put.price }, { where: { id: res.dataValues.id } });
        if(product.dataValues.price != put.price){
          await Booking.destroy({where:{astrology_product_id: put.id}})
        }
      }
    // } catch (e: any) {
    //   return { error: e.errors[0].message };
    // }
  }

  async updateAstrologyProductVariations(oldVariations, newVariations, astrologyProductId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldVariationId = [];
    let newVariationId = [];
    let minPrice = 0;

    if (oldVariations != null) {
      for (let i in oldVariations) {
        oldVariationId.push(oldVariations[i].dataValues.id);
      }
    }

    if (newVariations != null) {
      for (let i in newVariations) {
        if (newVariations[i].id != null) {
          newVariationId.push(newVariations[i].id);
        }
      }
    }

    if (oldVariationId.length > 0 && newVariationId.length > 0) {
      let difference = oldVariationId.filter(j => !newVariationId.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await AstrologyProductVariation.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldVariationId.length > 0) {
      await AstrologyProductVariation.destroy({ where: { astrology_product_id: astrologyProductId } });
    }

    if (newVariations != null) {
      for (let i in newVariations) {
        if (!isNaN(newVariations[i].id) && newVariations[i].Price > 0) {
          const astrologyProductVariations = await AstrologyProductVariation.update({
            carat: newVariations[i].carat,
            price: newVariations[i].Price
          },
            {
              where: { id: newVariations[i].id }
            });
        }
        else if (newVariations[i].id != '' && newVariations[i].Price > 0) {
          const result = await AstrologyProductVariation.create({
            astrology_product_id: astrologyProductId,
            carat: newVariations[i].carat,
            price: newVariations[i].Price,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }

  async delete(id: bigint) {
    const delData = await AstrologyProduct.findAll({ where: { id: id } });
    const del = await AstrologyProduct.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const list = await AstrologyProduct.destroy({ where: { id: id } });
        if(list){
          await Booking.destroy({ where: { astrology_product_id: id } });
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

  async lists(locale: any, search: any, order: number) {
    let categories;
    let datas;
    let astrologies;
    let astrologyIds;
    try {
      categories = await cms.findAll({
        where: {
          type: 3,
          status: 1,
        },
        attributes: ["id", "status", "type", "image"],
        include: [
          {
            model: CmsTranslate,

            where: {
              locale: locale,
            },

            attributes: ["id", "cms_id", "title", "link"],
          },
        ],
      });

      datas = await AstrologyProductTranslate.findAll({
        attributes: ["astrology_product_id"],
        group: ["astrology_product_id"],
        where:
          search != null
            ? {
              title: {
                [Op.like]: `%${search}%`,
              },
            }
            : {},
        include: [
          {
            model: AstrologyProduct,
            attributes: ["id", "image", "price"],
            include: [
              {
                model: AstrologyProductTranslate,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "title",
                  "slug",
                  "locale",
                  "description",
                ],
                where: { locale: locale },
              },
            ],
          },
        ],
        order:
          order == 0
            ? [[AstrologyProduct, "id", "DESC"]]
            : order == 1
              ? [[AstrologyProduct, "price", "DESC"]]
              : [[AstrologyProduct, "price", "ASC"]],
      });

      /*
      let astrologyQuery = "SELECT astrology_product_translates.id, astrology_product_translates.astrology_product_id, astrology_product_translates.title, astrology_products.price FROM astrology_product_translates join astrology_products ON astrology_products.id=astrology_product_translates.astrology_product_id";

      if(search != null) {
        astrologyQuery += " WHERE astrology_product_translates.title LIKE '%" + search + "%'";
      }

      astrologyQuery += " GROUP BY astrology_product_translates.astrology_product_id";

      astrologyQuery += order == 1 ? " ORDER BY astrology_products.price DESC" : order == 0 ?  " ORDER BY astrology_products.id DESC" : " ORDER BY astrology_products.price ASC";

      datas = await db.query(astrologyQuery, {
        type: QueryTypes.SELECT,
        //nest: true,
        
        model: AstrologyProduct,
        mapToModel: true,
      });
      */

      /*let astrologyIds = [];
      let astrologies = await AstrologyProductTranslate.findAll({
        attributes: ["astrology_product_id"],
        group : ['astrology_product_id'],
        where: search != null ? {
          title: {
            [Op.like] : `%${search}%` 
          },
        } : {},
      });

      astrologies.forEach(element => {
        astrologyIds.push(element['astrology_product_id']);
      });
      
      datas = await AstrologyProduct.findAll({
        where : {
          id : {
            [Op.in] : astrologyIds
          }
        },
        attributes: ["id", "image", "price", "type"],
        order: order == 0 ? [['id', 'DESC']] : order == 1 ? [['price','DESC']] : [['price', 'ASC']] ,
        include: [
          {
            model: AstrologyProductTranslate,
            attributes: ["id", "astrology_product_id", "title", "slug", "locale", "description"],
            where: {locale: locale},
          }
        ]
      })*/
    } catch (e: any) {
      return e;
    }
    return { datas, categories };
  }

  async astrologyProductDetails(slug: any, locale: any) {
    let data;
    let product;
    try {
      data = await AstrologyProductTranslate.findAll({
        attributes: ["id", "astrology_product_id"],
        where: {
          slug: slug,
        },
        include: [
          {
            model: AstrologyProduct,
            attributes: ["id", "image", "price", "type"],
            include: [
              {
                model: AstrologyProductTranslate,
                where: {
                  locale: locale,
                },
                attributes: [
                  "id",
                  "astrology_product_id",
                  "title",
                  "slug",
                  "locale",
                  "description",
                ],
              },
              {
                model: AstrologyProductVariation,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "price",
                  "carat",
                  "discounted_price",
                ],
              },
            ],
          },
        ],
      });

      const datas = JSON.parse(JSON.stringify(data));

      product = await AstrologyProduct.findAll({
        // limit: 3,
        where: {
          type: datas[0].AstrologyProduct.type,
          id: { [Op.ne]: datas[0].AstrologyProduct.id }
        },
        attributes: ["id", "image", "price", "type"],
        include: [
          {
            model: AstrologyProductTranslate,
            attributes: ["id", "astrology_product_id", "title", "locale", "slug"],
            where: {
              locale: locale,
            },
          },
        ],
      });
    } catch (e: any) {
      return e;
    }
    return { success: true, data, product };
  }

  async astrologyProductDetailSeo(slug: any) {
    let seo;

    try {
      seo = await AstrologyProductTranslate.findOne({
        attributes: ["id"],
        where: {
          slug: slug,
          locale: 'en'
        },
        include: [
          {
            model: AstrologyProduct,
            attributes: ["id", "meta_title", "meta_image", "meta_keywords", "meta_description"]
          }
        ]
      });
    } catch (e: any) {
      return e;
    }

    return { seo: seo };
  }
}
