import { OrderMembers, Order } from "../models/Order";
import { User } from "../models/User";
import { UserAddress } from "../models/UserAddress";
import jwt from "jsonwebtoken";
import { OrderDetail } from "../models/OrderDetail";
import { Booking } from "../models/Booking";
import { AstrologyProduct } from "../models/AstrologyProduct";
import { AstrologyProductTranslate } from "../models/AstrologyProductTranslate";
import { AstrologyProductVariation } from "../models/AstrologyProductVariation";
import { BookingSession } from "../models/BookingSession";
import { BookingKundali } from "../models/BookingKundli";
import { BookingMatch } from "../models/BookingMatch";
import { Puja } from "../models/Puja";
import { PujaTranslate } from "../models/PujaTranslate";
import { LocationTranslate } from "../models/LocationTranslate";
import { Location } from "../models/Location";
import { BookingPackageDetail } from "../models/BookingPackageDetail";
import { PackageDetail } from "../models/PackageDetail";
import { PackageDetailTranslate } from "../models/PackageDetailTranslate";
import { PackageDetailItem } from "../models/PackageDetailItem";
import { PackageDetailItemTranslate } from "../models/PackageDetailItemTranslate";
import { BookingSamagriPackageDetail } from "../models/BookingSamagriPackageDetail";
import { SamagriPackageDetail } from "../models/SamagriPackageDetail";
import { SamagriPackageDetailTranslate } from "../models/SamagriPackageDetailTranslate";
import { BookingSamagriPackageDetailItem } from "../models/BookingSamagriPackageDetailItem";
import { Samagri } from "../models/Samagri";
import { SamagriTranslate } from "../models/SamagriTranslate";
import { OrderDetailPackageDetail } from "../models/OrderDetailPackageDetail";
import { Package } from "../models/Package";
import { SamagriPackage } from "../models/SamagriPackage";
import { PackageTranslate } from "../models/PackageTranslate";
import { OrderDetailPackageDetailTranslate } from "../models/OrderDetailPackageDetailTranslate";
import { OrderDetailPackageDetailItem } from "../models/OrderDetailPackageDetailItem";
import { OrderDetailPackageDetailItemTranslate } from "../models/OrderDetailPackageDetailItemTranslate";
import { SamagriPackageTranslate } from "../models/SamagriPackageTranslate";
import { PujaKit } from "../models/PujaKit";
import { PujaKitTranslate } from "../models/PujaKitTranslate";
import { OrderDetailSamagriPackage } from "../models/OrderDetailSamagriPackage";
import { OrderDetailSamagriPackageTranslate } from "../models/OrderDetailSamagriPackageTranslate";
import { OrderDetailSamagriPackageItem } from "../models/OrderDetailSamagriPackageItem";
import { OrderDetailPujaKit } from "../models/OrderDetailPujaKit";
import { OrderDetailPujaKitTranslate } from "../models/OrderDetailPujaKitTranslate";
import { OrderDetailAstrologyProductTranslate } from "../models/OrderDetailAstrologyProductTranslate";
import { Tour } from "../models/Tour";
import { TourTranslate } from "../models/TourTranslate";
import { TourDetail } from "../models/TourDetail";
import { TourDetailTranslate } from "../models/TourDetailTranslate";
import { OrderDetailTour } from "../models/OrderDetailTour";
import { OrderDetailTourDetailTranslate } from "../models/OrderDetailTourDetailTranslate";
import { OrderDetailTourDetail } from "../models/OrderDetailTourDetail";
import { OrderDetailKundli } from "../models/OrderDetailKundli";
import { OrderDetailSession } from "../models/OrderDetailSession";
import { OrderDetailMatch } from "../models/OrderDetailMatch";
import { TourDetailItem } from "../models/TourDetailItems";
import { TourDetailItemTranslate } from "../models/TourDetailItemTranslate";
import { OrderDetailTourDetailItem } from "../models/OrderDetailTourDetailItem";
import { OrderDetailTourDetailItemTranslate } from "../models/OrderDetailTourDetailItemTranslate";
import { OrderDetailTourTranslate } from "../models/OrderDetailTourTranslate";
import instance from "../config/razorpay-config";
import * as dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { OrderDetailSamagriPackageItemTranslate } from "../models/OrderDetailSamagriPackageItemTranslate";
import { BookingTourDetail } from "../models/BookingTourDetail";
import { BookingTourDetailItem } from "../models/BookingTourDetailItem";
import { BookingPackageDetailItem } from "../models/BookingPackageDetailItem";
import { OrderDetailPujaTranslate } from "../models/OrderDetailPujaTranslate";
import { OrderDetailPackageTranslate } from "../models/OrderDetailPackageTranslate";
import { OrderDetailKitPackageTranslate } from "../models/OrderDetailKitPackageTranslate";
import { Setting } from "../models/Setting";
import InvoiceTemplate from "../views/InvoiceTemplate";
import InvoiceTemplateHi from "../views/InvoiceTemplateHi";
import { LanguageLocation } from "../models/LanguageLocation";
import { LanguageTranslate } from "../models/LanguageTranslate";
import { Language } from "../models/Language";
import { PujaLocation } from "../models/PujaLocation";
const { Op } = require("sequelize");

const date = require("date-and-time");

export class OrderRepository {


  async getAll() {
    try {
      const res: Order[] = await Order.findAll({
        order: [["id", "DESC"]],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: OrderMembers) {
    const phoneno = /^\d{10}$/;
    const del = await User.findAll({
      where: { id: post.user_id, deletedAt: null },
    });
    const findUserId = await User.findAll({ where: { id: post.user_id } });
    const FindUserAddress = await UserAddress.findAll({
      where: { id: post.user_address_id },
    });
    if (
      !post.user_id ||
      !post.user_address_id ||
      !post.order_id ||
      !post.payment_id ||
      !post.name ||
      !post.total ||
      !post.shipping_amount ||
      !post.status ||
      !post.state ||
      !post.address ||
      !post.pincode
    ) {
      throw new Error("empty field");
    }
    if (del.length == 0) {
      throw new Error("user id has been deleted earlier");
    }
    if (
      !post.phone ||
      !post.alternate_phone ||
      post.phone.length != 10 ||
      !post.phone.match(phoneno) ||
      post.alternate_phone.length != 10 ||
      !post.alternate_phone.match(phoneno)
    ) {
      throw new Error("you have to fill  a valid phone number ");
    }
    if (post.phone === post.alternate_phone) {
      throw new Error(
        "your phone number should be different from your alternate number"
      );
    }

    if (!findUserId || !FindUserAddress) {
      throw new Error("no such id found");
    } else {
      try {
        const res = await Order.create(post);

        return { res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  async edit(id: bigint) {
    try {
      const res = await Order.findOne({
        where: {
          id: id,
        },
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async update(post: any) {
    // console.log(post)
    const val = await Order.findOne({ where: { id: post.id } });
    //  console.log(post)
    if (!val) { throw new Error("Id not found");}

    try {
      

    if (post.processing_status == 0) {
        const res = await OrderDetail.update( { status: post.processing_status },{ where: { order_id: post.id } } );
        const resp = await Order.update( { status: post.processing_status}, { where: { id: post.id } } );
      
    }
    if (post.pending_status == 1) {
        const res = await OrderDetail.update({ status: post.pending_status }, { where: { order_id: post.id } });
        const resp = await Order.update({status: post.pending_status, payment_id: post.payment_id },
          { where: { id: post.id } }
        );
     
    }
    if(post.editedData.length!=0){
      post.editedData.map(async (it)=>{
     const res = await OrderDetail.update(  { status: it.status }, { where: { id: it.id } } );
     if(res)
     this.updatedStatus(post)
      // console.log(res)
      })
  }
    
      // let checkOrderStatus = 4;
      // let checkCancelStatus = 3;
      // const orderItems = await OrderDetail.findAll({
      //   where: { order_id: post.id },
      // });
      // if (orderItems) {
      //   orderItems.map((item) => {
      //     // console.log(item.dataValues)
      //     if (item.dataValues.status == 0 || item.dataValues.status == 1 || item.dataValues.status == 3) {
      //       checkOrderStatus = 1;
      //     }
      //   });
      //   orderItems.map((item) => {
      //       console.log(item.dataValues.status)
      //     if (item.dataValues.status != 3) {
      //       checkCancelStatus = 0;
      //     }
      //   });
      //   if (checkOrderStatus == 4) {
      //     const res = await Order.update(
      //       { status: checkOrderStatus },
      //       { where: { id: post.id } }
      //     );
      //   }
      //   else if (checkCancelStatus == 3) {
      //     const res = await Order.update(
      //       { status: checkCancelStatus },
      //       { where: { id: post.id } }
      //     );
      //   }
      // }

      return { success: true };
    } catch (e: any) {
      return { error: e };
    }
    //}
  }
  async updatedStatus(post: any) {
    try {
       let checkOrderStatus = 4;
      let checkCancelStatus = 3;
      const orderItems = await OrderDetail.findAll({
        where: { order_id: post.id },
      });
      if (orderItems) {
        orderItems.map((item) => {
          // console.log(item.dataValues)
          if (item.dataValues.status == 0 || item.dataValues.status == 1 || item.dataValues.status == 3) {
            checkOrderStatus = 1;
          }
        });
        orderItems.map((item) => {
            // console.log(item.dataValues.status)
          if (item.dataValues.status != 3) {
            checkCancelStatus = 0;
          }
        });
        if (checkOrderStatus == 4) {
          const res = await Order.update(
            { status: checkOrderStatus },
            { where: { id: post.id } }
          );
        }
        else if (checkCancelStatus == 3) {
          const res = await Order.update(
            { status: checkCancelStatus },
            { where: { id: post.id } }
          );
        }
      }
      return ;
    } catch (e: any) {
      return { error: e };
    }
  }
  // async update(post: OrderMembers,id) {

  //   const val = await Order.findOne({ where: { id: post.id } });
  //   if (!val) {
  //     throw new Error("Id not found");
  //   }
  //   // if (!post.key || !post.en || !post.hi) {
  //   //   throw new Error("empty field");
  //   // }
  //   // if (noChange.length != 0) {
  //   //   throw new Error("no changes have been commited!");
  //   // }
  //   else {
  //     try {
  //       const res = await Order.update({
  //         status: post.status
  //        }, { where: { id: post.id  } });
  //       return { body: res };
  //     } catch (e: any) {
  //       return { error: e };
  //     }
  //   }
  // }

  async delete(id: bigint) {
    const delData = await Order.findAll({ where: { id: id } });
    const del = await Order.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await Order.destroy({ where: { id: id } });
        return { res };
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

  async orders(req, status, listType) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    // const locale = req.params.locale ? req.params.locale : "en";
    const now = new Date();

    const today = date.addDays(now, 0);
    const thirtyDays = date.addDays(now, -30);
    const threeMonth = date.addDays(now, -90);
    const oneYear = date.addDays(now, -365);

    try {
      const datas = await Order.findAll({
        where:
          status != -1
            ? {
              user_id: user.dataValues.id,
              status: status,
              order_date:
                listType == 1
                  ? { [Op.between]: [thirtyDays, today] }
                  : listType == 2
                    ? { [Op.between]: [threeMonth, today] }
                    : listType == 3
                      ? { [Op.between]: [oneYear, today] }
                      : "",
            }
            : {
              user_id: user.dataValues.id,
              order_date:
                listType == 1
                  ? { [Op.between]: [thirtyDays, today] }
                  : listType == 2
                    ? { [Op.between]: [threeMonth, today] }
                    : listType == 3
                      ? { [Op.between]: [oneYear, today] }
                      : "",
            },
        order: [["id", "DESC"]],

        attributes: [
          "id",
          "user_id",
          "user_address_id",
          "order_id",
          "payment_id",
          "total",
          "shipping_amount",
          "address",
          "alternate_phone",
          "name",
          "phone",
          "state",
          "pincode",
          "status",
          "createdAt",
        ],
        include: [
          {
            model: OrderDetail,
            where: {
              //createdAt: listType == 1 ? thirtyDays : listType == 2 ? threeMonth : listType == 3 ? oneYear : ''
            },
            attributes: [
              "id",
              "order_id",
              "puja_id",
              "package_id",
              "puja_kit_id",
              "samagri_package_id",
              "astrology_product_id",
              "astrology_product_variation_id",
              "tour_id",
              "image",
              "thumb_image",
              "carat",
              "total",
              "date",
              "time",
              "is_live",
              "meeting_id",
              "meeting_url",
              "status",
              "type",
              "createdAt",
            ],
          },
        ],
      });

      return { datas };
    } catch (e: any) {
      return { error: e };
    }
  }

  async orderDetails(req) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    const orderId = req.params.id;
    const locale = req.params.locale ? req.params.locale : "en";

    try {
      const datas = await Order.findOne({
        where: { user_id: user.dataValues.id, id: orderId },
        //where: { user_id: 11, id: orderId },
        attributes: [
          "id",
          "user_id",
          "user_address_id",
          "order_id",
          "payment_id",
          "total",
          "shipping_amount",
          "address",
          "alternate_phone",
          "name",
          "phone",
          "state",
          "pincode",
          "status",
        ],
        include: [
          {
            model: OrderDetail,
            attributes: [
              "id",
              "order_id",
              "puja_id",
              "package_id",
              "puja_kit_id",
              "samagri_package_id",
              "astrology_product_id",
              "astrology_product_variation_id",
              "tour_id",
              "image",
              "thumb_image",
              "carat",
              "total",
              "date",
              "location_id",
              "language_id",
              "time",
              "is_live",
              "visiting_date",
              "meeting_id",
              "meeting_url",
              "status",
              "type",
            ],
            include: [
              {
                model: OrderDetailAstrologyProductTranslate,
                include: [
                  {
                    model: OrderDetail,
                    include: [
                      {
                        model: OrderDetailAstrologyProductTranslate,
                        where: { locale: locale }
                      },
                      {
                        model: AstrologyProduct,
                        include: [
                          {
                            model: AstrologyProductTranslate,
                            where: { locale: locale }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              { model: OrderDetailSession },
              { model: OrderDetailKundli },
              { model: OrderDetailMatch },
              {
                model: OrderDetailPujaKit,
                include: [
                  {
                    model: OrderDetailPujaKitTranslate,
                    where: { locale: locale },
                  },
                ],
              },
              {
                model: OrderDetailSamagriPackage,
                include: [
                  {
                    model: OrderDetailSamagriPackageTranslate,
                    where: { locale: locale },
                  },
                  {
                    model: OrderDetailSamagriPackageItem,
                    include: [
                      {
                        model: OrderDetailSamagriPackageItemTranslate,
                        where: { locale: locale },
                      },
                    ],
                  },
                ],
              },
              {
                model: OrderDetailTour,
                include: [
                  {
                    model: OrderDetailTourTranslate,
                    where: { locale: locale },
                  },
                  {
                    model: OrderDetailTourDetail,
                    include: [
                      {
                        model: OrderDetailTourDetailTranslate,
                        where: { locale: locale },
                      },
                      {
                        model: OrderDetailTourDetailItem,
                        include: [
                          {
                            model: OrderDetailTourDetailItemTranslate,
                            where: { locale: locale },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              { model: Puja },
              {
                model: OrderDetailPujaTranslate,
                include: [
                  {
                    model: OrderDetail,
                    include: [
                      {
                        model: OrderDetailPujaTranslate,
                        where: { locale: locale }
                      }
                    ]
                  }
                ]

              },
              {
                model: OrderDetailPackageTranslate,
                include: [
                  {
                    model: OrderDetail,
                    include: [
                      {
                        model: OrderDetailPackageTranslate,
                        where: { locale: locale }
                      }
                    ]
                  }
                ]

              },
              {
                model: OrderDetailKitPackageTranslate,
                // where: Type1 != null ? {locale:locale} : null,

              },
              {
                model: OrderDetailPackageDetail,
                include: [
                  {
                    model: OrderDetailPackageDetailTranslate,
                    where: { locale: locale },
                  },
                  {
                    model: OrderDetailPackageDetailItem,
                    include: [
                      {
                        model: OrderDetailPackageDetailItemTranslate,
                        where: { locale: locale },
                      },
                    ],
                  },
                ],
              },
              {
                model: Location,
                include: [
                  {
                    model: LocationTranslate,
                    where: { locale: locale },

                  }
                ]
              },
              {
                model: Language,
                include: [
                  {
                    model: LanguageTranslate,
                    where: { locale: locale },

                  }
                ]
              }

            ],
          },
        ],
      });

      return { datas };
    } catch (e: any) {
      return { error: e };
    }
  }

  async orderDetailsAdmin(req) {
    // const jwtString = req.headers.authorization.split(" ")[1];
    // const decodedToken = jwt.decode(jwtString);
    // const user = await User.findOne({ where: { id: req.body.user_id } });
    const orderId = req.params.id;
    const locale = req.params.locale ? req.params.locale : "en";

    try {
      const datas = await Order.findOne({
        // where: { user_id: user.dataValues.id, id: orderId },
        where: { id: orderId },
        //where: { user_id: 11, id: orderId },
        attributes: [
          "id",
          "user_id",
          "user_address_id",
          "order_id",
          "payment_id",
          "total",
          "shipping_amount",
          "address",
          "alternate_phone",
          "name",
          "phone",
          "state",
          "pincode",
          "status",
          "order_date"
          // "createdAt",
        ],
        include: [
          {
            model: OrderDetail,
            attributes: [
              "id",
              "order_id",
              "puja_id",
              "location_id",
              "package_id",
              "puja_kit_id",
              "samagri_package_id",
              "astrology_product_id",
              "astrology_product_variation_id",
              "tour_id",
              "image",
              "thumb_image",
              "carat",
              "total",
              "date",
              "time",
              "is_live",
              "visiting_date",
              "meeting_id",
              "meeting_url",
              "status",
              "type",
            ],
            include: [
              {
                model: OrderDetailAstrologyProductTranslate,
              },
              { model: OrderDetailSession },
              { model: OrderDetailKundli },
              { model: OrderDetailMatch },
              {
                model: OrderDetailPujaKit,
                include: [
                  {
                    model: OrderDetailPujaKitTranslate,
                    // where: { locale: locale },
                  },
                ],
              },
              {
                model: OrderDetailSamagriPackage,
                include: [
                  {
                    model: OrderDetailSamagriPackageTranslate,
                    // where: { locale: locale },
                  },
                  {
                    model: OrderDetailSamagriPackageItem,
                    include: [
                      {
                        model: OrderDetailSamagriPackageItemTranslate,
                        // where: { locale: locale },
                      },
                    ],
                  },
                ],
              },
              {
                model: OrderDetailTour,
                include: [
                  {
                    model: OrderDetailTourTranslate,
                    // where: { locale: locale },
                  },
                  {
                    model: OrderDetailTourDetail,
                    include: [
                      {
                        model: OrderDetailTourDetailTranslate,
                        // where: { locale: locale },
                      },
                      {
                        model: OrderDetailTourDetailItem,
                        include: [
                          {
                            model: OrderDetailTourDetailItemTranslate,
                            // where: { locale: locale },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                model: OrderDetailPujaTranslate,
                // where: { locale: locale }
              },
              {
                model: Location,
                include: [
                  {
                    model: LocationTranslate,
                    where: { locale: locale },
                  },
                  // {
                  //   model: LanguageLocation,
                  //   include:[
                  //     {
                  //       model: Language,
                  //       include: [
                  //         {
                  //           model: LanguageTranslate,
                  //           where: { locale: locale },
                  //         },
                  //       ]
                  //     },
                  //   ]
                  // },
                ],
              },
              {
                model: Language,
                include: [
                  {
                    model: LanguageTranslate,
                    where: { locale: locale },
                  },

                ],
              },


              {
                model: OrderDetailPackageTranslate,
              },
              {
                model: OrderDetailKitPackageTranslate,
              },
              {
                model: OrderDetailPackageDetail,
                include: [
                  {
                    model: OrderDetailPackageDetailTranslate,
                    // where: { locale: locale },
                  },
                  {
                    model: OrderDetailPackageDetailItem,
                    include: [
                      {
                        model: OrderDetailPackageDetailItemTranslate,
                        // where: { locale: locale },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: UserAddress
          }
        ],
      });

      return { datas };
    } catch (e: any) {
      return { error: e };
    }
  }

  async orderDetailItem(req) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    const orderDetailId = req.params.id;
    const locale = req.params.locale ? req.params.locale : "en";

    try {
      const datas = await OrderDetail.findOne({
        where: { id: orderDetailId },
        attributes: [
          "id",
          "order_id",
          "puja_id",
          "package_id",
          "puja_kit_id",
          "samagri_package_id",
          "astrology_product_id",
          "astrology_product_variation_id",
          "tour_id",
          "image",
          "thumb_image",
          "carat",
          "total",
          "date",
          "time",
          "is_live",
          "visiting_date",
          "meeting_id",
          "meeting_url",
          "status",
          "type",
        ],
        include: [
          {
            model: Order,
            attributes: ["order_id", "total", "user_address_id","name","address","state","pincode"],
            include: [
              {
                model: UserAddress,
              },
            ],
          },
          {
            model: OrderDetailAstrologyProductTranslate,
            include: [
              {
                model: OrderDetail,
                include: [
                  {
                    model: OrderDetailAstrologyProductTranslate,
                    where: { locale: locale }
                  }
                ]
              }
            ]
          },
          { model: OrderDetailSession },
          { model: OrderDetailKundli },
          { model: OrderDetailMatch },
          {
            model: OrderDetailPujaKit,
            include: [
              {
                model: OrderDetailPujaKitTranslate,
                where: { locale: locale },
              },
            ],
          },
          {
            model: OrderDetailSamagriPackage,
            include: [
              {
                model: OrderDetailSamagriPackageTranslate,
                where: { locale: locale },
              },
              {
                model: OrderDetailSamagriPackageItem,
                include: [
                  {
                    model: OrderDetailSamagriPackageItemTranslate,
                    where: { locale: locale },
                  },
                ],
              },
            ],
          },
          {
            model: OrderDetailTour,
            include: [
              {
                model: OrderDetailTourTranslate,
                where: { locale: locale },
              },
              {
                model: OrderDetailTourDetail,
                include: [
                  {
                    model: OrderDetailTourDetailTranslate,
                    where: { locale: locale },
                  },
                  {
                    model: OrderDetailTourDetailItem,
                    include: [
                      {
                        model: OrderDetailTourDetailItemTranslate,
                        where: { locale: locale },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: OrderDetailPujaTranslate,
            include: [
              {
                model: OrderDetail,
                include: [
                  {
                    model: OrderDetailPujaTranslate,
                    where: { locale: locale }
                  }
                ]
              }
            ]
          },
          {
            model: OrderDetailPackageTranslate,
          },
          {
            model: OrderDetailKitPackageTranslate,
          },
          {
            model: OrderDetailPackageDetail,
            include: [
              {
                model: OrderDetailPackageDetailTranslate,
                where: { locale: locale },
              },
              {
                model: OrderDetailPackageDetailItem,
                include: [
                  {
                    model: OrderDetailPackageDetailItemTranslate,
                    where: { locale: locale },
                  },
                ],
              },
            ],
          },
        ],
      });

      return { datas };
    } catch (e: any) {
      return { error: e };
    }
  }

  async removeCarts(req) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    try {
      if (user) {
        await Booking.destroy({ where: { user_id: user.dataValues.id } });
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  async downloadInvoice(req) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    let id = req.params.id;
    const locale = req.params.locale ? req.params.locale : "en";

    try {
      if (user) {
        const order = await Order.findAll({
          where: { user_id: user.dataValues.id, id: id },
          include: [
            {
              model: OrderDetail,
              attributes: [
                "id",
                "order_id",
                "puja_id",
                "package_id",
                "puja_kit_id",
                "samagri_package_id",
                "astrology_product_id",
                "astrology_product_variation_id",
                "tour_id",
                "image",
                "thumb_image",
                "carat",
                "total",
                "date",
                "time",
                "is_live",
                "visiting_date",
                "meeting_id",
                "meeting_url",
                "status",
                "type",
              ],
              include: [
                {
                  model: Puja,
                  include: [
                    {
                      model: PujaTranslate,
                      where: {locale: locale}
                    }
                  ]
                },
                {
                  model: OrderDetailKundli,
                },
                {
                  model: OrderDetailMatch,
                },
                {
                  model: OrderDetailSession
                },
                {
                  model: OrderDetailPackageDetail,
                  include:[
                    {
                      model: OrderDetailPackageDetailTranslate,
                      where: {locale: locale}
                    }
                  ]
                },
                {
                  model: OrderDetailSamagriPackage,
                  include: [
                    {
                      model: OrderDetailSamagriPackageTranslate,
                      where: { locale: locale },
                    },
                  ],
                },
                {
                  model: PujaKit,
                  include: [
                    {
                      model: PujaKitTranslate,
                      where: {locale: locale}
                    }
                  ]
                },
                {
                  model: AstrologyProduct,
                  include: [
                    {
                      model: AstrologyProductTranslate,
                      where: { locale: locale },
                    },
                    {
                      model: AstrologyProductVariation,
                    },
                  ],
                },
                {
                  model: Tour,
                },
              ],
            },
            {
              model: UserAddress,
            },
            {
              model: User,
            },
          ],
        });
        const setting = await Setting.findAll();
        // console.log(setting)
        // return locale == 'en' ? InvoiceTemplate(order, setting) : InvoiceTemplateHi(order, setting)
        return InvoiceTemplate(order, setting);
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  // async addToOrder(req) {
  //   let user;
  //   let total: number = 0;
  //   let orderNumber = "";
  //   let roundedTotal: number;
  //   const locale = req.params.locale ? req.params.locale : "en";
  //   let input = req.body;
  //   let decodedToken;
  //   const now = new Date();
  //   const currentFormattedDate = date.format(now, "YYYY-MM-DD HH:mm:ss");
  //   //try {
  //     if (req.headers.authorization) {
  //       const jwtString = req.headers.authorization.split(" ")[1];
  //       decodedToken = jwt.decode(jwtString);
  //       user = await User.findOne({ where: { id: decodedToken.id } });
  //     }
  //     const setting = await Setting.findOne({ where: { id: 1 } });
  //     const res: any = await Booking.findAll({
  //       where: { user_id: user.dataValues.id },
  //       attributes: [
  //         "id",
  //         "type",
  //         "user_id",
  //         "puja_id",
  //         "user_address_id",
  //         "package_id",
  //         "puja_kit_id",
  //         "samagri_package_id",
  //         "astrology_product_id",
  //         "astrology_product_variation_id",
  //         "tour_id",
  //         "price",
  //         "quantity",
  //         "carat",
  //         "image",
  //         "total",
  //         "date",
  //         "time",
  //         "location_id",
  //         "language_id"
  //       ],
  //       include: [
  //         {
  //           model: UserAddress,
  //           attributes: ["id", "address", "phone", "alternate_phone", "state", "pincode", "first_name"],
  //         },
  //         {
  //           model: AstrologyProduct,
  //           attributes: ["id", "image", "price", "type"],
  //           include: [
  //             {
  //               model: AstrologyProductTranslate,
  //               attributes: [
  //                 "id",
  //                 "astrology_product_id",
  //                 "title",
  //                 "slug",
  //                 "locale",
  //                 "description",
  //               ],
  //               where: {
  //                 locale: locale,
  //               },
  //             },
  //             {
  //               model: AstrologyProductVariation,
  //               attributes: [
  //                 "id",
  //                 "astrology_product_id",
  //                 "carat",
  //                 "price",
  //                 "discounted_price",
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           model: BookingSession,
  //           attributes: [
  //             "id",
  //             "booking_id",
  //             "name",
  //             "email",
  //             "phone",
  //             "date_of_birth",
  //             "time",
  //             "city",
  //             "state",
  //             "country",
  //             "gender",
  //             "booking_date",
  //             "booking_time",
  //             "comment",
  //             "status",
  //           ],
  //         },
  //         {
  //           model: BookingKundali,
  //           attributes: [
  //             "id",
  //             "booking_id",
  //             "name",
  //             "email",
  //             "phone",
  //             "date_of_birth",
  //             "time",
  //             "city",
  //             "state",
  //             "country",
  //             "gender",
  //             "status",
  //           ],
  //         },
  //         {
  //           model: BookingMatch,
  //           attributes: [
  //             "id",
  //             "booking_id",
  //             "boy_name",
  //             "girl_name",
  //             "girl_dob",
  //             "girl_birth_time",
  //             "email",
  //             "phone",
  //             "boy_dob",
  //             "boy_birth_time",
  //             "comment",
  //             "status",
  //             "booking_date",
  //             "booking_time"
  //           ],
  //         },
  //         {
  //           model: Puja,
  //           attributes: ["id", "image"],
  //           include: [
  //             {
  //               model: PujaTranslate,
  //               attributes: ["id", "title", "locale"],
  //             },
  //           ],
  //         },
  //         {
  //           model: Package,
  //           attributes: ["id", "price"],
  //           include: [
  //             {
  //               model: PackageTranslate,
  //               attributes: ["id", "title", "locale"],
  //             },
  //           ],
  //         },
  //         {
  //           model: Location,
  //           attributes: ["id", "image"],
  //           include: [
  //             {
  //               model: LocationTranslate,
  //               attributes: ["id", "title", "locale"],
  //               where: {
  //                 locale: locale,
  //               },
  //             },
  //           ],
  //         },
  //         {
  //           model: BookingPackageDetail,
  //           include: [
  //             {
  //               model: PackageDetail,
  //               include: [{ model: PackageDetailTranslate }],
  //             },
  //             {
  //               model: BookingPackageDetailItem,
  //               include: [
  //                 {
  //                   model: PackageDetailItem,
  //                   include: [{ model: PackageDetailItemTranslate }],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           model: SamagriPackage,
  //           include: [
  //             {
  //               model: SamagriPackageTranslate,
  //               attributes: ["id", "title", "locale"],
  //             },
  //           ],
  //         },
  //         {
  //           model: BookingSamagriPackageDetail,
  //           attributes: [
  //             "id",
  //             "booking_id",
  //             "samagri_package_detail_id",
  //             "price",
  //             "item_selectable",
  //             "is_required",
  //           ],
  //           include: [
  //             {
  //               model: SamagriPackageDetail,
  //               attributes: ["id", "price", "is_required", "item_selectable"],
  //               include: [
  //                 {
  //                   model: SamagriPackageDetailTranslate,
  //                   attributes: ["id", "title", "locale"],
  //                 },
  //               ],
  //             },
  //             {
  //               model: BookingSamagriPackageDetailItem,
  //               attributes: [
  //                 "id",
  //                 "booking_sm_pck_detail_id",
  //                 "samagri_id",
  //                 "type",
  //               ],
  //               include: [
  //                 {
  //                   model: Samagri,
  //                   attributes: ["id", "quantity", "price"],
  //                   include: [
  //                     {
  //                       model: SamagriTranslate,
  //                       attributes: ["id", "title", "locale"],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           model: Tour,
  //           include: [
  //             {
  //               model: TourTranslate,
  //             },
  //           ],
  //         },
  //         {
  //           model: BookingTourDetail,
  //           attributes: [
  //             "id",
  //             "booking_id",
  //             "tour_detail_id",
  //             "price",
  //             "item_selectable",
  //             "is_required",
  //           ],
  //           include: [
  //             {
  //               model: TourDetail,
  //               attributes: [
  //                 "id",
  //                 "tour_id",
  //                 "price",
  //                 "is_required",
  //                 "item_selectable",
  //               ],
  //               include: [
  //                 {
  //                   model: TourDetailTranslate,
  //                   attributes: ["id", "title", "locale"],
  //                 },
  //               ],
  //             },
  //             {
  //               model: BookingTourDetailItem,
  //               attributes: [
  //                 "id",
  //                 "booking_tour_detail_id",
  //                 "tour_detail_item_id",
  //                 "quantity",
  //                 "price",
  //               ],
  //               include: [
  //                 {
  //                   model: TourDetailItem,
  //                   attributes: ["id", "tour_detail_id", "quantity", "price"],
  //                   include: [
  //                     {
  //                       model: TourDetailItemTranslate,
  //                       attributes: [
  //                         "id",
  //                         "tour_detail_item_id",
  //                         "title",
  //                         "locale",
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (res) {
  //       /*res.map((element) => {
  //         total = total + element.dataValues.total;
  //       });

  //       total += setting.dataValues.shipping_charge;
  //       roundedTotal = Number(total.toFixed(2))
  //       */

  //       const order = await Order.create({
  //         user_id: decodedToken.id,
  //         name: res && res[0].dataValues.UserAddress.dataValues.first_name,
  //         address: res && res[0].dataValues.UserAddress.dataValues.address,
  //         phone: res && res[0].dataValues.UserAddress.dataValues.phone,
  //         alternate_phone: res && res[0].dataValues.UserAddress.dataValues.alternate_phone,
  //         user_address_id: res && res[0].dataValues.user_address_id,
  //         total: roundedTotal,
  //         shipping_amount: setting.dataValues.shipping_charge,
  //         status: 0,
  //         pincode: res && res[0].dataValues.UserAddress.dataValues.pincode,
  //         state: res && res[0].dataValues.UserAddress.dataValues.state,
  //         order_date: currentFormattedDate, //not sure
  //         createdAt: currentFormattedDate,
  //         updatedAt: currentFormattedDate,
  //         deletedAt: null,
  //       });

  //       orderNumber = "ORD-" + String(order.dataValues.id).padStart(6, "0");

  //       res.map(async (data) => {
  //         switch (data.dataValues.type) {
  //           case 1:
  //             let getPackage = await Package.findOne({
  //               where: { id: data.dataValues.package_id },
  //               include: [
  //                 {
  //                   model: Puja,
  //                   include: [{ model: PujaTranslate }],
  //                 },
  //                 {
  //                   model: PackageTranslate,
  //                   attributes: ["id", "title", "locale", "description"],
  //                 },
  //                 {
  //                   model: PackageDetail,
  //                   attributes: [
  //                     "id",
  //                     "package_id",
  //                     "type",
  //                     "price",
  //                     "is_required",
  //                     "item_selectable",
  //                   ],
  //                   include: [
  //                     {
  //                       model: PackageDetailItem,
  //                       attributes: ["id", "quantity"],
  //                       include: [
  //                         {
  //                           model: PackageDetailItemTranslate,
  //                           attributes: ["id", "title", "locale"],
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   model: Puja,
  //                   include: [
  //                     {
  //                       model: PujaTranslate,
  //                     },
  //                   ],
  //                 },
  //               ],
  //             });
  //             let result = "";
  //             const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //             const charactersLength = characters.length;
  //             let counter = 0;

  //             while (counter < 20) {
  //               result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //               counter += 1;
  //             }

  //             if (getPackage && order && data["BookingPackageDetails"].length > 0) {
  //               let live = data["BookingPackageDetails"][2] && data["BookingPackageDetails"][2]["BookingPackageDetailItems"][0] && data["BookingPackageDetails"][2]["BookingPackageDetailItems"][0]["PackageDetailItem"].is_live == 1 ? 1 : 0;

  //               let liveDate: any = new Date(data.dataValues.date).toLocaleDateString('en-GB')+" "+new Date(data.dataValues.date).toLocaleTimeString('en-GB')
  //               console.log(data.dataValues.date)
  //               let detail = await OrderDetail.create({
  //                 order_id: order.dataValues.id,
  //                 puja_id: getPackage.dataValues.puja_id,
  //                 package_id: input.package_id,
  //                 type: 1,
  //                 status: 0,
  //                 date: liveDate,
  //                 location_id: data['Location'].dataValues.id,
  //                 language_id: data.dataValues.language_id,
  //                 total: data.dataValues.total,
  //                 image: getPackage["Puja"] ? getPackage["Puja"].dataValues.image : "",
  //                 is_live: live,
  //                 meeting_id: live == 1 ? result : "",
  //                 meeting_url: live == 1 ? "https://dev.pujapathbooking.com/live-streaming/" + result : "",
  //                 createdAt: currentFormattedDate,
  //                 updatedAt: currentFormattedDate,
  //                 deletedAt: null,
  //               });

  //               if (detail) {
  //                 for (let i = 0; i < getPackage["Puja"]["PujaTranslates"].length; i++) {
  //                   let pujaTranslateElement = getPackage["Puja"]["PujaTranslates"][i];
  //                   await OrderDetailPujaTranslate.create({
  //                     order_detail_id: detail.dataValues.id,
  //                     locale: pujaTranslateElement.dataValues.locale,
  //                     title: pujaTranslateElement.dataValues.title,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });
  //                 }

  //                 for (let i = 0; i < data["Package"]["PackageTranslates"].length; i++) {
  //                   let packageTranslateElement = data["Package"]["PackageTranslates"][i];
  //                   await OrderDetailPackageTranslate.create({
  //                     order_detail_id: detail.dataValues.id,
  //                     locale: packageTranslateElement.dataValues.locale,
  //                     title: packageTranslateElement.dataValues.title,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });
  //                 }

  //                 for (let i = 0;i < data["BookingPackageDetails"].length;i++) {
  //                   let bookingPackageDetailElement = data["BookingPackageDetails"][i];

  //                   let orderPackagedetail = await OrderDetailPackageDetail.create({
  //                     order_detail_id: detail.dataValues.id,
  //                     price: bookingPackageDetailElement.dataValues.price,
  //                     is_required: bookingPackageDetailElement.dataValues.is_required,
  //                     item_selectable: bookingPackageDetailElement.dataValues.item_selectable,
  //                     pandit_required: bookingPackageDetailElement.dataValues.pandit_required,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });

  //                   if (orderPackagedetail) {
  //                     if (bookingPackageDetailElement["PackageDetail"]["PackageDetailTranslates"]) {
  //                       for (let j = 0; j < bookingPackageDetailElement["PackageDetail"]["PackageDetailTranslates"].length; j++) {
  //                         let packageDetailTranslateElement = bookingPackageDetailElement["PackageDetail"]["PackageDetailTranslates"][j];
  //                         await OrderDetailPackageDetailTranslate.create({
  //                           ord_dt_pck_detail_id: orderPackagedetail.dataValues.id,
  //                           title: packageDetailTranslateElement.dataValues.title,
  //                           locale: packageDetailTranslateElement.dataValues.locale,
  //                           createdAt: currentFormattedDate,
  //                           updatedAt: currentFormattedDate,
  //                           deletedAt: null,
  //                         });
  //                       }
  //                     }

  //                     if (bookingPackageDetailElement["BookingPackageDetailItems"]) {
  //                       for (let j = 0; j < bookingPackageDetailElement["BookingPackageDetailItems"].length;j++) {
  //                         let packageDetailItemElement = bookingPackageDetailElement["BookingPackageDetailItems"][j];
  //                         let getOrderDetailPackageDetailItem = await OrderDetailPackageDetailItem.create({
  //                             ord_dt_pck_detail_id: orderPackagedetail.dataValues.id,
  //                             price: packageDetailItemElement.dataValues.price,
  //                             quantity: packageDetailItemElement.dataValues.quantity,
  //                             createdAt: currentFormattedDate,
  //                             updatedAt: currentFormattedDate,
  //                             deletedAt: null,
  //                           });

  //                         total = total + packageDetailItemElement.dataValues.price;

  //                         if (getOrderDetailPackageDetailItem && packageDetailItemElement["PackageDetailItem"]["PackageDetailItemTranslates"]) {
  //                           for (let k = 0; k < packageDetailItemElement["PackageDetailItem"]["PackageDetailItemTranslates"].length; k++) {
  //                             let packageDetailTranslateElement = packageDetailItemElement["PackageDetailItem"]["PackageDetailItemTranslates"][k];
  //                             const itemTranslate = await OrderDetailPackageDetailItemTranslate.create({
  //                                 ord_dt_pck_dt_item_id: getOrderDetailPackageDetailItem.dataValues.id,
  //                                 title:packageDetailTranslateElement.dataValues.title,
  //                                 locale: packageDetailTranslateElement.dataValues.locale,
  //                                 createdAt: currentFormattedDate,
  //                                 updatedAt: currentFormattedDate,
  //                                 deletedAt: null,
  //                               });
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             break;
  //           case 2:
  //             if (data["BookingSamagriPackageDetails"]) {
  //               let getSamagriPackage = await SamagriPackage.findOne({
  //                 where: { id: data.dataValues.samagri_package_id },
  //                 include: [
  //                   {
  //                     model: SamagriPackageTranslate,
  //                     attributes: [
  //                       "id",
  //                       "samagri_package_id",
  //                       "locale",
  //                       "title",
  //                     ],
  //                   },
  //                   {
  //                     model: PujaKit,
  //                     include: [
  //                       {
  //                         model: PujaKitTranslate,
  //                       },
  //                     ],
  //                   },
  //                 ],
  //               });

  //               if (getSamagriPackage) {
  //                 let orderDetail = await OrderDetail.create({
  //                   order_id: order.dataValues.id,
  //                   puja_kit_id: getSamagriPackage.dataValues.puja_kit_id,
  //                   samagri_package_id: getSamagriPackage.dataValues.id,
  //                   type: 2,
  //                   status: 0,
  //                   total: data.dataValues.total,
  //                   image: getSamagriPackage.dataValues.image,
  //                   createdAt: currentFormattedDate,
  //                   updatedAt: currentFormattedDate,
  //                   deletedAt: null,
  //                 });

  //                 if (orderDetail) {
  //                   let pujaKit = await OrderDetailPujaKit.create({
  //                     order_detail_id: orderDetail.dataValues.id,
  //                     image: getSamagriPackage["PujaKit"].image,
  //                     is_show: getSamagriPackage["PujaKit"].is_show,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });

  //                   for (var j = 0; j < data["SamagriPackage"]["SamagriPackageTranslates"].length; j++) {
  //                     let packageSamagriTranslateElement = data["SamagriPackage"]["SamagriPackageTranslates"][j];
  //                     await OrderDetailKitPackageTranslate.create({
  //                       ord_dt_id: orderDetail.dataValues.id,
  //                       title: packageSamagriTranslateElement.dataValues.title,
  //                       locale:packageSamagriTranslateElement.dataValues.locale,
  //                       createdAt: currentFormattedDate,
  //                       updatedAt: currentFormattedDate,
  //                       deletedAt: null,
  //                     });
  //                   }

  //                   for (var j = 0; j < getSamagriPackage["PujaKit"]["PujaKitTranslates"].length; j++) {
  //                     let pujaKitTranslateElement = getSamagriPackage["PujaKit"]["PujaKitTranslates"][j];
  //                     await OrderDetailPujaKitTranslate.create({
  //                       ord_dt_pu_kit_id: pujaKit.dataValues.id,
  //                       title: pujaKitTranslateElement.dataValues.title,
  //                       locale: pujaKitTranslateElement.dataValues.locale,
  //                       createdAt: currentFormattedDate,
  //                       updatedAt: currentFormattedDate,
  //                       deletedAt: null,
  //                     });
  //                   }

  //                   for (var i = 0; i < data["BookingSamagriPackageDetails"].length; i++) {
  //                     let bookingSamagriPackageDetailElement = data["BookingSamagriPackageDetails"][i];
  //                     let samagriPackage = await OrderDetailSamagriPackage.create({
  //                         order_detail_id: orderDetail.dataValues.id,
  //                         price:bookingSamagriPackageDetailElement.dataValues.price,
  //                         createdAt: currentFormattedDate,
  //                         updatedAt: currentFormattedDate,
  //                         deletedAt: null,
  //                       });

  //                     if (samagriPackage && bookingSamagriPackageDetailElement["SamagriPackageDetail"]["SamagriPackageDetailTranslates"]) {
  //                       for (var j = 0; j < bookingSamagriPackageDetailElement["SamagriPackageDetail"]["SamagriPackageDetailTranslates"].length;j++) {
  //                         let bookingSamagriPackageDetailTranslateElement = bookingSamagriPackageDetailElement["SamagriPackageDetail"]["SamagriPackageDetailTranslates"][j];
  //                         await OrderDetailSamagriPackageTranslate.create({
  //                           ord_dt_sm_package_id: samagriPackage.dataValues.id,
  //                           title:bookingSamagriPackageDetailTranslateElement.dataValues.title,
  //                           locale:bookingSamagriPackageDetailTranslateElement.dataValues.locale,
  //                           createdAt: currentFormattedDate,
  //                           updatedAt: currentFormattedDate,
  //                           deletedAt: null,
  //                         });
  //                       }
  //                     }

  //                     if (bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"]) {
  //                       for (
  //                         var j = 0; j < bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"].length; j++) {
  //                         let bookingSamagriPackageDetailItemElement = bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"][j];
  //                         let samagriItem = await OrderDetailSamagriPackageItem.create({
  //                             ord_dt_sm_package_id:samagriPackage.dataValues.id,
  //                             price: bookingSamagriPackageDetailItemElement.dataValues.Samagri.dataValues.price,
  //                             quantity:bookingSamagriPackageDetailItemElement.dataValues.Samagri.dataValues.quantity,
  //                             createdAt: currentFormattedDate,
  //                             updatedAt: currentFormattedDate,
  //                             deletedAt: null,
  //                           });

  //                         total = total + bookingSamagriPackageDetailItemElement.dataValues.Samagri.dataValues.price;

  //                         if (samagriItem && bookingSamagriPackageDetailItemElement["Samagri"]["SamagriTranslates"]) {
  //                           for (var k = 0; k < bookingSamagriPackageDetailItemElement["Samagri"]["SamagriTranslates"].length; k++) {
  //                             let samagriTranslateElement = bookingSamagriPackageDetailItemElement["Samagri"]["SamagriTranslates"][k];
  //                             await OrderDetailSamagriPackageItemTranslate.create({
  //                                 ord_dt_sm_pck_it_id:samagriItem.dataValues.id,
  //                                 title:samagriTranslateElement.dataValues.title,
  //                                 locale:samagriTranslateElement.dataValues.locale,
  //                                 createdAt: currentFormattedDate,
  //                                 updatedAt: currentFormattedDate,
  //                                 deletedAt: null,
  //                               }
  //                             );
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             break;
  //           case 3:
  //             let astrologyProductdetail;
  //             let getAstrology = await AstrologyProduct.findOne({where: {id: data.dataValues.astrology_product_id},
  //               include: [
  //                 {model: AstrologyProductTranslate},
  //                 {model: AstrologyProductVariation}
  //               ]
  //             });

  //             if (getAstrology && order) {
  //               if(getAstrology.dataValues.type == 2) {
  //                 let getAstrologyProductVariation = await AstrologyProductVariation.findOne({where: {id: data.dataValues.astrology_product_variation_id}});

  //                 if(getAstrologyProductVariation){
  //                   total = total + getAstrologyProductVariation.dataValues.price;
  //                 }
  //                 else {
  //                   await Booking.destroy({ where: { astrology_product_variation_id: getAstrologyProductVariation.dataValues.id }});
  //                 }
  //               }
  //               else {
  //                 total = total + getAstrology.dataValues.price;
  //               }
  //               astrologyProductdetail = await OrderDetail.create({
  //                 order_id: order.dataValues.id,
  //                 astrology_product_id: data.dataValues.astrology_product_id,
  //                 astrology_product_variation_id: data.dataValues.astrology_product_variation_id ? data.dataValues.astrology_product_variation_id : null,
  //                 type: 3,
  //                 status: 0,
  //                 image: getAstrology.dataValues.image,
  //                 carat: data.dataValues.carat,
  //                 total: data.dataValues.total,
  //                 createdAt: currentFormattedDate,
  //                 updatedAt: currentFormattedDate,
  //                 deletedAt: null,
  //               });

  //               getAstrology["AstrologyProductTranslates"].map(async (e) => {
  //                 e["AstrologyProductVariations"]
  //                   ? e["AstrologyProductVariations"].map(async (v) => {
  //                     await OrderDetailAstrologyProductTranslate.create({
  //                       ord_dt_id: astrologyProductdetail.dataValues.id,
  //                       title: e.title,
  //                       locale: e.locale,
  //                     });
  //                   })
  //                   : await OrderDetailAstrologyProductTranslate.create({
  //                     ord_dt_id: astrologyProductdetail.dataValues.id,
  //                     title: e.title,
  //                     locale: e.locale,
  //                   });
  //               });
  //             }
  //             else {
  //               await Booking.destroy({ where: { astrology_product_id: data.dataValues.astrology_product_id }});
  //             }
  //             break;
  //           case 4:
  //             if (data["BookingTourDetails"]) {
  //               if (data["Tour"]) {
  //                 let getTour = await Tour.findOne({where: { id: data.dataValues.tour_id }});

  //                 if (getTour) {
  //                   let orderDetail = await OrderDetail.create({
  //                     order_id: order.dataValues.id,
  //                     tour_id: getTour.dataValues.id,
  //                     type: 4,
  //                     status: 0,
  //                     total: data.dataValues.total,
  //                     image: getTour.dataValues.image,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });

  //                   let tour = await OrderDetailTour.create({
  //                     location_id: getTour.dataValues.location_id,
  //                     order_detail_id: orderDetail.dataValues.id,
  //                     address: getTour.dataValues.address,
  //                     createdAt: currentFormattedDate,
  //                     updatedAt: currentFormattedDate,
  //                     deletedAt: null,
  //                   });

  //                   if (tour) {
  //                     for (var k = 0; k < data["Tour"]["TourTranslates"].length;k++) {
  //                       let tourTranslateElement = data["Tour"]["TourTranslates"][k];
  //                       OrderDetailTourTranslate.create({
  //                         ord_dt_tour_id: tour.dataValues.id,
  //                         title: tourTranslateElement.dataValues.title,
  //                         locale: tourTranslateElement.dataValues.locale,
  //                         createdAt: currentFormattedDate,
  //                         updatedAt: currentFormattedDate,
  //                         deletedAt: null,
  //                       });
  //                     }

  //                     for (var i = 0; i < data["BookingTourDetails"].length; i++) {
  //                       let getTour = await Tour.findOne({
  //                         where: { id: data.dataValues.tour_id },
  //                         include: [
  //                           {
  //                             model: TourTranslate,
  //                           },
  //                           {
  //                             model: TourDetail,
  //                             include: [
  //                               {
  //                                 model: TourDetailTranslate,
  //                               },
  //                               {
  //                                 model: TourDetailItem,
  //                                 include: [
  //                                   {
  //                                     model: TourDetailItemTranslate,
  //                                   },
  //                                 ],
  //                               },
  //                             ],
  //                           },
  //                         ],
  //                       });

  //                       if (getTour && tour && orderDetail) {
  //                         let getBookingTourDetailElement = data["BookingTourDetails"][i];

  //                         let orderDetailTourDetail = await OrderDetailTourDetail.create({
  //                             ord_dt_tour_id: tour.dataValues.id,
  //                             price:getBookingTourDetailElement.dataValues.price,
  //                             is_required:getBookingTourDetailElement.dataValues.is_required,
  //                             item_selectable:getBookingTourDetailElement.dataValues.item_selectable,
  //                             createdAt: currentFormattedDate,
  //                             updatedAt: currentFormattedDate,
  //                             deletedAt: null,
  //                           });

  //                         if (orderDetailTourDetail) {
  //                           let tourDetailTotal = 0;
  //                           for (var j = 0;j < getBookingTourDetailElement["TourDetail"]["TourDetailTranslates"].length;j++) {
  //                             let tourDetailTranslateElement = getBookingTourDetailElement["TourDetail"]["TourDetailTranslates"][j];
  //                             await OrderDetailTourDetailTranslate.create({
  //                               ord_dt_tr_dt_id: orderDetailTourDetail.dataValues.id,
  //                               title: tourDetailTranslateElement.dataValues.title,
  //                               locale: tourDetailTranslateElement.dataValues.locale,
  //                               createdAt: currentFormattedDate,
  //                               updatedAt: currentFormattedDate,
  //                               deletedAt: null,
  //                             });
  //                           }

  //                           for (var j = 0;j < getBookingTourDetailElement["BookingTourDetailItems"].length;j++) {
  //                             let tourDetailTranslateElement = getBookingTourDetailElement["BookingTourDetailItems"][j];
  //                             let orderDetailTourDetailItem = await OrderDetailTourDetailItem.create({
  //                                 ord_dt_tr_dt_id:orderDetailTourDetail.dataValues.id,
  //                                 quantity:tourDetailTranslateElement.dataValues.quantity,
  //                                 price:tourDetailTranslateElement.dataValues.price,
  //                                 createdAt: currentFormattedDate,
  //                                 updatedAt: currentFormattedDate,
  //                                 deletedAt: null,
  //                               });

  //                             tourDetailTotal += tourDetailTranslateElement.dataValues.price;

  //                             if (orderDetailTourDetailItem) {
  //                               for (var k = 0; k < tourDetailTranslateElement["TourDetailItem"]["TourDetailItemTranslates"].length; k++) {
  //                                 let tourDetailItemTranslateElement = tourDetailTranslateElement["TourDetailItem"]["TourDetailItemTranslates"][k];
  //                                 await OrderDetailTourDetailItemTranslate.create({
  //                                     ord_dt_tr_dt_it_id: orderDetailTourDetailItem.dataValues.id,
  //                                     title: tourDetailItemTranslateElement.dataValues.title,
  //                                     locale:tourDetailItemTranslateElement.dataValues.locale,
  //                                     createdAt: currentFormattedDate,
  //                                     updatedAt: currentFormattedDate,
  //                                     deletedAt: null,
  //                                   }
  //                                 );
  //                               }
  //                             }
  //                           }

  //                           await OrderDetailTourDetail.update({ price: tourDetailTotal }, {
  //                               where: {id: orderDetailTourDetail.dataValues.id}
  //                             });

  //                           total = total + tourDetailTotal;
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //             break;
  //           case 5:
  //             if (order && data && data["BookingKundali"]) {
  //               let Kundlidetail = await OrderDetail.create({
  //                 order_id: order.dataValues.id,
  //                 type: 5,
  //                 status: 0,
  //                 total: data.dataValues.total,
  //                 image: data.dataValues.image,
  //                 createdAt: currentFormattedDate,
  //                 updatedAt: currentFormattedDate,
  //                 deletedAt: null,
  //               });

  //               if (Kundlidetail) {
  //                 await OrderDetailKundli.create({
  //                   ord_dt_id: Kundlidetail.dataValues.id,
  //                   first_name: data["BookingKundali"].dataValues.name,
  //                   last_name: data["BookingKundali"].dataValues.name,
  //                   email: data["BookingKundali"].dataValues.email,
  //                   phone: data["BookingKundali"].dataValues.phone,
  //                   date_of_birth:
  //                     data["BookingKundali"].dataValues.date_of_birth,
  //                   time: data["BookingKundali"].dataValues.time,
  //                   city: data["BookingKundali"].dataValues.city,
  //                   state: data["BookingKundali"].dataValues.state,
  //                   country: data["BookingKundali"].dataValues.country,
  //                   gender: data["BookingKundali"].dataValues.gender,
  //                   status: 0,
  //                   createdAt: currentFormattedDate,
  //                   updatedAt: currentFormattedDate,
  //                   deletedAt: null,
  //                 });
  //               }
  //             }
  //             break;
  //           case 6:
  //             if (order && data && data["BookingSession"]) {
  //               let sessiondetail = await OrderDetail.create({
  //                 order_id: order.dataValues.id,
  //                 type: 6,
  //                 status: 0,
  //                 total: data.dataValues.total,
  //                 image: data.dataValues.image,
  //                 createdAt: currentFormattedDate,
  //                 updatedAt: currentFormattedDate,
  //                 deletedAt: null,
  //               });

  //               if (sessiondetail) {
  //                 await OrderDetailSession.create({
  //                   ord_dt_id: sessiondetail.dataValues.id,
  //                   name: data["BookingSession"].dataValues.name,
  //                   email: data["BookingSession"].dataValues.email,
  //                   phone: data["BookingSession"].dataValues.phone,
  //                   date_of_birth:
  //                     data["BookingSession"].dataValues.date_of_birth,
  //                   time: data["BookingSession"].dataValues.time,
  //                   city: data["BookingSession"].dataValues.city,
  //                   state: data["BookingSession"].dataValues.state,
  //                   country: data["BookingSession"].dataValues.country,
  //                   gender: data["BookingSession"].dataValues.gender,
  //                   booking_date:
  //                     data["BookingSession"].dataValues.booking_date,
  //                   comment: data["BookingSession"].dataValues.comment,
  //                   status: 0,
  //                   booking_time:
  //                     data["BookingSession"].dataValues.booking_time,
  //                   createdAt: currentFormattedDate,
  //                   updatedAt: currentFormattedDate,
  //                   deletedAt: null,
  //                 });
  //               }

  //               total += setting.dataValues.session_amount;
  //             }
  //             break;
  //           case 7:
  //             if (order && data && data["BookingMatch"]) {
  //               let Matchdetail = await OrderDetail.create({
  //                 order_id: order.dataValues.id,
  //                 type: 7,
  //                 status: 0,
  //                 total: data.dataValues.total,
  //                 image: data.dataValues.image,
  //                 createdAt: currentFormattedDate,
  //                 updatedAt: currentFormattedDate,
  //                 deletedAt: null,
  //               });

  //               if (Matchdetail) {
  //                 await OrderDetailMatch.create({
  //                   ord_dt_id: Matchdetail.dataValues.id,
  //                   boy_name: data["BookingMatch"].dataValues.boy_name,
  //                   girl_name: data["BookingMatch"].dataValues.girl_name,
  //                   email: data["BookingMatch"].dataValues.email,
  //                   phone: data["BookingMatch"].dataValues.phone,
  //                   boy_dob: data["BookingMatch"].dataValues.boy_dob,
  //                   boy_birth_time:
  //                     data["BookingMatch"].dataValues.boy_birth_time,
  //                   girl_dob: data["BookingMatch"].dataValues.girl_dob,
  //                   girl_birth_time:
  //                     data["BookingMatch"].dataValues.girl_birth_time,
  //                   comment: data["BookingMatch"].dataValues.comment,
  //                   booking_date: data["BookingMatch"].dataValues.booking_date,
  //                   booking_time: data["BookingMatch"].dataValues.booking_time,
  //                   girl_birth_place: data["BookingMatch"].dataValues.girl_birth_place,
  //                   boy_birth_place: data["BookingMatch"].dataValues.boy_birth_place,
  //                   status: 0,
  //                   createdAt: currentFormattedDate,
  //                   updatedAt: currentFormattedDate,
  //                   deletedAt: null,
  //                 });
  //               }
  //             }
  //             break;
  //         }
  //       });

  //       await Order.update(
  //         { order_id: orderNumber, total: total},
  //         { where: { id: order.dataValues.id } }
  //       );
  //     }

  //     // razorpay create order
  //    //console.log(roundedTotal)
  //     let razorpayOrder = await instance.orders.create({
  //       amount: total ,
  //       currency: "INR",
  //       receipt: orderNumber,
  //     });
  //     // return {
  //     //   total: roundedTotal,
  //     //   orderNumber: orderNumber,
  //     //   razorpayOrder: {
  //     //     amount: roundedTotal ,
  //     //     currency: "INR",
  //     //     receipt: orderNumber,
  //     //   },
  //     //};
  //     return {
  //       total: roundedTotal,
  //       orderNumber: orderNumber,
  //       razorpayOrder: razorpayOrder
  //     }
  //   // } catch (e: any) {
  //   //   return { error: e };
  //   // }
  // }

  async addToOrder(req) {
    let user;
    let total: number = 0;
    let orderNumber = "";

    const locale = req.params.locale ? req.params.locale : "en";
    let input = req.body;
    let decodedToken;
    const now = new Date();
    const currentFormattedDate = date.format(now, "YYYY-MM-DD HH:mm:ss");
    try {
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(" ")[1];
        decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      const setting = await Setting.findOne({ where: { id: 1 } });
      const res = await Booking.findAll({
        where: { user_id: user.dataValues.id },
        attributes: [
          "id",
          "type",
          "user_id",
          "puja_id",
          "user_address_id",
          "package_id",
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
          "time",
          "location_id",
          "language_id"
        ],
        include: [
          {
            model: UserAddress,
            attributes: ["id", "address"],
          },
          {
            model: AstrologyProduct,
            attributes: ["id", "image", "price", "type"],
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
                where: {
                  locale: locale,
                },
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
              },
            ],
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
              "status",
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
              "status",
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
              "booking_date",
              "booking_time"
            ],
          },
          {
            model: Puja,
            attributes: ["id", "image"],
            include: [
              {
                model: PujaTranslate,
                attributes: ["id", "title", "locale"],
              },
            ],
          },
          {
            model: Package,
            attributes: ["id", "price"],
            include: [
              {
                model: PackageTranslate,
                attributes: ["id", "title", "locale"],
              },
            ],
          },
          {
            model: Location,
            attributes: ["id", "image"],
            include: [
              {
                model: LocationTranslate,
                attributes: ["id", "title", "locale"],
                where: {
                  locale: locale,
                },
              },
            ],
          },
          {
            model: BookingPackageDetail,
            include: [
              {
                model: PackageDetail,
                include: [{ model: PackageDetailTranslate }],
              },
              {
                model: BookingPackageDetailItem,
                include: [
                  {
                    model: PackageDetailItem,
                    include: [{ model: PackageDetailItemTranslate }],
                  },
                ],
              },
            ],
          },
          {
            model: SamagriPackage,
            include: [
              {
                model: SamagriPackageTranslate,
                attributes: ["id", "title", "locale"],
              },
            ],
          },
          {
            model: BookingSamagriPackageDetail,
            attributes: [
              "id",
              "booking_id",
              "samagri_package_detail_id",
              "price",
              "item_selectable",
              "is_required",
            ],
            include: [
              {
                model: SamagriPackageDetail,
                attributes: ["id", "price", "is_required", "item_selectable"],
                include: [
                  {
                    model: SamagriPackageDetailTranslate,
                    attributes: ["id", "title", "locale"],
                  },
                ],
              },
              {
                model: BookingSamagriPackageDetailItem,
                attributes: [
                  "id",
                  "booking_sm_pck_detail_id",
                  "samagri_id",
                  "type",
                ],
                include: [
                  {
                    model: Samagri,
                    attributes: ["id", "quantity", "price"],
                    include: [
                      {
                        model: SamagriTranslate,
                        attributes: ["id", "title", "locale"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: Tour,
            include: [
              {
                model: TourTranslate,
              },
            ],
          },
          {
            model: BookingTourDetail,
            attributes: [
              "id",
              "booking_id",
              "tour_detail_id",
              "price",
              "item_selectable",
              "is_required",
            ],
            include: [
              {
                model: TourDetail,
                attributes: [
                  "id",
                  "tour_id",
                  "price",
                  "is_required",
                  "item_selectable",
                ],
                include: [
                  {
                    model: TourDetailTranslate,
                    attributes: ["id", "title", "locale"],
                  },
                ],
              },
              {
                model: BookingTourDetailItem,
                attributes: [
                  "id",
                  "booking_tour_detail_id",
                  "tour_detail_item_id",
                  "quantity",
                  "price",
                ],
                include: [
                  {
                    model: TourDetailItem,
                    attributes: ["id", "tour_detail_id", "quantity", "price"],
                    include: [
                      {
                        model: TourDetailItemTranslate,
                        attributes: [
                          "id",
                          "tour_detail_item_id",
                          "title",
                          "locale",
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

      if (res) {
        res.map((element) => {
          total = total + element.dataValues.total;
        });

        total += setting.dataValues.shipping_charge;
        const userDetails = await UserAddress.findAll({
          where: { id: res[0].dataValues.user_address_id }
        })
        const order = await Order.create({
          user_id: decodedToken.id,
          user_address_id: res && res[0].dataValues.user_address_id,
          total: total,
          shipping_amount: setting.dataValues.shipping_charge,
          status: 0,
          name:userDetails[0].dataValues['first_name'],
          phone:userDetails[0].dataValues['phone'],
          pincode:userDetails[0].dataValues['pincode'],
          address:userDetails[0].dataValues['address'],
          state:userDetails[0].dataValues['state'],
          order_date: currentFormattedDate,
          createdAt: currentFormattedDate,
          updatedAt: currentFormattedDate,
          deletedAt: null,
        });

        orderNumber = "ORD-" + String(order.dataValues.id).padStart(6, "0");

        await Order.update(
          { order_id: orderNumber },
          { where: { id: order.dataValues.id } }
        );

        res.map(async (data) => {
          switch (data.dataValues.type) {
            case 1:
              let getPackage = await Package.findOne({
                where: { id: data.dataValues.package_id },
                include: [
                  {
                    model: Puja,
                    include: [{ model: PujaTranslate }],
                  },
                  {
                    model: PackageTranslate,
                    attributes: ["id", "title", "locale", "description"],
                  },
                  {
                    model: PackageDetail,
                    attributes: [
                      "id",
                      "package_id",
                      "type",
                      "price",
                      "is_required",
                      "item_selectable",
                    ],
                    include: [
                      {
                        model: PackageDetailItem,
                        attributes: ["id", "quantity"],
                        include: [
                          {
                            model: PackageDetailItemTranslate,
                            attributes: ["id", "title", "locale"],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: Puja,
                    include: [
                      {
                        model: PujaTranslate,
                      },
                    ],
                  },
                ],
              });
              let result = "";
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              const charactersLength = characters.length;
              let counter = 0;
              while (counter < 20) {
                result += characters.charAt(
                  Math.floor(Math.random() * charactersLength)
                );
                counter += 1;
              }

              if (
                getPackage &&
                order &&
                data["BookingPackageDetails"].length > 0
              ) {
                let live =
                  data["BookingPackageDetails"][2] &&
                  data["BookingPackageDetails"][2][
                    "BookingPackageDetailItems"
                  ][0] &&
                  data["BookingPackageDetails"][2][
                    "BookingPackageDetailItems"
                  ][0]["PackageDetailItem"].is_live == 1
                    ? 1
                    : 0;

                    const dbDate = date.format(new Date(data.dataValues.date), 'YYYY-MM-DD HH:mm')
                //let liveDate:any =  new Date(data.dataValues.date).toLocaleDateString('en-GB') + " " + new Date(data.dataValues.date).toLocaleTimeString()
                console.log(dbDate)
                let detail = await OrderDetail.create({
                  order_id: order.dataValues.id,
                  puja_id: getPackage.dataValues.puja_id,
                  package_id: input.package_id,
                  type: 1,
                  status: 0,
                  date: dbDate,
                  location_id: data['Location'].dataValues.id,
                  language_id: data.dataValues.language_id,
                  total: data.dataValues.total,
                  image: getPackage["Puja"]
                    ? getPackage["Puja"].dataValues.image
                    : "",
                  is_live: live,
                  meeting_id: live == 1 ? result : "",
                  meeting_url:
                    live == 1
                      ? "https://dev.pujapathbooking.com/live-streaming/" +
                        result
                      : "",
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null,
                });
                if (detail) {
                  for (
                    let i = 0;
                    i < getPackage["Puja"]["PujaTranslates"].length;
                    i++
                  ) {
                    let pujaTranslateElement =
                      getPackage["Puja"]["PujaTranslates"][i];
                    await OrderDetailPujaTranslate.create({
                      order_detail_id: detail.dataValues.id,
                      locale: pujaTranslateElement.dataValues.locale,
                      title: pujaTranslateElement.dataValues.title,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null,
                    });
                  }

                  for (
                    let i = 0;
                    i < data["Package"]["PackageTranslates"].length;
                    i++
                  ) {
                    let packageTranslateElement =
                      data["Package"]["PackageTranslates"][i];
                    await OrderDetailPackageTranslate.create({
                      order_detail_id: detail.dataValues.id,
                      locale: packageTranslateElement.dataValues.locale,
                      title: packageTranslateElement.dataValues.title,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null,
                    });
                  }

                  for (
                    let i = 0;
                    i < data["BookingPackageDetails"].length;
                    i++
                  ) {
                    let bookingPackageDetailElement =
                      data["BookingPackageDetails"][i];
                    let orderPackagedetail =
                      await OrderDetailPackageDetail.create({
                        order_detail_id: detail.dataValues.id,
                        price: bookingPackageDetailElement.dataValues.price,
                        is_required:
                          bookingPackageDetailElement.dataValues.is_required,
                        item_selectable:
                          bookingPackageDetailElement.dataValues
                            .item_selectable,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null,
                      });

                    if (orderPackagedetail) {
                      if (
                        bookingPackageDetailElement["PackageDetail"][
                          "PackageDetailTranslates"
                        ]
                      ) {
                        for (
                          let j = 0;
                          j <
                          bookingPackageDetailElement["PackageDetail"][
                            "PackageDetailTranslates"
                          ].length;
                          j++
                        ) {
                          let packageDetailTranslateElement =
                            bookingPackageDetailElement["PackageDetail"][
                              "PackageDetailTranslates"
                            ][j];
                          await OrderDetailPackageDetailTranslate.create({
                            ord_dt_pck_detail_id:
                              orderPackagedetail.dataValues.id,
                            title:
                              packageDetailTranslateElement.dataValues.title,
                            locale:
                              packageDetailTranslateElement.dataValues.locale,
                            createdAt: currentFormattedDate,
                            updatedAt: currentFormattedDate,
                            deletedAt: null,
                          });
                        }
                      }

                      if (
                        bookingPackageDetailElement["BookingPackageDetailItems"]
                      ) {
                        for (
                          let j = 0;
                          j <
                          bookingPackageDetailElement[
                            "BookingPackageDetailItems"
                          ].length;
                          j++
                        ) {
                          let packageDetailItemElement =
                            bookingPackageDetailElement[
                              "BookingPackageDetailItems"
                            ][j];
                          let getOrderDetailPackageDetailItem =
                            await OrderDetailPackageDetailItem.create({
                              ord_dt_pck_detail_id:
                                orderPackagedetail.dataValues.id,
                              price: packageDetailItemElement.dataValues.price,
                              quantity:
                                packageDetailItemElement.dataValues.quantity,
                              createdAt: currentFormattedDate,
                              updatedAt: currentFormattedDate,
                              deletedAt: null,
                            });

                          if (
                            getOrderDetailPackageDetailItem &&
                            packageDetailItemElement["PackageDetailItem"][
                              "PackageDetailItemTranslates"
                            ]
                          ) {
                            for (
                              let k = 0;
                              k <
                              packageDetailItemElement["PackageDetailItem"][
                                "PackageDetailItemTranslates"
                              ].length;
                              k++
                            ) {
                              let packageDetailTranslateElement =
                                packageDetailItemElement["PackageDetailItem"][
                                  "PackageDetailItemTranslates"
                                ][k];
                              const itemTranslate =
                                await OrderDetailPackageDetailItemTranslate.create(
                                  {
                                    ord_dt_pck_dt_item_id:
                                      getOrderDetailPackageDetailItem.dataValues
                                        .id,
                                    title:
                                      packageDetailTranslateElement.dataValues
                                        .title,
                                    locale:
                                      packageDetailTranslateElement.dataValues
                                        .locale,
                                    createdAt: currentFormattedDate,
                                    updatedAt: currentFormattedDate,
                                    deletedAt: null,
                                  }
                                );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              break;
            case 2:
              if (data["BookingSamagriPackageDetails"]) {
                let getSamagriPackage = await SamagriPackage.findOne({
                  where: { id: data.dataValues.samagri_package_id },
                  include: [
                    {
                      model: SamagriPackageTranslate,
                      attributes: [
                        "id",
                        "samagri_package_id",
                        "locale",
                        "title",
                      ],
                    },
                    {
                      model: PujaKit,
                      include: [
                        {
                          model: PujaKitTranslate,
                        },
                      ],
                    },
                  ],
                });

                if (getSamagriPackage) {
                  let orderDetail = await OrderDetail.create({
                    order_id: order.dataValues.id,
                    puja_kit_id: getSamagriPackage.dataValues.puja_kit_id,
                    samagri_package_id: getSamagriPackage.dataValues.id,
                    type: 2,
                    status: 0,
                    total: data.dataValues.total,
                    image: getSamagriPackage.dataValues.image,
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null,
                  });

                  if (orderDetail) {
                    let pujaKit = await OrderDetailPujaKit.create({
                      order_detail_id: orderDetail.dataValues.id,
                      image: getSamagriPackage["PujaKit"].image,
                      is_show: getSamagriPackage["PujaKit"].is_show,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null,
                    });

                    for (
                      var j = 0;
                      j <
                      data["SamagriPackage"]["SamagriPackageTranslates"].length;
                      j++
                    ) {
                      let packageSamagriTranslateElement =
                        data["SamagriPackage"]["SamagriPackageTranslates"][j];
                      await OrderDetailKitPackageTranslate.create({
                        ord_dt_id: orderDetail.dataValues.id,
                        title: packageSamagriTranslateElement.dataValues.title,
                        locale:
                          packageSamagriTranslateElement.dataValues.locale,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null,
                      });
                    }

                    for (
                      var j = 0;
                      j <
                      getSamagriPackage["PujaKit"]["PujaKitTranslates"].length;
                      j++
                    ) {
                      let pujaKitTranslateElement =
                        getSamagriPackage["PujaKit"]["PujaKitTranslates"][j];
                      await OrderDetailPujaKitTranslate.create({
                        ord_dt_pu_kit_id: pujaKit.dataValues.id,
                        title: pujaKitTranslateElement.dataValues.title,
                        locale: pujaKitTranslateElement.dataValues.locale,
                        createdAt: currentFormattedDate,
                        updatedAt: currentFormattedDate,
                        deletedAt: null,
                      });
                    }

                    for (
                      var i = 0;
                      i < data["BookingSamagriPackageDetails"].length;
                      i++
                    ) {
                      let bookingSamagriPackageDetailElement =
                        data["BookingSamagriPackageDetails"][i];

                      let samagriPackage =
                        await OrderDetailSamagriPackage.create({
                          order_detail_id: orderDetail.dataValues.id,
                          price:
                            bookingSamagriPackageDetailElement.dataValues.price,
                            is_required: bookingSamagriPackageDetailElement.dataValues.is_required,
                          createdAt: currentFormattedDate,
                          updatedAt: currentFormattedDate,
                          deletedAt: null,
                        });

                      if (
                        samagriPackage &&
                        bookingSamagriPackageDetailElement[
                          "SamagriPackageDetail"
                        ]["SamagriPackageDetailTranslates"]
                      ) {
                        for (
                          var j = 0;
                          j <
                          bookingSamagriPackageDetailElement[
                            "SamagriPackageDetail"
                          ]["SamagriPackageDetailTranslates"].length;
                          j++
                        ) {
                          let bookingSamagriPackageDetailTranslateElement =
                            bookingSamagriPackageDetailElement[
                              "SamagriPackageDetail"
                            ]["SamagriPackageDetailTranslates"][j];
                          await OrderDetailSamagriPackageTranslate.create({
                            ord_dt_sm_package_id: samagriPackage.dataValues.id,
                            title:
                              bookingSamagriPackageDetailTranslateElement
                                .dataValues.title,
                            locale:
                              bookingSamagriPackageDetailTranslateElement
                                .dataValues.locale,
                            createdAt: currentFormattedDate,
                            updatedAt: currentFormattedDate,
                            deletedAt: null,
                          });
                        }
                      }

                      if (
                        bookingSamagriPackageDetailElement[
                          "BookingSamagriPackageDetailItems"
                        ]
                      ) {
                        for (
                          var j = 0; j < bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"].length; j++) {
                          let bookingSamagriPackageDetailItemElement = bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"][j];
                          // console.log(bookingSamagriPackageDetailElement["BookingSamagriPackageDetailItems"][0].dataValues)
                          let samagriItem =
                            await OrderDetailSamagriPackageItem.create({
                              ord_dt_sm_package_id:
                                samagriPackage.dataValues.id,
                              price: bookingSamagriPackageDetailItemElement.dataValues.Samagri.dataValues.price,
                              quantity:
                                bookingSamagriPackageDetailItemElement.dataValues.Samagri.dataValues.quantity,
                              createdAt: currentFormattedDate,
                              updatedAt: currentFormattedDate,
                              deletedAt: null,
                            });

                          if (
                            samagriItem &&
                            bookingSamagriPackageDetailItemElement["Samagri"][
                              "SamagriTranslates"
                            ]
                          ) {
                            for (
                              var k = 0;
                              k <
                              bookingSamagriPackageDetailItemElement["Samagri"][
                                "SamagriTranslates"
                              ].length;
                              k++
                            ) {
                              let samagriTranslateElement =
                                bookingSamagriPackageDetailItemElement[
                                  "Samagri"
                                ]["SamagriTranslates"][k];
                              await OrderDetailSamagriPackageItemTranslate.create(
                                {
                                  ord_dt_sm_pck_it_id:
                                    samagriItem.dataValues.id,
                                  title:
                                    samagriTranslateElement.dataValues.title,
                                  locale:
                                    samagriTranslateElement.dataValues.locale,
                                  createdAt: currentFormattedDate,
                                  updatedAt: currentFormattedDate,
                                  deletedAt: null,
                                }
                              );
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              break;
            case 3:
              let astrologyProductdetail;
              let getAstrology = await AstrologyProduct.findOne({
                where: {
                  id: data.dataValues.astrology_product_id,
                },
                include: [
                  {
                    model: AstrologyProductTranslate,
                  },
                  {
                    model: AstrologyProductVariation,
                  },
                ],
              });
              if (getAstrology && order) {
                astrologyProductdetail = await OrderDetail.create({
                  order_id: order.dataValues.id,
                  astrology_product_id: data.dataValues.astrology_product_id,
                  astrology_product_variation_id: data.dataValues
                    .astrology_product_variation_id
                    ? data.dataValues.astrology_product_variation_id
                    : null,
                  type: 3,
                  status: 0,
                  image: getAstrology.dataValues.image,
                  carat: data.dataValues.carat,
                  total: data.dataValues.total,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null,
                });
                getAstrology["AstrologyProductTranslates"].map(async (e) => {
                  e["AstrologyProductVariations"]
                    ? e["AstrologyProductVariations"].map(async (v) => {
                        await OrderDetailAstrologyProductTranslate.create({
                          ord_dt_id: astrologyProductdetail.dataValues.id,
                          title: e.title,
                          locale: e.locale,
                        });
                      })
                    : await OrderDetailAstrologyProductTranslate.create({
                        ord_dt_id: astrologyProductdetail.dataValues.id,
                        title: e.title,
                        locale: e.locale,
                      });
                });
              }
              break;
            case 4:
              if (data["BookingTourDetails"]) {
                if (data["Tour"]) {
                  let getTour = await Tour.findOne({
                    where: { id: data.dataValues.tour_id },
                  });

                  if (getTour) {
                    let orderDetail = await OrderDetail.create({
                      order_id: order.dataValues.id,
                      tour_id: getTour.dataValues.id,
                      type: 4,
                      status: 0,
                      total: data.dataValues.total,
                      image: getTour.dataValues.image,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null,
                    });

                    let tour = await OrderDetailTour.create({
                      location_id: getTour.dataValues.location_id,
                      order_detail_id: orderDetail.dataValues.id,
                      address: getTour.dataValues.address,
                      createdAt: currentFormattedDate,
                      updatedAt: currentFormattedDate,
                      deletedAt: null,
                    });

                    if (tour) {
                      for (
                        var k = 0;
                        k < data["Tour"]["TourTranslates"].length;
                        k++
                      ) {
                        let tourTranslateElement =
                          data["Tour"]["TourTranslates"][k];
                        OrderDetailTourTranslate.create({
                          ord_dt_tour_id: tour.dataValues.id,
                          title: tourTranslateElement.dataValues.title,
                          locale: tourTranslateElement.dataValues.locale,
                          createdAt: currentFormattedDate,
                          updatedAt: currentFormattedDate,
                          deletedAt: null,
                        });
                      }

                      for (
                        var i = 0;
                        i < data["BookingTourDetails"].length;
                        i++
                      ) {
                        let getTour = await Tour.findOne({
                          where: { id: data.dataValues.tour_id },
                          include: [
                            {
                              model: TourTranslate,
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
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        });

                        if (getTour && tour && orderDetail) {
                          let getBookingTourDetailElement =
                            data["BookingTourDetails"][i];

                          let orderDetailTourDetail =
                            await OrderDetailTourDetail.create({
                              ord_dt_tour_id: tour.dataValues.id,
                              price:
                                getBookingTourDetailElement.dataValues.price,
                              is_required:
                                getBookingTourDetailElement.dataValues
                                  .is_required,
                              item_selectable:
                                getBookingTourDetailElement.dataValues
                                  .item_selectable,
                              createdAt: currentFormattedDate,
                              updatedAt: currentFormattedDate,
                              deletedAt: null,
                            });

                          if (orderDetailTourDetail) {
                            let tourDetailTotal = 0;
                            for (
                              var j = 0;
                              j <
                              getBookingTourDetailElement["TourDetail"][
                                "TourDetailTranslates"
                              ].length;
                              j++
                            ) {
                              let tourDetailTranslateElement =
                                getBookingTourDetailElement["TourDetail"][
                                  "TourDetailTranslates"
                                ][j];
                              await OrderDetailTourDetailTranslate.create({
                                ord_dt_tr_dt_id:
                                  orderDetailTourDetail.dataValues.id,
                                title:
                                  tourDetailTranslateElement.dataValues.title,
                                locale:
                                  tourDetailTranslateElement.dataValues.locale,
                                createdAt: currentFormattedDate,
                                updatedAt: currentFormattedDate,
                                deletedAt: null,
                              });
                            }

                            for (
                              var j = 0;
                              j <
                              getBookingTourDetailElement[
                                "BookingTourDetailItems"
                              ].length;
                              j++
                            ) {
                              let tourDetailTranslateElement =
                                getBookingTourDetailElement[
                                  "BookingTourDetailItems"
                                ][j];
                              let orderDetailTourDetailItem =
                                await OrderDetailTourDetailItem.create({
                                  ord_dt_tr_dt_id:
                                    orderDetailTourDetail.dataValues.id,
                                  quantity:
                                    tourDetailTranslateElement.dataValues
                                      .quantity,
                                  price:
                                    tourDetailTranslateElement.dataValues.price,
                                  createdAt: currentFormattedDate,
                                  updatedAt: currentFormattedDate,
                                  deletedAt: null,
                                });

                              tourDetailTotal +=
                                tourDetailTranslateElement.dataValues.price;

                              if (orderDetailTourDetailItem) {
                                for (
                                  var k = 0;
                                  k <
                                  tourDetailTranslateElement["TourDetailItem"][
                                    "TourDetailItemTranslates"
                                  ].length;
                                  k++
                                ) {
                                  let tourDetailItemTranslateElement =
                                    tourDetailTranslateElement[
                                      "TourDetailItem"
                                    ]["TourDetailItemTranslates"][k];
                                  await OrderDetailTourDetailItemTranslate.create(
                                    {
                                      ord_dt_tr_dt_it_id:
                                        orderDetailTourDetailItem.dataValues.id,
                                      title:
                                        tourDetailItemTranslateElement
                                          .dataValues.title,
                                      locale:
                                        tourDetailItemTranslateElement
                                          .dataValues.locale,
                                      createdAt: currentFormattedDate,
                                      updatedAt: currentFormattedDate,
                                      deletedAt: null,
                                    }
                                  );
                                }
                              }
                            }

                            await OrderDetailTourDetail.update(
                              { price: tourDetailTotal },
                              {
                                where: {
                                  id: orderDetailTourDetail.dataValues.id,
                                },
                              }
                            );
                          }
                        }
                      }
                    }
                  }
                }
              }
              break;
            case 5:
              if (order && data && data["BookingKundali"]) {
                let Kundlidetail = await OrderDetail.create({
                  order_id: order.dataValues.id,
                  type: 5,
                  status: 0,
                  total: data.dataValues.total,
                  image: data.dataValues.image,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null,
                });

                if (Kundlidetail) {
                  await OrderDetailKundli.create({
                    ord_dt_id: Kundlidetail.dataValues.id,
                    first_name: data["BookingKundali"].dataValues.name,
                    last_name: data["BookingKundali"].dataValues.name,
                    email: data["BookingKundali"].dataValues.email,
                    phone: data["BookingKundali"].dataValues.phone,
                    date_of_birth:
                      data["BookingKundali"].dataValues.date_of_birth,
                    time: data["BookingKundali"].dataValues.time,
                    city: data["BookingKundali"].dataValues.city,
                    state: data["BookingKundali"].dataValues.state,
                    country: data["BookingKundali"].dataValues.country,
                    gender: data["BookingKundali"].dataValues.gender,
                    status: 0,
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null,
                  });
                }
              }
              break;
            case 6:
              if (order && data && data["BookingSession"]) {
                let sessiondetail = await OrderDetail.create({
                  order_id: order.dataValues.id,
                  type: 6,
                  status: 0,
                  total: data.dataValues.total,
                  image: data.dataValues.image,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null,
                });

                if (sessiondetail) {
                  await OrderDetailSession.create({
                    ord_dt_id: sessiondetail.dataValues.id,
                    name: data["BookingSession"].dataValues.name,
                    email: data["BookingSession"].dataValues.email,
                    phone: data["BookingSession"].dataValues.phone,
                    date_of_birth:
                      data["BookingSession"].dataValues.date_of_birth,
                    time: data["BookingSession"].dataValues.time,
                    city: data["BookingSession"].dataValues.city,
                    state: data["BookingSession"].dataValues.state,
                    country: data["BookingSession"].dataValues.country,
                    gender: data["BookingSession"].dataValues.gender,
                    booking_date:
                      data["BookingSession"].dataValues.booking_date,
                    comment: data["BookingSession"].dataValues.comment,
                    status: 0,
                    booking_time:
                      data["BookingSession"].dataValues.booking_time,
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null,
                  });
                }
              }
              break;
            case 7:
              if (order && data && data["BookingMatch"]) {
                let Matchdetail = await OrderDetail.create({
                  order_id: order.dataValues.id,
                  type: 7,
                  status: 0,
                  total: data.dataValues.total,
                  image: data.dataValues.image,
                  createdAt: currentFormattedDate,
                  updatedAt: currentFormattedDate,
                  deletedAt: null,
                });

                if (Matchdetail) {
                  await OrderDetailMatch.create({
                    ord_dt_id: Matchdetail.dataValues.id,
                    boy_name: data["BookingMatch"].dataValues.boy_name,
                    girl_name: data["BookingMatch"].dataValues.girl_name,
                    email: data["BookingMatch"].dataValues.email,
                    phone: data["BookingMatch"].dataValues.phone,
                    boy_dob: data["BookingMatch"].dataValues.boy_dob,
                    boy_birth_time:
                      data["BookingMatch"].dataValues.boy_birth_time,
                    girl_dob: data["BookingMatch"].dataValues.girl_dob,
                    girl_birth_time:
                      data["BookingMatch"].dataValues.girl_birth_time,
                    comment: data["BookingMatch"].dataValues.comment,
                    booking_date: data["BookingMatch"].dataValues.booking_date,
                    booking_time: data["BookingMatch"].dataValues.booking_time,
                    girl_birth_place: data["BookingMatch"].dataValues.girl_birth_place,
                    boy_birth_place: data["BookingMatch"].dataValues.boy_birth_place,
                    status: 0,
                    createdAt: currentFormattedDate,
                    updatedAt: currentFormattedDate,
                    deletedAt: null,
                  });
                }
              }
              break;
          }
        });
      }

      // razorpay create order

      let razorpayOrder = await instance.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt: orderNumber,
      });
      //console.log(razorpayOrder)
      return {
        total: total,
        orderNumber: orderNumber,
        razorpayOrder: razorpayOrder,
      };
    } catch (e: any) {
      return { error: e };
    }
  }

  // razorpay capture and verify order
  async verifyOrder(req, input) {
    const now = new Date();
    const currentFormattedDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderNumber,
      total,
    } = input;
    const key_secret = process.env.RAZORPAY_KEY_SECERET;
    try {
      let hmac = crypto.createHmac("sha256", key_secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");
      if (razorpay_signature === generated_signature) {
        const order = await Order.findOne({ where: { order_id: orderNumber, status: 0 } });

        if (order) {
          await Order.update({
            razorpay_order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            status: 1,
            order_date: currentFormattedDate
          },
            { where: { order_id: orderNumber } }
          );

          await OrderDetail.update(
            { status: 1 },
            { where: { order_id: order.dataValues.id } }
          );
        }

        return {
          success: true,
          message: "Payment has been verified",
          orderDetails: { orderNumber, total, razorpay_payment_id },
        };
      } else
        return {
          success: false,
          message: "Payment verification failed",
          orderDetails: { orderNumber, total },
        };
    } catch (e: any) {
      return { error: e };
    }
  }
}
