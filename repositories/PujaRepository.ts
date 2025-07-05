import { Pujas, Puja } from "../models/Puja";
import { PujaTranslate } from "../models/PujaTranslate";
import { gallery, PujoGallery } from "../models/PujaGallery";
import { PujaLocation } from "../models/PujaLocation";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";
import { PujaCategory } from "../models/PujaCategory";
import { Op } from "sequelize";
import { Category } from "../models/Category";
import { CategoryTranslate } from "../models/CategoryTranslate";
import { Package } from "../models/Package";
import { PujaImage } from "../models/PujaImage";
import Slug from 'slug'
import { Language } from "../models/Language";
import { LanguageTranslate } from "../models/LanguageTranslate";
import { LanguageLocation } from "../models/LanguageLocation";
import { Booking } from "../models/Booking";
const date = require('date-and-time')

export class PujaRepository {
  async list() {
    try {
      const res: Puja[] = await Puja.findAll({
        attributes: ["id", "image", "on_site", "on_location", "order", "status", "meta_title", "meta_description", "meta_keywords",],
        // order: [["id", "DESC"]],
        order: [["order", "ASC"]],

        include: [
          {
            model: PujaTranslate,
            attributes: ["id", "puja_id", "title", "slug", "locale", "description", "samagri_description"],
            // order: [["id", "DESC"]],
            // order: [["order", "ASC"]],
          },
          {
            model: PujaLocation,
            include: [
              {
                model: Location,
                include: [
                  {
                    model: LocationTranslate,
                    where: {
                      locale: 'en'
                    }
                  }
                ]
              }
            ]
          }
        ]
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }


  async store(input: any) {

    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
 
    if (
      // !input.show_on_pooja_page ||
      !input.status
    ) {
      throw new Error("empty field");
    } else {
      // console.log(input)

      const orderNo = await Puja.findOne(
        {
          attributes: ['order'],
          order: [['order','DESC']]
        }
      )
    
      // let sampleFile;
      // let uploadPath;

      // if (!files || Object.keys(files).length === 0) {
      //   throw new Error("No files were uploaded.");
      // }
      // sampleFile = files.image;
      // var file_name = new Date().getTime() + "_" + sampleFile.name;
      // uploadPath = __dirname + "/upload/" + file_name;
      // const path = "/upload/" + file_name;
      // sampleFile.mv(uploadPath, async function (err) {
      //   if (err) throw new Error(err);

      try {
     
        const createPuja = await Puja.create({
          image: input.Image,
          on_site: input.on_site,
          on_location: input.on_location,
          show_on_pooja_page: 1,
          status: input.status,
          order: orderNo ?  orderNo.dataValues.order + 1 : 1,
          meta_description: input.meta_description,
          meta_keywords: input.meta_keywords,
          meta_title: input.meta_title,
          meta_image: input.meta_image,
          createdAt: currentFormattedDate,
          updatedAt: currentFormattedDate,
          deletedAt: null
        });

     
      
        if (createPuja) {
          // slug
          let slug_en = Slug(input.title_en + ' ' + 'en')

          const findSlug = await PujaTranslate.findOne({
            where: { slug: slug_en }
          })

          if (findSlug) {
            let UniqueString = (Math.random() + 1).toString(36).substring(7)
            slug_en = Slug(input.title_en + ' ' + UniqueString + ' ' + 'en')
          }
          await PujaTranslate.create({
            puja_id: createPuja.dataValues.id,
            title: input.title_en,
            locale: 'en',
            slug: slug_en,
            description: input.description_en,
            samagri_description: input.samagri_description_en,
            short_description: input.short_description_en,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          })

          // slug
          let slug_hi = Slug(input.title_hi + ' ' + 'hi')

          const findSlug_hi = await PujaTranslate.findOne({
            where: { slug: slug_hi }
          })

          if (findSlug_hi) {
            let UniqueString = (Math.random() + 1).toString(36).substring(7)
            slug_hi = Slug(input.title_hi + ' ' + UniqueString + ' ' + 'hi')
          }
          await PujaTranslate.create({
            puja_id: createPuja.dataValues.id,
            title: input.title_hi,
            locale: 'hi',
            slug: slug_hi,
            description: input.description_hi,
            samagri_description: input.samagri_description_hi,
            short_description: input.short_description_hi,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          })

          input.galleries.map(async (data) => {
            await gallery.create({
              puja_id: createPuja.dataValues.id,
              image: data,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null
            })

          })

          input.images.map(async (data) => {
            await PujaImage.create({
              puja_id: createPuja.dataValues.id,
              image: data,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null
            })
          });
          
          if(input.location_id.length > 0){
            for (var i = 0; i < input.location_id.length; i++) {
               await PujaLocation.create({
                puja_id: createPuja.dataValues.id,
                location_id: input.location_id[i].value,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
            }
          }

          if(input.category_id.length > 0){
            for (var i = 0; i < input.category_id.length; i++) {
               await PujaCategory.create({
                puja_id: createPuja.dataValues.id,
                category_id: input.category_id[i].value,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
            }
          }
        }
      } catch (e: any) {
        return { error: e.errors[0].message };
      }
      // });
    }
  }

  //edit

  async edit(id: bigint) {
    try {
      const res: Puja[] = await Puja.findAll({
        attributes: ["id", "image", "on_site", "on_location", "order", "status", "meta_title", "meta_description", "meta_keywords", "meta_image"],
        include: [
          {
            model: PujaTranslate,
            attributes: ["id", "puja_id", "title", "slug", "locale", "description", "short_description", "samagri_description"],
            order: [["id", "DESC"]],
            // where: {
            //   puja_id: id
            // }
          },
          {
            model: gallery,
            attributes: ["id", "image"],
            // where: {
            //   puja_id: id
            // }
          },
          {
            model: PujaImage,
            attributes: ["id", "image"],
            // where: {
            //   puja_id: id
            // }
          },
          {
            model: PujaLocation,
            attributes: ['location_id'],
            include: [
              {
                model: Location,
                include: [
                  {
                    model: LocationTranslate,
                    attributes: ["location_id", "title"]
                  }
                ]
              }
            ]
            // where: {
            //   puja_id: id
            // }
          },
          {
            model: PujaCategory,
            attributes: ['category_id'],
            include: [
            {
              model: Category,
              include: [
                {
                  model: CategoryTranslate,
                  attributes: ["category_id", "title"]
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
  //UPDATE

  async update(input: any) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    const val = await Puja.findOne({ where: { id: input.id } });
    if (!val) {
      throw new Error("Id not found");
    }

    if (
      // !input.show_on_pooja_page ||
      !input.status
    ) {
      throw new Error("empty field");
    } else {


      try {
        const res = await Puja.findOne({ where: { id: input.id } })
        let orderId= res.dataValues.order

        let newOrderPuja = await Puja.findOne({where:{order: input.order}})
    
        if (res) {
          if(newOrderPuja){
            await Puja.update({order: input.order},{where:{ id: input.id }})
            await Puja.update({order: orderId},{where:{ id: newOrderPuja.dataValues.id }})  
            await Puja.update({
              on_site: input.on_site,
              on_location: input.on_location,
              show_on_pooja_page: 1,
              // order: input.order,
              status: input.status,
              image: input.Image,
              meta_description: input.meta_description,
              meta_keywords: input.meta_keywords,
              meta_title: input.meta_title,
              meta_image: input.meta_image,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null,
            }, { where: { id: input.id } });
          }else{
            await Puja.update({
              on_site: input.on_site,
              on_location: input.on_location,
              show_on_pooja_page: 1,
              order: input.order,
              status: input.status,
              image: input.Image,
              meta_description: input.meta_description,
              meta_keywords: input.meta_keywords,
              meta_title: input.meta_title,
              meta_image: input.meta_image,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null,
            }, { where: { id: input.id } });
          }

          await PujaTranslate.update({
            // puja_id: createPuja.dataValues.id,
            title: input.title_en,
            locale: 'en',
            // slug: slug_en,
            description: input.description_en,
            short_description: input.short_description_en,
            samagri_description: input.samagri_description_en,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          }, { where: { puja_id: input.id, locale: 'en' } })

          await PujaTranslate.update({
            // puja_id: createPuja.dataValues.id,
            title: input.title_hi,
            locale: 'hi',
            // slug: slug_hi,
            description: input.description_hi,
            short_description: input.short_description_hi,
            samagri_description: input.samagri_description_hi,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          }, { where: { puja_id: input.id, locale: 'hi' } })

          // to add gallery
          input.galleriesAdd.map(async (data) => {
            await gallery.create({
              puja_id: input.id,
              image: data,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null
            })
          })
          input.imagesAdd.map(async (data) => {
            await PujaImage.create({
              puja_id: input.id,
              image: data,
              createdAt: currentFormattedDate,
              updatedAt: currentFormattedDate,
              deletedAt: null
            })
          })

          // to remove gallery
          input.galleriesRemove.map(async (data) => {
            await gallery.destroy({ where: { id: data } })
          })
          input.imagesRemove.map(async (data) => {
            await PujaImage.destroy({ where: { id: data } })
          })
          
          if (input.location_id.length > 0) {
            this.updateLocations(input.location_id, input.id);
          }

          if (input.category_id.length > 0) {
            this.updateCategorys(input.category_id, input.id);
          }
        }

      } catch (e: any) {
        return { error: e.errors[0].message };
      }
      // });

    }
  }

  async updateLocations(newLocations, pujaId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldLocations = await PujaLocation.findAll({where:{puja_id: pujaId}, attributes:['location_id']});

    
    let oldLocationId = [];

    if (oldLocations != null) {
      for (let i in oldLocations) {
        oldLocationId.push(oldLocations[i].dataValues.location_id);
      }
    }

    if (oldLocationId.length > 0 && newLocations.length > 0) {
      let difference = oldLocationId.filter(j => !newLocations.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await PujaLocation.destroy({ where: { puja_id: pujaId, location_id: difference[k] } });
        }
      }
    }
    if (newLocations.length > 0) {
      for (var i=0; i < newLocations.length ; i++ ) {
        // console.log(newLocations[i].value)
        let pujaLocation = await PujaLocation.findOne({ where: { puja_id: pujaId, location_id: newLocations[i].value} });

        if (!pujaLocation) {
          await PujaLocation.create({
            puja_id: pujaId,
            location_id: newLocations[i].value,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }

  async updateCategorys(newCategorys, pujaId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldCategorys = await PujaCategory.findAll({where:{puja_id: pujaId}, attributes:['category_id']});

    
    let oldCategoryId = [];

    if (oldCategorys != null) {
      for (let i in oldCategorys) {
        oldCategoryId.push(oldCategorys[i].dataValues.category_id);
      }
    }

    if (oldCategoryId.length > 0 && newCategorys.length > 0) {
      let difference = oldCategoryId.filter(j => !newCategorys.includes(j));
      if (difference.length > 0) {
        for (let k in difference) {
          await PujaCategory.destroy({ where: { puja_id: pujaId, category_id: difference[k] } });
        }
      }
    }
    if (newCategorys.length > 0) {
      for (var i=0; i < newCategorys.length ; i++ ) {
        // console.log(newCategorys[i].value)
        let pujaCategory = await PujaCategory.findOne({ where: { puja_id: pujaId, category_id: newCategorys[i].value} });

        if (!pujaCategory) {
          await PujaCategory.create({
            puja_id: pujaId,
            category_id: newCategorys[i].value,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });
        }
      }
    }
  }

  async delete(id: bigint) {
    const delData = await Puja.findAll({ where: { id: id } });
    const del = await Puja.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const list = await Puja.destroy({ where: { id: id } });
        if(list){
          await Package.destroy({ where: { puja_id: id } })
          await Booking.destroy({ where: { puja_id: id } })
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

  // frontend puja api, Route:- api/web/online-booking-puja/:locale(tinyint)/:slug(when fetching puja homepage, it should be 0)
  async pujaFrontendList(locale: string, slug: string) {
    if (locale && slug == "0") {
      const pujaFilteredData = await Puja.findAll({
        where: {
          show_on_pooja_page: 1,
        },
        attributes: ["id", "image"],
        include: [
          {
            model: PujaTranslate,
            attributes: ["id", "title", "slug"],
            where: { locale: locale }
          },
        ],
      });
      const pujaData = JSON.parse(JSON.stringify(pujaFilteredData));
      return { pujaData: pujaData };
    } else if (locale && slug != "0") {
      // from Puja Translate and puja Table
      const pujaFilteredData = await Puja.findAll({
        where: {
          show_on_pooja_page: 1
        },
        attributes: ["id", "image"],
        include: [
          {
            model: PujaTranslate,
            attributes: ["id", "title", "description", "samagri_description"],
            where: { locale: locale, slug: slug }
          },
          {
            model: gallery,
            attributes: ["id", "image"]
          },
        ],
      });
      const pujaData = JSON.parse(JSON.stringify(pujaFilteredData));
      return { Pujadata: pujaData };
    } else {
      throw new Error("Inavlid Parameter!");
    }
  }

  async lists(locale: any, location: any, category: any, search: any) {
    let datas;
    let categories;
    let locations;
    try {
      categories = await Category.findAll({
        attributes: ["id"],
        include: [
          {
            model: CategoryTranslate,
            attributes: ["category_id", "title"],
            where: {
              locale: locale
            }
          }
        ]
      })
      locations = await Location.findAll({
        attributes: ["id", "image"],
        where: {
          status: 1
        },
        include: [
          {
            model: LocationTranslate,
            attributes: ["location_id", "title"],
            where: {
              locale: locale
            }
          }
        ]
      })
      datas = await PujaTranslate.findAll({
        attributes: ["puja_id"],
        group: ["puja_id"],
        where: search != null ? {
          title: {
            [Op.like]: `%${search}%`,
          },
        } : {},
        include: [
          {
            model: Puja,
            attributes: ["id", "image", "on_site", "on_location", "show_on_pooja_page", "order", "status"],
            where: {
              show_on_pooja_page: 1,
              status: 1
            },
            include: [
              {
                model: PujaTranslate,
                attributes: ["id", "puja_id", "title", "slug", "locale", "short_description", "description", "samagri_description"],
                where: {
                  locale: locale,
                },
              },
              {
                model: PujaLocation,
                attributes: ["id", "puja_id", "location_id"],
                where: location > 0 ? {
                  location_id: location
                } : {},
              },
              {
                model: PujaCategory,
                attributes: ["id", "puja_id", "category_id"],
                where: category > 0 ? {
                  category_id: category,
                } : {},
              },
            ],
          },
        ],
        order: [[Puja,'order','ASC']],
      });
    } catch (e: any) {
      return e;
    }
    return { datas, categories, locations };
  }

  async pujaDetails(slug: any, locale: any) {
    let datas;
    try {
      datas = await PujaTranslate.findAll({
        attributes: ["id", "puja_id"],
        // group: ["puja_id"],
        where: {
          slug: slug,

        },
        include: [
          {
            model: Puja,
            attributes: ["id", "image", "on_site", "on_location", "show_on_pooja_page", "order", "status"],
            where: {
              status: 1
            },
            include: [
              {
                model: PujaTranslate,
                where: {
                  locale: locale
                },
                attributes: ["title", "short_description", "description", "samagri_description"]
              },
              {
                model: gallery,
                attributes: ["id", "image"]
              },
              {
                model: PujaImage,
                attributes: ['id', 'image']
              },
              {
                model: PujaLocation,
                attributes: ["id", "puja_id", "location_id"],
                include: [
                  {
                    model: Location,
                    attributes: ["id"],
                    where: {
                      status: 1
                    },
                    include: [
                      {
                        model: LocationTranslate,
                        attributes: ["location_id", "title"],
                        where: {
                          locale: locale
                        }
                      },
                      {
                        model: LanguageLocation,
                        include: [
                          {
                            model: Language,
                            include: [
                              {
                                model: LanguageTranslate,
                                where: {locale: locale}
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              // {
              //   model: PujaLanguage,
              //   attributes: ["id", "puja_id", "language_id"],
              //   include: [
              //     {
              //       model: Language,
              //       attributes: ["id"],
              //       where: {
              //         status: 1
              //       },
              //       include: [
              //         {
              //           model: LanguageTranslate,
              //           attributes: ["language_id", "title"],
              //           where: {
              //             locale: locale
              //           }
              //         }
              //       ]
              //     }
              //   ]
              // }
            ],
          }
        ]
      })

    } catch (e: any) {
      return e;
    }
    return { datas };
  }

  async pujaSeo(slug: any) {
    let seo;
    const pujaSlug = slug.split(",")[0]
    try {
      seo = await PujaTranslate.findOne({
        attributes: ["id", "puja_id"],
        where: {
          slug: pujaSlug,
          locale: 'en'
        },
        include: [
          {
            model: Puja,
            attributes: ["id", "meta_title", "meta_image", "meta_keywords", "meta_description"]
          }
        ]
      })
    } catch (e: any) {
      return e;
    }
    return { seo };
  }
}
