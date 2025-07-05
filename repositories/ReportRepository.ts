import { Order } from "../models/Order";
import { User } from "../models/User";
import * as dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";
import { OrderDetail } from "../models/OrderDetail";
import { OrderDetailPujaTranslate } from "../models/OrderDetailPujaTranslate";
import { Puja } from "../models/Puja";
import { PujaTranslate } from "../models/PujaTranslate";
import { OrderDetailTourTranslate } from "../models/OrderDetailTourTranslate";
import { OrderDetailSamagriPackageTranslate } from "../models/OrderDetailSamagriPackageTranslate";
import { TourTranslate } from "../models/TourTranslate";
import { OrderDetailTour } from "../models/OrderDetailTour";
import { OrderDetailSamagriPackage } from "../models/OrderDetailSamagriPackage";
import { OrderDetailPujaKit } from "../models/OrderDetailPujaKit";
import { OrderDetailPujaKitTranslate } from "../models/OrderDetailPujaKitTranslate";
import { Tour } from "../models/Tour";
import { addDays } from "date-and-time";
import db from "../config/db";
import { UserAddress } from "../models/UserAddress";
const { Op } = require("sequelize");

const date = require("date-and-time");
const today = new Date().toLocaleDateString('en-GB');

export class ReportRepository {

  async getUser() {
    try {
      const res = await User.findAll({
        order: [["id", "DESC"]],
        attributes: [
          "id",
          "email",
          "first_name",
          "last_name",
          "phone",
        ],
        where: {
          type: 2,
        },
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async getOrder() {
    try {
      const res: Order[] = await Order.findAll({
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
        ],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async list(type) {
    try {
      if (type == 0) {
        const res: Order[] = await Order.findAll({
          include: [
            {
              model: UserAddress,
            },
          ],
          where: {
            [Op.or]: [{ status: 0 }, { status: 2 }],
          },
          order: [["id", "DESC"]],
        });
        return { res };
      }
      if (type == 1) {
        const res: Order[] = await Order.findAll({
          include: [
            {
              model: UserAddress,
            },
          ],
          where: {
            status: 1,
          },
          order: [["id", "DESC"]],
        });
        return { res };
      }
      if (type == 3) {
        const res: Order[] = await Order.findAll({
          include: [
            {
              model: UserAddress,
            },
          ],
          where: {
            status: 3,
          },
          order: [["id", "DESC"]],
        });
        return { res };
      }
      if (type == 4) {
        const res: Order[] = await Order.findAll({
          include: [
            {
              model: UserAddress,
            },
          ],
          where: {
            status: 4,
          },
          order: [["id", "DESC"]],
        });
        return { res };
      }
    } catch (e: any) {
      return { error: e };
    }
  }
  async orderInfoInDashboard() {
    try {
      let pendingTotal = 0;
      let processingTotal = 0;
      let canceledTotal = 0;
      let completedTotal = 0;
      let userTotal = 0;
      //let topSells = [];

      const users = await User.findOne({
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 2 }
      });

      if (users) {
        userTotal = users.dataValues['count'];
      }

      const orders = await Order.findAll({
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      if (orders) {
        orders.map(item => {

          switch (item.dataValues.status) {
            case 0:
              pendingTotal += item.dataValues['count'];
              break;
            case 1:
              processingTotal += item.dataValues['count'];
              break;
            case 2:
              canceledTotal += item.dataValues['count'];
              break;
            case 3:
              canceledTotal += item.dataValues['count'];
              break;
            case 4:
              completedTotal += item.dataValues['count'];
              break;
          }
        })
      }

      const livePuja = await OrderDetail.findAll({
        where: { is_live: 1, date: today }
      });

      let pujaCount = []
      const pujas = await OrderDetail.findAll({
        // include: [

        //   {
        //     model: OrderDetailPujaTranslate,
        //   }
        // ],
        attributes: [
          'puja_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],

        ],
        include: [
          {
            model: OrderDetailPujaTranslate,
            where: { locale: 'en' }
          },
        ],
        where: { type: 1, status: [1, 4] },
        group: ["puja_id"],
        //order: [["count", "DESC"]],
        limit: 3,

      });

      // if(pujas){
      //   pujas.map((item)=>{
      //     item.dataValues.puja_id
      //     let puja = PujaTranslate.findOne
      //   })
      // }
      const samagris = await OrderDetail.findAll({

        attributes: [
          'samagri_package_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],

        where: { type: 2, status: [1, 4] },
        // include: [
        //   {
        //     model: OrderDetailSamagriPackage
        //   },
        // ],
        include: [
          {
            model: OrderDetailPujaKit,
            include: [
              {
                model: OrderDetailPujaKitTranslate,
                where: { locale: 'en' },
              },
            ]
          },
        ],

        group: ["samagri_package_id"],
        //order: [["count", "DESC"]],
        limit: 3,

      });

      const tours = await OrderDetail.findAll({
        attributes: [
          'tour_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          //[Sequelize.fn('SUM', Sequelize.col('total')), 'totalAmount']
          [Sequelize.fn('COUNT', Sequelize.col('tour_id')), 'count']
        ],
        where: { type: 4, status: [ 1, 4] },
        include: [
          {
            model: Tour,
            attributes: ['id'],
            include: [
              {
                model: TourTranslate,
                where: { locale: 'en' },
                attributes: ['id', 'tour_id', 'title']
              }
            ]
          }
        ],
        group: ["tour_id"],
        //order: [["count", "DESC"]],
        limit: 3,

      });


      // include: [
      //   {
      //     model: OrderDetailTour,
      //     attributes: [
      //       'id'
      //     ]
      //     // include: [
      //     //   {
      //     //     model: OrderDetailPujaKitTranslate,
      //     //     where: { locale: 'en' },
      //     //   },
      //     // ]
      //   },
      // ],
      const now = (new Date());
      const currentFormattedDate = date.format(now, 'YYYY-MM-DD');
      const latestOrder: Order[] = await Order.findAll({
        order: [["id", "DESC"]],
        where: {
          createdAt: {
            [Op.startsWith]: currentFormattedDate
          },
          status: [1, 4],
        }
      });

      return { completedTotal, canceledTotal, pendingTotal, processingTotal, userTotal, livePuja, pujas, samagris, tours, latestOrder }
    } catch (e: any) {

      return { error: e };
    }
  }
  async chartDetails() {
    let results = []
    let sum=0;
    try {
      const puja = await OrderDetail.findAll({

        attributes: [
          // 'puja_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
        ],
        where: { type: 1, status: [1, 4] },

      });

      const tour = await OrderDetail.findAll({
        attributes: [
          // 'tour_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('tour_id')), 'count']
        ],
        where: { type: 4, status: [1, 4] }
      });

      const samagris = await OrderDetail.findAll({
        attributes: [
          // 'samagri_package_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 2, status: [1, 4] },
      });
      const astrology = await OrderDetail.findAll({
        attributes: [
          // 'astrology_product_id',
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 3, status: [1, 4] },
      });
      const astrologySession = await OrderDetail.findAll({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 6, status: [1, 4] },
      });
      const kundliMatching = await OrderDetail.findAll({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 7, status: [1, 4] },
      });

      const kundli = await OrderDetail.findAll({
        attributes: [
          [Sequelize.fn('sum', Sequelize.col('total')), 'total'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
        ],
        where: { type: 5, status: [1, 4] },
      });
  
      results.push(puja[0].dataValues['total']==null?0:puja[0].dataValues['total'])
      results.push(tour[0].dataValues['total']==null?0:tour[0].dataValues['total'])
      results.push(samagris[0].dataValues['total']==null?0:samagris[0].dataValues['total'])
      results.push(astrology[0].dataValues['total']==null?0:astrology[0].dataValues['total'])
      results.push(astrologySession[0].dataValues['total']==null?0:astrologySession[0].dataValues['total'])
      results.push(kundli[0].dataValues['total']==null?0:kundli[0].dataValues['total'])
      results.push(kundliMatching[0].dataValues['total']==null?0:kundliMatching[0].dataValues['total'])
      results.map((it)=>{
         sum += it
      })
    
      return { results, sum };
    } catch (e: any) {
      return { error: e };
    }
  }
  async saleReport() {
     try {
      let result=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      let resultNow=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      const now = (new Date());
      const nowDate = (new Date()).getDate();
      const preious = date.addMonths(now, -1);
      // const startDate = date.format(preious, 'YYYY-MM-DD');
      // const endDate = date.format(now, 'YYYY-MM-DD');
      const todate = date.addDays(now, -(nowDate-1));
      const predate = date.addDays(preious, -(nowDate-1));
      const startDate = date.format(predate, 'YYYY-MM-DD');
      const endDate = date.format(todate, 'YYYY-MM-DD');
      const sDate = date.format(todate, 'YYYY-MM-DD');
      const eDate = date.format(now, 'YYYY-MM-DD');
      //  console.log(startDate, endDate, sDate, eDate)
      const res = await Order.findAll({
        attributes: [
          [db.fn('date_format', db.col('createdAt'), '%Y-%m-%d'), 'date'],
          [db.fn('sum', db.col('total')), 'total'],
        ],
        where: {
          status: [1, 4],
          createdAt: {
            [Op.between]: [startDate, endDate],
          }
        },
        order: ['date'],
        group: ['date']
      });
      const resNow = await Order.findAll({
        attributes: [
          [db.fn('date_format', db.col('createdAt'), '%Y-%m-%d'), 'date'],
          [db.fn('sum', db.col('total')), 'total'],
        ],
        where: {
          status: [1, 4],
          createdAt: {
            [Op.between]: [sDate, eDate],
          }
        },
        order: ['date'],
        group: ['date']
      });
      res.map((it)=>{
        let D=new Date(it.dataValues['date']).getDate()
        result[D-1]=+it.dataValues['total']
      })
      resNow.map((it)=>{
        let D=new Date(it.dataValues['date']).getDate()
        resultNow[D-1]=+it.dataValues['total']
      })
      let series= [
				{
					name: 'Last Month',
					data: result,
				},
				{
					name: 'This Month',
					data: resultNow,
				},
			]
      
      return { res, result, resultNow, series };
    } catch (e: any) {
      return { error: e };
    }
  }
}
