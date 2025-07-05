import { AstrologyProduct } from "../models/AstrologyProduct";
import { AstrologyProductVariation } from "../models/AstrologyProductVariation";
import { BookingMembers, Booking } from "../models/Booking"
import { BookingKundali } from "../models/BookingKundli";
import { BookingMatch } from "../models/BookingMatch";
import { BookingSession } from "../models/BookingSession";
import { Package } from "../models/Package";
import { Puja } from "../models/Puja";
import { PujaKit } from "../models/PujaKit";
import { SamagriPackage } from "../models/SamagriPackage";
import { Tour } from "../models/Tour";
import { User } from "../models/User";
import { UserAddress } from "../models/UserAddress";
import jwt from 'jsonwebtoken'
import { BookingPackageDetail } from "../models/BookingPackageDetail";
import { PackageDetail } from "../models/PackageDetail";
import { PackageDetailTranslate } from "../models/PackageDetailTranslate";
import { PackageDetailItem } from "../models/PackageDetailItem";
import { PackageDetailItemTranslate } from "../models/PackageDetailItemTranslate";
import { BookingSamagriPackageDetail } from "../models/BookingSamagriPackageDetail";
import { BookingSamagriPackageDetailItem } from "../models/BookingSamagriPackageDetailItem";
import { SamagriPackageDetail } from "../models/SamagriPackageDetail";
import { SamagriPackageDetailTranslate } from "../models/SamagriPackageDetailTranslate";
import { Samagri } from "../models/Samagri";
import { SamagriTranslate } from "../models/SamagriTranslate";
import { Model, Op } from "sequelize";
import { SamagriPackageItem } from "../models/SamagriPackageItem";
import { PujaTranslate } from "../models/PujaTranslate";
import { AstrologyProductTranslate } from "../models/AstrologyProductTranslate";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";
import { PujaKitTranslate } from "../models/PujaKitTranslate";
import { Setting } from "../models/Setting";
import { TourDetail } from "../models/TourDetail";
import { BookingTourDetail } from "../models/BookingTourDetail";
import { TourDetailItem } from "../models/TourDetailItems";
import { BookingTourDetailItem } from "../models/BookingTourDetailItem";
import { PackageTranslate } from "../models/PackageTranslate";
import { SamagriPackageTranslate } from "../models/SamagriPackageTranslate";
import { TourDetailTranslate } from "../models/TourDetailTranslate";
import { TourDetailItemTranslate } from "../models/TourDetailItemTranslate";
import { TourTranslate } from "../models/TourTranslate";
import { BookingPackageDetailItem } from "../models/BookingPackageDetailItem";
import { Cms, cms } from "../models/Cms";
import { Pandit } from "../models/Pandit";
import { PanditTranslate } from "../models/PanditTranslate";

const date = require('date-and-time')

class BookingRepository {
  // POST
  async store(post: BookingMembers) {

    const FindUser = await User.findAll({ where: { id: post.user_id } })
    const FindUserAddress = await UserAddress.findAll({ where: { id: post.user_address_id } })
    const FindPackage = await Package.findAll({ where: { id: post.package_id } })
    const FindPuja = await Puja.findAll({ where: { id: post.puja_id } })
    const FindPujaKit = await PujaKit.findAll({ where: { id: post.puja_kit_id } })
    const FindAstroProduct = await AstrologyProduct.findAll({ where: { id: post.astrology_product_id } })
    const FindProductVariation = await AstrologyProductVariation.findAll({ where: { id: post.astrology_product_variation_id } })
    const FindTour = await Tour.findAll({ where: { id: post.tour_id } })
    const FindSamagriPackage = await SamagriPackage.findAll({ where: { id: post.samagri_package_id } })

    if (!post.user_id || !post.puja_id || !post.package_id || !post.puja_kit_id || !post.total || !post.shipping_amount || !post.date || !post.time || !post.astrology_product_id || !post.astrology_product_variation_id || !post.tour_id || !post.samagri_package_id || !post.user_address_id)
      throw new Error('Must include all fields');
    if (!FindUser || !FindUserAddress || !FindPackage || !FindPuja || !FindPujaKit || !FindAstroProduct || !FindProductVariation || !FindTour || !FindSamagriPackage) {
      throw new Error("no such id found");

    }
    else {
      try {
        const res = await Booking.create(post);
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  //GET
  async get() {
    try {
      const res = await Booking.findAll();
      return { body: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  //UPDATE
  async update(post: BookingMembers, id: any) {

    const FindUser = await User.findAll({ where: { id: post.user_id } })
    const FindUserAddress = await UserAddress.findAll({ where: { id: post.user_address_id } })
    const FindPackage = await Package.findAll({ where: { id: post.package_id } })
    const FindPuja = await Puja.findAll({ where: { id: post.puja_id } })
    const FindPujaKit = await PujaKit.findAll({ where: { id: post.puja_kit_id } })
    const FindAstroProduct = await AstrologyProduct.findAll({ where: { id: post.astrology_product_id } })
    const FindProductVariation = await AstrologyProductVariation.findAll({ where: { id: post.astrology_product_variation_id } })
    const FindTour = await Tour.findAll({ where: { id: post.tour_id } })
    const FindSamagriPackage = await SamagriPackage.findAll({ where: { id: post.samagri_package_id } })

    const NoChange = await Booking.findAll({
      where: {
        user_id: post.user_id,
        user_address_id: post.user_address_id,
        puja_id: post.puja_id,
        package_id: post.package_id,
        puja_kit_id: post.puja_kit_id,
        total: post.total,
        time: post.time,
        date: post.date,
        shipping_amount: post.shipping_amount,
        astrology_product_id: post.astrology_product_id,
        astrology_product_variation_id: post.astrology_product_variation_id,
        samagri_package_id: post.samagri_package_id,
        tour_id: post.tour_id
      }
    })

    const val = await Booking.findOne(id);
    if (!val)
      throw new Error('Invalid Id');
    if (!post.user_id || !post.puja_id || !post.package_id || !post.puja_kit_id || !post.total || !post.shipping_amount || !post.date || !post.time || !post.astrology_product_id || !post.astrology_product_variation_id || !post.tour_id || !post.samagri_package_id || !post.user_address_id)
      throw new Error('Must include all fields');

    if (!FindUser || !FindUserAddress || !FindPackage || !FindPuja || !FindPujaKit || !FindAstroProduct || !FindProductVariation || !FindTour || !FindSamagriPackage) {
      throw new Error("no such id found");

    }
    if (NoChange.length != 0) {
      throw new Error("no changes have been commited!");
    }
    else {
      try {
        const res = await Booking.update(post, id);
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }
  //DELETE
  async delete(id: bigint) {
    const val = await Booking.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await Booking.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }

    }
  }
  async list() {
    //to be implemented
  }
  async edit() {
    //to be implemented
  }
  async create() {
    //to be implemented
  }

  async cartDetails(req) {
    let user = null;
    let total: any = 0;
    let noOfItems: number = 0;
    const bookingToken = req.query.booking_token ? req.query.booking_token : req.body.booking_token ? req.body.booking_token : null;
    const locale = req.params.locale ? req.params.locale : 'en'

    try {
      //console.log('req.headers.authorization', req.headers.authorization)
      if (req.headers.authorization && req.headers.authorization != undefined) {
        const jwtString = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }

      const res = await Booking.findAll({
        where: user != null ?
          { user_id: user.dataValues.id } :
          { booking_token: bookingToken },
        attributes: [
          "id",
          "type",
          "user_id",
          "puja_id",
          "user_address_id",
          "package_id",
          "pandit_id",
          "puja_kit_id",
          "samagri_package_id",
          "astrology_product_id",
          "astrology_product_variation_id",
          "tour_id",
          "price",
          "quantity",
          "carat",
          "image",
          "total",
          "date",
          "time"
        ],
        include: [

          {
            model: BookingTourDetail,
            attributes: [
              "id",
              "booking_id",
              "tour_detail_id",
              "price",
              "is_required",
              "item_selectable"
            ],
            include: [
              {
                model: BookingTourDetailItem,
                attributes: [
                  "id",
                  "booking_tour_detail_id",
                  "quantity",
                  "quantity"
                ],
                include: [
                  {
                    model: TourDetailItem,
                    attributes: [
                      "id",
                      "tour_detail_id",
                      "quantity",
                      "price"
                    ],
                    include: [
                      {
                        model: TourDetailItemTranslate,
                        attributes: [
                          "id",
                          "tour_detail_item_id",
                          "title",
                          "locale"
                        ],
                        where: {
                          locale: locale
                        }
                      },
                    ]
                  }
                ]
              },
              {
                model: TourDetail,
                attributes: [
                  "id",
                  "tour_id",
                  "is_required",
                  "item_selectable",
                  "price"
                ],
                include: [
                  {
                    model: TourDetailTranslate,
                    attributes: [
                      "id",
                      "tour_detail_id",
                      "title",
                      "locale"
                    ],
                    where: {
                      locale: locale
                    }
                  },

                ]
              }
            ]
          },
          {
            model: Tour,
            attributes: ['id', 'image', 'address'],
            include: [
              {
                model: TourTranslate,
                attributes: ['id', "tour_id", "title"],
                where: {
                  locale: locale
                }
              },

            ],
          },
          {
            model: AstrologyProduct,
            attributes: [
              "id",
              "image",
              "price",
              "type"
            ],
            include: [
              {
                model: AstrologyProductTranslate,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "title",
                  "slug",
                  "locale",
                  "description"
                ],
                where: {
                  locale: locale
                }
              },
              {
                model: AstrologyProductVariation,
                attributes: [
                  "id",
                  "astrology_product_id",
                  "carat",
                  "price",
                  "discounted_price"
                ]
              }
            ]
          },
          {
            model: BookingSession,
            attributes: [
              "id",
              "booking_id",
              "name",
              "email",
              "phone",
              "date_of_birth",
              "time",
              "city",
              "state",
              "country",
              "gender",
              "booking_date",
              "booking_time",
              "comment",
              "status"
            ],
          },
          {
            model: BookingKundali,
            attributes: [
              "id",
              "booking_id",
              "name",
              "email",
              "phone",
              "date_of_birth",
              "time",
              "city",
              "state",
              "country",
              "gender",
              "status"
            ],
          },
          {
            model: BookingMatch,
            attributes: [
              "id",
              "booking_id",
              "boy_name",
              "girl_name",
              "girl_dob",
              "girl_birth_time",
              "email",
              "phone",
              "boy_dob",
              "boy_birth_time",
              "comment",
              "status",
              "girl_birth_place",
              "boy_birth_place",
              "booking_time",
              "booking_date"
            ],
          },
          {
            model: Puja,
            attributes: [
              "id",
              "image"
            ],
            include: [
              {
                model: PujaTranslate,
                attributes: [
                  "id",
                  "title",
                  "locale"
                ],
                where: {
                  locale: locale
                }
              }
            ]
          },
          {
            model: PujaKit,
            attributes: [
              "id",
              "image"
            ],
            include: [
              {
                model: SamagriPackage,
                attributes: ['id'],
                include: [
                  {
                    model: SamagriPackageTranslate,
                    attributes: ["id", "title"],
                    where: {
                      locale: locale
                    }
                  }
                ]
              },
              {
                model: PujaKitTranslate,
                attributes: [
                  "id",
                  "title",
                  "locale"
                ],
                where: {
                  locale: locale
                }
              }
            ]
          },
          {
            model: Location,
            attributes: [
              "id",
              "image"
            ],
            include: [
              {
                model: LocationTranslate,
                attributes: [
                  "id",
                  "title",
                  "locale"
                ],
                where: {
                  locale: locale
                }
              }
            ]
          },
          {
            model: BookingPackageDetail,
            attributes: [
              "id",
              "booking_id",
              "package_detail_id",
              "is_required",
              "item_selectable",
              "type",
              "price"
            ],
            include: [
              {
                model: PackageDetail,
                attributes: [
                  "id",
                  "price",
                  "is_required",
                  "item_selectable",
                  "pandit_required"
                ],
                include: [
                  {
                    model: Package,
                    attributes: ["id"],
                    include: [
                      {
                        model: PackageTranslate,
                        attributes: ['id', 'title'],
                        where: {
                          locale: locale
                        }
                      }
                    ]
                  },
                  {
                    model: PackageDetailTranslate,
                    attributes: [
                      "id",
                      "title",
                      "locale"
                    ],
                    where: {
                      locale: locale
                    }
                  },
                  {
                    model: PackageDetailItem,
                    attributes: [
                      "id",
                      "quantity",
                      "price"
                    ],
                    include: [
                      {
                        model: PackageDetailItemTranslate,
                        attributes: [
                          "id",
                          "title",
                          "locale"
                        ],
                        where: {
                          locale: locale
                        }
                      },
                    ]
                  },
                ]
              },
            ]
          },
          {
            model: BookingSamagriPackageDetail,
            attributes: [
              "id",
              "booking_id",
              "samagri_package_detail_id",
              "price",
              "item_selectable",
              "is_required"
            ],
            include: [
              {
                model: SamagriPackageDetail,
                attributes: [
                  "id",
                  "price",
                  "is_required",
                  "item_selectable"
                ],
                include: [
                  {
                    model: SamagriPackageDetailTranslate,
                    attributes: [
                      "id",
                      "title",
                      "locale"
                    ],
                    where: {
                      locale: locale
                    }
                  },
                ]
              },
              {
                model: BookingSamagriPackageDetailItem,
                attributes: [
                  "id",
                  "booking_sm_pck_detail_id",
                  "samagri_id",
                  "type"
                ],
                include: [
                  {
                    model: Samagri,
                    attributes: [
                      "id",
                      "quantity",
                      "price"
                    ],
                    include: [
                      {
                        model: SamagriTranslate,
                        attributes: [
                          "id",
                          "title",
                          "locale"
                        ],
                        where: {
                          locale: locale
                        }
                      },
                    ]
                  },
                ]
              },
            ]
          },
          {
            model: Pandit,
            include: [
              {
                model: PanditTranslate,
                where: {locale: locale}
              }
            ]
          }

        ],
      });

      if (res) {
        res.map(element => {
          total += element.dataValues.total;
        })
      }
      noOfItems = res.length;
      return { res, total, noOfItems };
    } catch (e: any) {
      return { error: e };
    }
  }

  async addToCart(req) {
    let setting = null
    let user = null;
    let packages;
    let puja;
    let bookingToken = null;
    let input = req.body;
    let res = null;
    let total = 0;
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');

    // try {
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }

      bookingToken = input.booking_token;

      if (input.type && !isNaN(input.type)) {
        if(user) {
          await Booking.update(
            { booking_token: bookingToken },
            { where: { user_id: user.dataValues.id } }
          );
        }
        // console.log('input.date', input.date);
        switch (input.type) {
          case '1':
            const getPackage = await Package.findOne({ where: { id: input.package_id } })
            const dbDate = date.format(new Date(input.date), 'YYYY-MM-DD HH:mm')
            // console.log(dbDate)
            if (input.packageDetails && input.packageDetails.length > 0 && getPackage) {
              let post :any= {
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                puja_id: getPackage.dataValues.puja_id,
                package_id: input.package_id,
                pandit_id: input.pandit_id ? input.pandit_id : null,
                location_id: input.location_id ? input.location_id : null,
                language_id: input.language_id ? input.language_id : null,
                date: dbDate,
                type: input.type,
                total: input.total,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              }
              // console.log(post);
              
              res = await Booking.create(post);

              let packageDetails = input.packageDetails;
              let getPackageDetail;
              // console.log(input.packageDetails)
              for (var i = 0; i < packageDetails.length; i++) {
                let element = packageDetails[i];
                
                console.log(element.id)

                 getPackageDetail = await PackageDetail.findOne({
                  where: {
                    id: element.id
                  }
                });           
                //console.log('getPackageDetail=========',getPackageDetail.dataValues.id)
                if (getPackageDetail) {
                  let bookingPackageDetail = await BookingPackageDetail.findOne({
                    where: {
                      booking_id: res.dataValues.id,
                      package_detail_id: getPackageDetail.dataValues.id
                    }
                  });

                  if (bookingPackageDetail) {
                    let getPackageDetailItem = await PackageDetailItem.findOne({
                      where: {
                        id: element.item_id
                      }
                    });

                    if (getPackageDetailItem) {
                      total += getPackageDetailItem.dataValues.price;
                      await BookingPackageDetailItem.create({
                        booking_pck_dt_id: bookingPackageDetail.dataValues.id,
                        package_dt_it_id: getPackageDetailItem.dataValues.id,
                        quantity: getPackageDetailItem.dataValues.quantity,
                        price: getPackageDetailItem.dataValues.price,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null
                      });
                    }
                  }
                  else {
                    
                    let bookingPackageDetail = await BookingPackageDetail.create({
                      booking_id: res.dataValues.id,
                      package_detail_id: getPackageDetail.dataValues.id,
                      price: getPackageDetail.dataValues.price,
                      is_required: getPackageDetail.dataValues.is_required,
                      item_selectable: getPackageDetail.dataValues.item_selectable,
                      pandit_required: getPackageDetail.dataValues.pandit_required,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null
                    });
                    //console.log(bookingPackageDetail.dataValues.booking_id,"          ",bookingPackageDetail.dataValues.package_detail_id)
                   if( element.item_id ){
                    
                     let getPackageDetailItem = await PackageDetailItem.findOne({
                       where: {
                         id: element.item_id 
                       }
                     });
                     if (bookingPackageDetail && getPackageDetailItem) {
                       total += getPackageDetailItem.dataValues.price
                       await BookingPackageDetailItem.create({
                         booking_pck_dt_id: bookingPackageDetail.dataValues.id,
                         package_dt_it_id: getPackageDetailItem.dataValues.id,
                         price: getPackageDetailItem.dataValues.price,
                         quantity: getPackageDetailItem.dataValues.quantity,
                         createdAt: currentFormattedDate,
                         updatedAt: currentFormattedDate,
                         deletedAt: null
                       });
                     }
                   }

                  }
                }
                getPackageDetail.dataValues.pandit_required == 1 ? total += getPackageDetail.dataValues.price : ''
              }
     
              await Booking.update({ total: total }, { where: { id: res.dataValues.id } })
            }
            break;
          case '2':
            const getSamagriPackage = await SamagriPackage.findOne({ where: { id: input.samagri_package_id } })

            if (getSamagriPackage && input.samagriPackageDetails && input.samagriPackageDetails.length > 0) {
              res = await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                puja_kit_id: getSamagriPackage.dataValues.puja_kit_id,
                samagri_package_id: getSamagriPackage.dataValues.id,
                type: input.type,
                total: input.total,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              let samagriPackageDetails = input.samagriPackageDetails;
              for (var i = 0; i < samagriPackageDetails.length; i++) {
                var element = samagriPackageDetails[i];

                let getSamagriPackageDetail = await SamagriPackageDetail.findOne({
                  where: {
                    id: element.id
                  }
                });

                if (getSamagriPackageDetail) {
                  let bookingPackageDetail = await BookingSamagriPackageDetail.findOne({
                    where: {
                      booking_id: res.dataValues.id,
                      samagri_package_detail_id: getSamagriPackageDetail.dataValues.id
                    }
                  });

                  if (bookingPackageDetail) {
                    let getSamagriPackageDetailItem = await SamagriPackageItem.findOne({
                      where: {
                        id: element.item_id
                      },
                      include: [
                        { model: Samagri }
                      ]
                    });

                    if (getSamagriPackageDetailItem) {
                      total += getSamagriPackageDetailItem['Samagri'] && getSamagriPackageDetailItem['Samagri'].dataValues.price
                      await BookingSamagriPackageDetailItem.create({
                        booking_sm_pck_detail_id: bookingPackageDetail.dataValues.id,
                        samagri_id: getSamagriPackageDetailItem.dataValues.samagri_id,
                        type: getSamagriPackageDetailItem.dataValues.type,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null
                      });
                    }
                  }
                  else {
                    let bookingPackageDetail = await BookingSamagriPackageDetail.create({
                      booking_id: res.dataValues.id,
                      samagri_package_detail_id: getSamagriPackageDetail.dataValues.id,
                      price: getSamagriPackageDetail.dataValues.price,
                      is_required: getSamagriPackageDetail.dataValues.is_required,
                      item_selectable: getSamagriPackageDetail.dataValues.item_selectable,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null
                    });

                    let getSamagriPackageDetailItem = await SamagriPackageItem.findOne({
                      where: {
                        id: element.item_id
                      },
                      include: [
                        { model: Samagri }
                      ]
                    });

                    if (bookingPackageDetail && getSamagriPackageDetailItem) {
                      total += getSamagriPackageDetailItem['Samagri'] && getSamagriPackageDetailItem['Samagri'].dataValues.price
                      await BookingSamagriPackageDetailItem.create({
                        booking_sm_pck_detail_id: bookingPackageDetail.dataValues.id,
                        samagri_id: getSamagriPackageDetailItem.dataValues.samagri_id,
                        type: getSamagriPackageDetailItem.dataValues.type,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null
                      });
                    }
                  }
                }
              }

              await Booking.update({ total: total }, { where: { id: res.dataValues.id } })
            }
            break;
          case '3':
            let productVariation = null
            if (input.astrology_product_variation_id && input.astrology_product_variation_id != null) {
              productVariation = await AstrologyProductVariation.findOne({
                where: { id: input.astrology_product_variation_id },
                attributes: ['price', 'carat', 'discounted_price']
              })
            }

            const astrologyProduct = await AstrologyProduct.findOne({
              where: { id: input.astrology_product_id },
              attributes: ['price']
            })

            if (productVariation != null || astrologyProduct) {
              await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                astrology_product_id: input.astrology_product_id,
                astrology_product_variation_id: input.astrology_product_variation_id ? input.astrology_product_variation_id : null,
                type: input.type,
                total: productVariation != null ? productVariation.dataValues.discounted_price > 0 ? productVariation.dataValues.discounted_price : productVariation.dataValues.price : astrologyProduct.dataValues.price,
                carat: productVariation != null ? productVariation.dataValues.carat : ''
              });
            }
            break;
          case '4':
            if (input.TourDetail && input.TourDetail.length > 0) {
              res = await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                tour_id: input.tour_id,
                type: input.type,
                total: input.total,
                visiting_date: input.visiting_date,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });

              let tourDetails = input.TourDetail;
              for (var i = 0; i < tourDetails.length; i++) {
                var element = tourDetails[i];

                let getTourDetail = await TourDetail.findOne({
                  where: {
                    id: element.tour_detail_id
                  }
                });

                if (getTourDetail) {
                  let bookingTourDetail = await BookingTourDetail.findOne({
                    where: {
                      booking_id: res.dataValues.id,
                      tour_detail_id: getTourDetail.dataValues.id
                    }
                  });

                  if (bookingTourDetail) {
                    let getTourDetailItem = await TourDetailItem.findOne({
                      where: {
                        id: element.tour_detail_item_id
                      }
                    });

                    if (getTourDetailItem) {
                      total += getTourDetailItem.dataValues.price
                      await BookingTourDetailItem.create({
                        booking_tour_detail_id: bookingTourDetail.dataValues.id,
                        tour_detail_item_id: getTourDetailItem.dataValues.id,
                        quantity: getTourDetailItem.dataValues.quantity,
                        price: getTourDetailItem.dataValues.price,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null
                      });
                      //Update booking tour details table's price
                    }
                  }
                  else {
                    // console.log('Step 1')
                    let bookingTourDetail = await BookingTourDetail.create({
                      booking_id: res.dataValues.id,
                      tour_detail_id: getTourDetail.dataValues.id,
                      price: 0,
                      is_required: getTourDetail.dataValues.is_required,
                      item_selectable: getTourDetail.dataValues.item_selectable,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null
                    });

                    let getTourDetailItem = await TourDetailItem.findOne({
                      where: {
                        id: element.tour_detail_item_id
                      }
                    });

                    if (bookingTourDetail && getTourDetailItem) {
                      total += getTourDetailItem.dataValues.price;
                      await BookingTourDetailItem.create({
                        booking_tour_detail_id: bookingTourDetail.dataValues.id,
                        tour_detail_item_id: getTourDetailItem.dataValues.id,
                        quantity: getTourDetailItem.dataValues.quantity,
                        price: getTourDetailItem.dataValues.price,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null
                      });
                    }
                  }
                }
              }

              await Booking.update({ total: total }, { where: { id: res.dataValues.id } })
            }

            break;
          case '5':
            setting = await Setting.findOne({
              where: { id: 1 },
              attributes: ['kundli_amount']
            })

            const kundliContent = await cms.findOne({
              where: {id: 7},
              attributes: ['image']
            })
            
            if(setting != null && kundliContent){
              res = await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                type: input.type,
                total: setting.dataValues.kundli_amount,
                image: kundliContent.dataValues.image,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
  
              if (res != null) {
                // let dateArray = input.date_of_birth.split('-');
                // let dateOfBearth = currentFormattedDate;
                // if(dateArray.length == 3) {
                //   dateOfBearth = dateArray[2] + '-' + (dateArray[1] <= 9 ? '0'+dateArray[1] : dateArray[1]) + '-' + (dateArray[0] <= 9 ? '0'+dateArray[0] : dateArray[0]);
                // }
             
                await BookingKundali.create({
                  booking_id: res.dataValues.id,
                  name: input.name ? input.name : '',
                  email: input.email ? input.email : '',
                  phone: input.phone ? input.phone : '',
                  date_of_birth: input.date_of_birth && input.date_of_birth,
                  time: input.time ? input.time : null,
                  city: input.city ? input.city : '',
                  state: input.state ? input.state : '',
                  country: input.country ? input.country : '',
                  gender: input.gender ? input.gender : 1,
                  status: 0,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
              }
            }
            break;
          case '6':
            setting = await Setting.findOne({
              where: { id: 1 },
              attributes: ['session_amount']
            })

            const sessionContent = await cms.findOne({
              where: {id: 8},
              attributes: ['image']
            })

            if(setting != null && sessionContent){
              res = await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                type: input.type,
                total: setting.dataValues.session_amount,
                image: sessionContent.dataValues.image,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
              if (res != null) {
                // let dateArray = input.date_of_birth.split('-');
                // let dateOfBearth = currentFormattedDate;
                // if(dateArray.length == 3) {
                //   dateOfBearth = dateArray[2] + '-' + (dateArray[1] <= 9 ? '0'+dateArray[1] : dateArray[1]) + '-' + (dateArray[0] <= 9 ? '0'+dateArray[0] : dateArray[0]);
                // }
            

                await BookingSession.create({
                  booking_id: res.dataValues.id,
                  name: input.name ? input.name : '',
                  email: input.email ? input.email : '',
                  phone: input.phone ? input.phone : '',
                  date_of_birth: input.date_of_birth && input.date_of_birth,
                  time: input.time ? input.time : null,
                  city: input.city ? input.city : '',
                  state: input.state ? input.state : '',
                  country: input.country ? input.country : '',
                  gender: input.gender ? input.gender : 1,
                  booking_date: input.booking_date ? input.booking_date : '',
                  booking_time: input.booking_time ? input.booking_time : '',
                  comment: input.comment ? input.comment : '',
                  status: 0,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
              }
            }
            break;
          case '7':
            setting = await Setting.findOne({
              where: { id: 1 },
              attributes: ['kundli_match_amount']
            })

            const matchContent = await cms.findOne({
              where: {id: 9},
              attributes: ['image']
            })

            if(setting != null && matchContent) {
              res = await Booking.create({
                user_id: user == null ? null : user.dataValues.id,
                booking_token: bookingToken == null ? null : bookingToken,
                type: input.type,
                total: setting.dataValues.kundli_match_amount,
                image: matchContent.dataValues.image,
                createdAt: currentFormattedDate,
                updatedAt: currentFormattedDate,
                deletedAt: null
              });
  
              if (res != null) {
      //  console.log(input.booking_date)
                await BookingMatch.create({
                  booking_id: res.dataValues.id,
                  boy_name: input.boy_name ? input.boy_name : '',
                  girl_name: input.girl_name ? input.girl_name : '',
                  email: input.email ? input.email : '',
                  phone: input.phone ? input.phone : '',
                  boy_dob: input.boy_dob,
                  boy_birth_time: input.boy_birth_time ? input.boy_birth_time : null,
                  girl_dob: input.girl_dob,
                  girl_birth_time: input.girl_birth_time ? input.girl_birth_time : null,
                  comment: input.comment ? input.comment : '',
                  booking_date: input.booking_date ? input.booking_date : '',
                  booking_time: input.booking_time ? input.booking_time : '',
                  girl_birth_place: input.girl_birth_place ? input.girl_birth_place : '',
                  boy_birth_place: input.boy_birth_place ? input.boy_birth_place : '',
                  status: 0,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null
                });
              }
            }
            break;
        }
      }

      return this.cartDetails(req);
    // } catch (e: any) {
    //   return { error: e };
    // }
  }

  async removeFromCart(req) {
    let user = null;
    let bookingToken = null;
    let input = req.body;
    let res = null;

    try {
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      else {
        bookingToken = input.booking_token;
      }

      res = await Booking.findOne({
        where: user == null ? {
          [Op.and]: [
            { booking_token: bookingToken },
            { id: input.id }
          ]
        } : {
          [Op.and]: [
            { user_id: user.dataValues.id },
            { id: input.id }
          ]
        }
      });

      if (res) {
        await Booking.destroy({ where: { id: input.id } });
      }

      // return this.cartDetails(req);
    } catch (e: any) {
      return { error: e };
    }
  }

  // remove item from cart on success payment
  async removeItemsCart(req) {
    let user = null;
    let bookingToken = null;
    let input = req.body;

    try {
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      else {
        bookingToken = input.booking_token;
      }

      if (user) {
        let booking = await Booking.findOne({where:{user_id: user.dataValues.id}})
        let pujaPackage = await BookingPackageDetail.findOne({where: {booking_id: booking.dataValues.id} })
        let samagriPackage = await BookingSamagriPackageDetail.findOne({where: {booking_id: booking.dataValues.id} })

        await BookingKundali.destroy({where: {booking_id: booking.dataValues.id} })
        await BookingMatch.destroy({where: {booking_id: booking.dataValues.id} })
        await BookingSession.destroy({where: {booking_id: booking.dataValues.id} })
        await BookingPackageDetailItem.destroy({where:{booking_pck_dt_id: pujaPackage.dataValues.id}})
        await BookingPackageDetail.destroy({where: {booking_id: booking.dataValues.id} })
        await BookingSamagriPackageDetailItem.destroy({where:{booking_sm_pck_detail_id: samagriPackage.dataValues.id}})
        await BookingSamagriPackageDetail.destroy({where: {booking_id: booking.dataValues.id} })
        await BookingTourDetail.destroy({where: {booking_id: booking.dataValues.id} })
        await Booking.destroy({
          where: { user_id: user.dataValues.id },
          truncate: true
        });
      }
    } catch (e: any) {
      return { error: e };
    }
  }
}



export { BookingRepository };