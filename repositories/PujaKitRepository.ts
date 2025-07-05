import { Op, Sequelize } from "sequelize";
import { PujaKit, instance } from "../models/PujaKit";
import { PujaKitTranslate } from "../models/PujaKitTranslate";
import { Samagri } from "../models/Samagri";
import { SamagriPackage } from "../models/SamagriPackage";
import { SamagriPackageDetail } from "../models/SamagriPackageDetail";
import { SamagriPackageDetailTranslate } from "../models/SamagriPackageDetailTranslate";
import { SamagriPackageItem } from "../models/SamagriPackageItem";
import { SamagriPackageTranslate } from "../models/SamagriPackageTranslate";
import { SamagriTranslate } from "../models/SamagriTranslate";
import Slug from "slug";
import { Booking } from "../models/Booking";

class PujaKitRepository {
  async list() {
    try {
      const res: PujaKit[] = await PujaKit.findAll({
        attributes: ["id", "image", "is_show", "price","meta_image", "meta_description", "meta_title", "meta_keywords","order"],
        // order: [["id", "DESC"]],
        order: [['order','ASC']],
        include: [
          {
            model: PujaKitTranslate,
            attributes: ["id", "puja_kit_id", "title", "slug", "locale"],
            // order: [["id", "DESC"]],
            // order: [['order','ASC']]
          },
        ],
      });

      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  // POST
  async store(post: any) {
    const orderNo = await PujaKit.findOne(
      {
        attributes: ['order'],
        order: [['order','DESC']]
      }
    )

    try {
      let slug_en = Slug(post.title_en + " " + "en");
      const findSlug = await PujaKitTranslate.findOne({
        where: { slug: slug_en },
      });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_en = Slug(post.title_en + " " + UniqueString + " " + "en");
      }

      let slug_hi = Slug(post.title_en + " " + "hi");
      const findSlugHi = await PujaKitTranslate.findOne({
        where: { slug: slug_hi },
      });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_hi = Slug(post.title_hi + " " + UniqueString + " " + "hi");
      }
      const res = await PujaKit.create({
        image: post.Image,
        is_show: post.is_show,
        // price: post.Price,
        order: orderNo ?  orderNo.dataValues.order + 1 : 1,
        meta_description:post.meta_description,
        meta_keywords: post.meta_keywords,
        meta_title: post.meta_title,
        meta_image: post.meta_image
      });

      if (res) {
        await PujaKitTranslate.create({
          puja_kit_id: res.dataValues.id,
          title: post.title_en,
          slug: slug_en,
          locale: "en",
        });
        await PujaKitTranslate.create({
          puja_kit_id: res.dataValues.id,
          title: post.title_hi,
          slug: slug_hi,
          locale: "hi",
        });
      }
      
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
    //});
    // }
  }

  async edit(id: bigint) {
    try {
      const res: PujaKit[] = await PujaKit.findAll({
        attributes: ["id", "image", "is_show", "price","meta_image", "meta_description", "meta_title", "meta_keywords",'order'],
        include: [
          {
            model: PujaKitTranslate,
            attributes: ["id", "puja_kit_id", "title", "slug", "locale"],
            order: [["id", "DESC"]],
            where: {
              puja_kit_id: id,
            },
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
  async update(post: any) {
    const val = await PujaKit.findOne({ where: { id: post.id } });
    let orderId= val.dataValues.order

    let newOrderPujaKit = await PujaKit.findOne({where:{order: post.order}})
    try {
      let slug_en = Slug(post.title_en + " " + "en");
      const findSlug = await PujaKitTranslate.findOne({
        where: { slug: slug_en },
      });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_en = Slug(post.title_en + " " + UniqueString + " " + "en");
      }

      let slug_hi = Slug(post.title_en + " " + "hi");
      const findSlugHi = await PujaKitTranslate.findOne({
        where: { slug: slug_hi },
      });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_hi = Slug(post.title_hi + " " + UniqueString + " " + "hi");
      }
      const res = await PujaKit.findOne({ where: { id: post.id } });
      const data: any = {
        image: post.Image,
        is_show: post.is_show,
        // price: post.price,
        meta_description:post.meta_description,
        meta_keywords: post.meta_keywords,
        meta_title: post.meta_title,
        meta_image: post.meta_image
      };
      let list;
      if (res) {
        if(newOrderPujaKit){
          await PujaKit.update({order: post.order},{where:{ id: post.id }})
          await PujaKit.update({order: orderId},{where:{ id: newOrderPujaKit.dataValues.id }})  
          list = await PujaKit.update(
            {
              image: post.Image,
              is_show: post.is_show,
              price: post.Price,
              order: post.order,
              meta_description:post.meta_description,
              meta_keywords: post.meta_keywords,
              meta_title: post.meta_title,
              meta_image: post.meta_image
            },
            { where: { id: post.id } }
          );
          
        }else{

           list = await PujaKit.update(
            {
              image: post.Image,
              is_show: post.is_show,
              price: post.Price,
              order: post.order,
              meta_description:post.meta_description,
              meta_keywords: post.meta_keywords,
              meta_title: post.meta_title,
              meta_image: post.meta_image
            },
            { where: { id: post.id } }
          );
        }

        if (list) {
          const pujaKitTranslateEn = await PujaKitTranslate.update(
            {
              title: post.title_en,
              
            },
            { where: { puja_kit_id: post.id, locale: "en" } }
          );
          const pujaKitTranslateHi = await PujaKitTranslate.update(
            {
              title: post.title_hi,
             
            },
            { where: { puja_kit_id: post.id, locale: "hi" } }
          );

          if (!pujaKitTranslateEn) {
            await PujaKitTranslate.create({
              puja_kit_id: res.dataValues.id,
              title: post.title_en,
              slug: slug_en,
              locale: "en",
            });
          }
          if (!pujaKitTranslateHi) {
            await PujaKitTranslate.create({
              puja_kit_id: res.dataValues.id,
              title: post.title_hi,
              slug: slug_hi,
              locale: "hi",
            });
          }
        }
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
    // });
    // }
  }
  //DELETE
  async delete(id: bigint) {
    const val = await PujaKit.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const list = await PujaKit.destroy({ where: { id: id } });
        if(list){
          await SamagriPackage.destroy({ where: { puja_kit_id: id } })
          await Booking.destroy({ where: { puja_kit_id: id } });
        }
        return { body: list };
      } catch (e: any) {
        return { error: e };
      }
    }
  }


  async lists(locale: any, search: any, order: number) {
    let datas;
    try {
      datas = await PujaKitTranslate.findAll({
        attributes: ["puja_kit_id"],
        group: ["puja_kit_id"],
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
            model: PujaKit,
            attributes: ["id", "image", "price", 'order'],
            where: {
              is_show: 1,
            },
            include: [
              {
                model: PujaKitTranslate,
                attributes: ["id", "puja_kit_id", "title", "slug", "locale"],
                where: {
                  locale: locale,
                },
              },
            ],
          },
        ],
        order: 
          order == 1 ? [[PujaKit, "price", "DESC"]] : order == 2 ? [[PujaKit, "price", "ASC"]] : [[PujaKit,'order','ASC']]
      });
    } catch (e: any) {
      return e;
    }
    return { datas };
  }

  async pujaKitDetails(slug: any, locale: any) {
    let datas;
    try {
      datas = await PujaKitTranslate.findAll({
        where: {
          slug: slug,
        },
        attributes: ["id", "puja_kit_id", "slug"],
        include: [
          {
            model: PujaKit,
            attributes: ["id", "image", "price", "is_show"],
            where: {
              is_show: 1,
            },
            include: [
              {
                model: PujaKitTranslate,
                attributes: ["id", "puja_kit_id", "title", "slug", "locale"],
                where: {
                  locale: locale,
                },
              },
              {
                model: SamagriPackage,
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
                    where: {
                      locale: locale,
                    },
                  },
                  {
                    model: SamagriPackageDetail,
                    attributes: [
                      "id",
                      "samagri_package_id",
                      "price",
                      "is_required",
                      "item_selectable",
                    ],
                    include: [
                      {
                        model: SamagriPackageDetailTranslate,
                        attributes: [
                          "id",
                          "samagri_package_detail_id",
                          "title",
                          "locale",
                        ],
                        where: {
                          locale: locale,
                        },
                      },
                      {
                        model: SamagriPackageItem,
                        attributes: [
                          "id",
                          "samagri_package_detail_id",
                          "samagri_id",
                          "type",
                        ],
                        include: [
                          {
                            model: Samagri,
                            attributes: [
                              "id",
                              "image",
                              "quantity",
                              "type",
                              "is_sell",
                              "price",
                              "discounted_price",
                            ],
                            where: {
                              is_sell: 1,
                            },
                            include: [
                              {
                                model: SamagriTranslate,
                                attributes: [
                                  "id",
                                  "samagri_id",
                                  "title",
                                  "locale",
                                ],
                                where: {
                                  locale: locale,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (e: any) {
      return e;
    }
    return { datas };
  }

  async pujaKitSeo(slug: any) {
    let seo;
    try {
      seo = await PujaKitTranslate.findOne({
        where: {
          slug: slug,
        },
        attributes: ["id", "puja_kit_id", "slug"],
        include: [
          {
            model: PujaKit,
            attributes: ["id", "meta_title", "meta_image", "meta_keywords", "meta_description"]
          },
        ],
      });
    } catch (e: any) {
      return e;
    }
    return { seo };
  }
}

export { PujaKitRepository };
