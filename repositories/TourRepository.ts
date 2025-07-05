import { Op } from "sequelize";
import { Booking } from "../models/Booking";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";
import { PujaLocation } from "../models/PujaLocation";
import { Tour, TourMembers } from "../models/Tour";
import { TourDetail } from "../models/TourDetail";
import { TourDetailItem } from "../models/TourDetailItems";
import { TourDetailItemTranslate } from "../models/TourDetailItemTranslate";
import { TourDetailTranslate } from "../models/TourDetailTranslate";
import { TourTranslate } from "../models/TourTranslate";
import Slug from "slug";

const date = require('date-and-time')

export class TourRepository {
  async create() {
    try {
      const res: Tour[] = await Tour.findAll({
        attributes: ['id', 'location_id', 'thumb_image', 'image', 'address', 'visit_date', 'price', 'discounted_price', 'status', 'meta_title', 'meta_description', 'meta_keywords',],
        order: [["id", "DESC"]],
        include: [
          {
            model: TourTranslate,
            attributes: ['id', 'tour_id', 'title', 'slug', 'description', 'locale'],
          }
        ]
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async edit(id: bigint) {

    try {
      const res = await Tour.findOne({
        attributes: ["id", "location_id", "thumb_image", "address", "image", "visit_date", "price", "discounted_price", "status", "meta_title", "meta_description", "meta_keywords", "meta_image"],
        include: [
          {
            model: TourTranslate,
            attributes: ["id", "tour_id", "title", "slug", "locale", "description"],
            order: [["id", "DESC"]],
            where: {
              tour_id: id

            }
          },
          {
            model: TourDetail,
            include: [
              {
                model: TourDetailTranslate,

              },
              {
                model: TourDetailItem,
                include: [
                  {
                    model: TourDetailItemTranslate,

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
  async store(post: any) {
    // if (
    //   !post.status ||
    //   !post.location_id ||
    //   !post.address ||
    //   !post.visit_date ||
    //   !post.price ||
    //   !post.discounted_price
    // ) {
    //   throw new Error("empty field");
    // } else {
    //   let sampleFile;
    //   let AnotherFile;
    //   let uploadPath;
    //   let uploadFilePath;
    //   if (!files || Object.keys(files).length === 0) {
    //     throw new Error("No file or image were uploaded.");
    //   }
    //   AnotherFile = files.thumb_image;
    //   sampleFile = files.image;

    //   var file_name = new Date().getTime() + "_" + sampleFile.name;
    //   var filesName = new Date().getTime() + "_" + AnotherFile.name;

    //   uploadPath = __dirname + "/upload/" + file_name;
    //   uploadFilePath = __dirname + "/upload/" + filesName;
    //   const path = "/upload/" + file_name;
    //   const filePath = "/upload/" + filesName;

    //   sampleFile.mv(uploadPath, async function (err) {
    //     if (err) throw new Error(err);
    //     AnotherFile.mv(uploadFilePath, async function (err) {
    //       if (err) throw new Error(err);

    try {
      let slug_en = Slug(post.title_en + " " + "en");
      const findSlug = await TourTranslate.findOne({
        where: { slug: slug_en },
      });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_en = Slug(post.title_en + " " + UniqueString + " " + "en");
      }

      let slug_hi = Slug(post.title_en + " " + "hi");
      const findSlugHi = await TourTranslate.findOne({
        where: { slug: slug_hi },
      });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_hi = Slug(post.title_hi + " " + UniqueString + " " + "hi");
      }

      const list = await Tour.create({
        // thumb_image: post.thumb_image,
        image: post.Image,
        location_id: post.location_id,
        address: post.address,
        visit_date: post.visit_date,
        price: post.Price,
        status: post.status,
        // meta_description: post.meta_description,
        // meta_keywords: post.meta_keywords,
        // meta_title: post.meta_title,
        // meta_image: post.meta_image,
      });

      if (list) {
        await TourTranslate.create({
          tour_id: list.dataValues.id,
          title: post.title_en,
          slug: slug_en,
          description: post.description_en,
          locale: 'en'
        })
        await TourTranslate.create({
          tour_id: list.dataValues.id,
          title: post.title_hi,
          slug: slug_hi,
          description: post.description_hi,
          locale: 'hi'
        })
        let tourDetail = await TourDetail.create({
          tour_id: list.dataValues.id,
          price: post.Price
        })
        post.details.map(async (data) => {

          await TourDetailTranslate.create({
            tour_detail_id: tourDetail.dataValues.id,
            title: data.title_en,
            locale: 'en'
          })
          await TourDetailTranslate.create({
            tour_detail_id: tourDetail.dataValues.id,
            title: data.title_hi,
            locale: 'hi'
          })
          data.items.map(async (item) => {

            let tourDetailItem = await TourDetailItem.create({
              tour_detail_id: tourDetail.dataValues.id,
              price: item.price,
              quantity: item.quantity
            })

            await TourDetailItemTranslate.create({
              tour_detail_item_id: tourDetailItem.dataValues.id,
              title: item.title_en,
              locale: 'en'
            })
            await TourDetailItemTranslate.create({
              tour_detail_item_id: tourDetailItem.dataValues.id,
              title: item.title_hi,
              locale: 'hi'
            })
          })
        })
      }

    } catch (e: any) {
      return { error: e.errors[0].message };
    }
    //   });
    // });

    return "Documents Updated";
    // }
  }


  async update(post: any) {
    const val = await Tour.findOne({ where: { id: post.id } });
    // if (!val) {
    //   throw new Error("Id not found");
    // }
    // if (
    //   !post.status ||
    //   !post.location_id ||
    //   !post.address ||
    //   !post.visit_date ||
    //   !post.price ||
    //   !post.discounted_price
    // ) {
    //   throw new Error("empty field");
    // }
    // else {
    //   let sampleFile;
    //   let AnotherFile;
    //   let uploadPath;
    //   let uploadFilePath;
    //   if (!files || Object.keys(files).length === 0) {
    //     throw new Error("No file or image were uploaded.");
    //   }
    //   AnotherFile = files.thumb_image;
    //   sampleFile = files.image;

    //   var file_name = new Date().getTime() + "_" + sampleFile.name;
    //   var filesName = new Date().getTime() + "_" + AnotherFile.name;

    //   uploadPath = __dirname + "/upload/" + file_name;
    //   uploadFilePath = __dirname + "/upload/" + filesName;
    //   const path = "/upload/" + file_name;
    //   const filePath = "/upload/" + filesName;

    //   sampleFile.mv(uploadPath, async function (err) {
    //     if (err) throw new Error(err);
    //     AnotherFile.mv(uploadFilePath, async function (err) {
    //       if (err) throw new Error(err);

    try {
      let slug_en = Slug(post.title_en + " " + "en");
      const findSlug = await TourTranslate.findOne({
        where: { slug: slug_en },
      });

      if (findSlug) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_en = Slug(post.title_en + " " + UniqueString + " " + "en");
      }

      let slug_hi = Slug(post.title_en + " " + "hi");
      const findSlugHi = await TourTranslate.findOne({
        where: { slug: slug_hi },
      });

      if (findSlugHi) {
        let UniqueString = Math.random().toPrecision(3) + 1;
        slug_hi = Slug(post.title_hi + " " + UniqueString + " " + "hi");
      }

      const res = await Tour.findOne({ where: { id: post.id } })
      if (res) {
        const list = await Tour.update({
          thumb_image: post.thumb_image,
          image: post.image,
          location_id: post.location_id,
          address: post.address,
          visit_date: post.visit_date,
          price: post.Price,
          discounted_price: post.discounted_price,
          status: post.status,
          meta_description: post.meta_description,
          meta_keywords: post.meta_keywords,
          meta_title: post.meta_title,
          meta_image: post.meta_image,
        }, { where: { id: post.id } });

        if (list) {
          const tourEn = await TourTranslate.update({title: post.title_en, description: post.description_en}, { where: { tour_id: post.id, locale: 'en' } })
          const tourHi = await TourTranslate.update({title: post.title_hi,description: post.description_hi}, { where: { tour_id: post.id, locale: 'hi' } })

          if (!tourEn) {
            await TourTranslate.create({
              tour_id: res.dataValues.id,
              title: post.title_en,
              slug: slug_en,
              description: post.description_en,
              locale: 'en'
            })
          }
          if (!tourHi) {
            await TourTranslate.create({
              tour_id: res.dataValues.id,
              title: post.title_hi,
              slug: slug_hi,
              description: post.description_hi,
              locale: 'hi'
            })
          }
          let tourDetailEn, tourDetailHi;
          let tourDetail = await TourDetail.findOne({ where: { tour_id: post.id } })
          let tourDetailItem = await TourDetailItem.findOne({ where: { tour_detail_id: tourDetail.dataValues.id } })

          let details = post.details;

          if (details.length > 0) {
            let oldTourDetails = await TourDetail.findAll({where: { tour_id: res.dataValues.id }, attributes: ['id']});
            this.updateTourDetails(oldTourDetails, details, res.dataValues.id);
          }
          /*
          post.details.map(async (data) => {

            tourDetailEn = await TourDetailTranslate.update({
              title: data.title_en,

            }, { where: { tour_detail_id: tourDetail.dataValues.id, locale: 'en' } })
            tourDetailHi = await TourDetailTranslate.update({
              title: data.title_hi,

            }, { where: { tour_detail_id: tourDetail.dataValues.id, locale: 'hi' } })

            if (!tourDetailEn) {
              await TourDetailTranslate.create({
                tour_detail_id: tourDetail.dataValues.id,
                title: data.title_en,
                locale: 'en'
              })
            }

            if (!tourDetailHi) {
              await TourDetailTranslate.create({
                tour_detail_id: tourDetail.dataValues.id,
                title: data.title_hi,
                locale: 'hi'
              })
            }

            
            data.items.map(async (item) => {

              const updateItem = await TourDetailItem.update({
                price: item.price,
                quantity: item.quantity
              }, { where: { tour_detail_id: tourDetail.dataValues.id } })

              const tourDetailItemEn = await TourDetailItemTranslate.update({
                title: item.title_en,
              }, { where: { tour_detail_item_id: tourDetailItem.dataValues.id, locale: 'en' } })

              const tourDetailItemHi = await TourDetailItemTranslate.update({
                title: item.title_hi,
              }, { where: { tour_detail_item_id: tourDetailItem.dataValues.id, locale: 'hi' } })
              let newtourDetailItem;
              if (!updateItem) {
                newtourDetailItem = await TourDetailItem.create({
                  tour_detail_id: tourDetail.dataValues.id,
                  price: item.price,
                  quantity: item.quantity
                })
                console.log(newtourDetailItem)
              }

              if (!tourDetailItemEn) {
                await TourDetailItemTranslate.create({
                  tour_detail_item_id: newtourDetailItem.dataValues.id,
                  title: item.title_en,
                  locale: 'en'
                })
              }

              if (!tourDetailItemHi) {
                await TourDetailItemTranslate.create({
                  tour_detail_item_id: newtourDetailItem.dataValues.id,
                  title: item.title_hi,
                  locale: 'hi'
                })
              }
            })
          })*/
        }
      }

    } catch (e: any) {
      return { error: e.errors[0].message };
    }
    // });
    // });

    return "Documents Updated";
    // }
  }

  async updateTourDetails(oldDetails, newDetails, tourId) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    let oldDetailId = [];
    let newDetailId = [];
    let total = 0;
    
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
          await TourDetail.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await TourDetail.destroy({ where: { tour_id: tourId } });
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        let minPrice = 0;
        for (let j in newDetails[i].items) {
          if(newDetails[i].is_required < 3) {
            total = total + parseFloat(newDetails[i].items[j].price);
          }

          minPrice = minPrice + parseFloat(newDetails[i].items[j].price);
        }

        if (!isNaN(newDetails[i].id)) {
          await TourDetail.update({
              price: minPrice,
            },
            {where: { id: newDetails[i].id }
          });

          TourDetailTranslate.update({
            title: newDetails[i].title_en,
            updatedAt: currentFormattedDate
          }, { where: { tour_detail_id: newDetails[i].id, locale: 'en' } });

          TourDetailTranslate.update({
            title: newDetails[i].title_hi,
            updatedAt: currentFormattedDate
          }, { where: { tour_detail_id: newDetails[i].id, locale: 'hi' } });

          let oldTourDetailItems = await TourDetailItem.findAll({ where: { tour_detail_id: newDetails[i].id }, attributes: ['id'] });
          this.updateTourDetailItems(oldTourDetailItems, newDetails[i].items, newDetails[i].id);
        }
        else {
          let tourDetail = await TourDetail.create({
            tour_id: tourId,
            price: minPrice,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          TourDetailTranslate.create({
            tour_detail_id: tourDetail.dataValues.id,
            title: newDetails[i].title_en,
            locale: 'en',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          TourDetailTranslate.create({
            tour_detail_id: tourDetail.dataValues.id,
            title: newDetails[i].title_hi,
            locale: 'hi',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          if (tourDetail) {
            for (let j in newDetails[i].items) {
              let tourDetailItem = await TourDetailItem.create({
                tour_detail_id: tourDetail.dataValues.id,
                price: newDetails[i].items[j].price,
                quantity: newDetails[i].items[j].quantity,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              TourDetailItemTranslate.create({
                tour_detail_item_id: tourDetailItem.dataValues.id,
                title: newDetails[i].items[j].title_hi,
                locale: 'en',
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              TourDetailItemTranslate.create({
                tour_detail_item_id: tourDetailItem.dataValues.id,
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
    }
  }

  async updateTourDetailItems(oldDetails, newDetails, tourDetailId) {
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
          await TourDetailItem.destroy({ where: { id: difference } });
        }
      }
    }
    else if (oldDetailId.length > 0) {
      await TourDetailItem.destroy({ where: { tour_detail_id: tourDetailId } });
    }

    if (newDetails != null) {
      for (let i in newDetails) {
        if (!isNaN(newDetails[i].id)) {
          TourDetailItem.update({quantity: newDetails[i].quantity, price: newDetails[i].price,}, {where: { id: newDetails[i].id }});

          TourDetailItemTranslate.create({
            tour_detail_item_id: newDetails[i].id,
            title: newDetails[i].title_en,
            locale: 'en',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          TourDetailItemTranslate.create({
            tour_detail_item_id: newDetails[i].id,
            title: newDetails[i].title_hi,
            locale: 'hi',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });          
        }
        else {
          let tourDetailItem = await TourDetailItem.create({
            tour_detail_id: tourDetailId,
            price:newDetails[i].price,
            quantity:newDetails[i].quantity,
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          TourDetailItemTranslate.create({
            tour_detail_item_id: tourDetailItem.dataValues.id,
            title: newDetails[i].title_en,
            locale: 'en',
            createdAt: currentFormattedDate,
            updatedAt: currentFormattedDate,
            deletedAt: null
          });

          TourDetailItemTranslate.create({
            tour_detail_item_id: tourDetailItem.dataValues.id,
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
    const delData = await Tour.findAll({ where: { id: id } });
    const del = await Tour.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const list = await Tour.destroy({ where: { id: id } });
        if(list){
          await Booking.destroy({ where: {  tour_id: id } });
        }
        return { body: list };
      } catch (e: any) {
        return e;
      }
    } else {
      if (del.length != 0) {
        throw new Error("details got deleted earlier");
      } else {
        throw new Error("details don't exist. please enter a valid id!");
      }
    }
  }

  async lists(locale: any, search: any, locationId: any) {
    let datas;

    let locations = await Location.findAll({
      attributes: ["id", "image"],
      where: {
        status: 1
      },
      include: [
        {
          model: LocationTranslate,
          where: {
            locale: locale
          },
          attributes: ["id", "location_id", "title"]
        }
      ]
    });

    let location = await Location.findOne({
      attributes: ["id", "image"],
      where: {
        status: 1,
        id: locationId
      },
      include: [
        {
          model: LocationTranslate,
          where: {
            locale: locale
          },
          attributes: ["id", "location_id", "title"]
        }
      ]
    });

    try {
      if (locationId == null) {
        datas = await LocationTranslate.findAll({
          attributes: ["location_id"],
          group: ["location_id"],

          include: [
            {
              model: Location,
              attributes: ["id", "image"],
              where: {
                status: 1
              },
              include: [
                {
                  model: LocationTranslate,
                  where: {
                    locale: locale
                  },
                  attributes: ["id", "location_id", "title"]
                },
                {
                  model: Tour,
                  limit: 3,
                  attributes: ["id", "location_id", "thumb_image", "image", "address", "visit_date", "price", "discounted_price", "status"],
                  where: {
                    status: 1
                  },
                  include: [
                    {
                      model: TourTranslate,
                      attributes: ["id", "tour_id", "title", "slug", "description", "locale"],
                      where: search != null ? {
                        title: { [Op.like]: `%${search}%` },
                        locale: locale
                      } :
                        { locale: locale },


                    }
                  ]
                }
              ]
            }
          ]
        });
      }
      else {
        datas = await TourTranslate.findAll({
          attributes: ["id", "tour_id"],
          group: ["tour_id"],
          where: search != null ? {
            title: { [Op.like]: `%${search}%` },
          } :
            {},
          include: [
            {
              model: Tour,
              attributes: ["id", "location_id", "thumb_image", "image", "address", "visit_date", "price", "discounted_price", "status"],
              where: {
                status: 1,
                location_id: locationId
              },
              include: [
                {
                  model: TourTranslate,
                  where: {
                    locale: locale
                  },
                  attributes: ["id", "tour_id", "title", "slug", "description", "locale"]
                },
                {
                  model: Location,
                  limit: null,
                  attributes: ["id", "image"],
                  where: {
                    status: 1
                  },
                  include: [
                    {
                      model: LocationTranslate,
                      attributes: ["id", "location_id", "title"],
                      where: {
                        locale: locale
                      }

                    }
                  ]
                }
              ]
            }
          ]
        });
      }
    } catch (e: any) {
      return e;
    }
    return { datas: datas, locations: locations, location };
  }

  async tourDetails(slug: any, locale: any, search: any) {
    let datas;
    try {
      datas = await TourTranslate.findAll({
        attributes: ["id"],
        where:
          search != null ? {
            title: { [Op.like]: `%${search}%` },

            slug: slug
          } :
            { slug: slug },

        include: [
          {
            model: Tour,
            attributes: ["id", "location_id", "thumb_image", "image", "address", "visit_date", "price", "discounted_price", "status"],
            where: {
              status: 1
            },
            include: [
              {
                model: TourTranslate,
                attributes: ["id", "tour_id", "title", "slug", "description", "locale"],
                where: {
                  locale: locale
                }
              },
              {
                model: TourDetail,
                attributes: ["id", "tour_id", "is_required", "item_selectable", "price"],
                include: [
                  {
                    model: TourDetailTranslate,
                    attributes: ["id", "tour_detail_id", "title", "locale"],
                    where: {
                      locale: locale
                    }
                  },
                  {
                    model: TourDetailItem,
                    attributes: ["id", "tour_detail_id", "quantity", "price"],
                    include: [
                      {
                        model: TourDetailItemTranslate,
                        attributes: ["id", "tour_detail_item_id", "title", "locale"],
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
      });

    } catch (e: any) {
      return e;
    }
    return { datas };
  }

  async tourDetailSeo(slug: any) {
    let seo;
    try {
      seo = await TourTranslate.findOne({
        attributes: ["id"],
        where: { slug: slug, locale: 'en' },
        include: [
          {
            model: Tour,
            attributes: ["id", "meta_title", "meta_image", "meta_keywords", "meta_description"]
          }
        ]
      });
    } catch (e: any) {
      return e;
    }
    return { seo };
  }
}
