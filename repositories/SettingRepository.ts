import { Booking } from "../models/Booking";
import { BookingSession } from "../models/BookingSession";
import { Setting,instance } from "../models/Setting";

export class SettingRepository {
    async getById(id) {
        const val = await Setting.findOne({where:{id:id}});
         if (!val ) {
            throw new Error('Id not found');
        }else{
        try {
          const res: Setting = await Setting.findOne({
            where:{id:id},
            attributes: ['id', 'session_amount', 'kundli_amount', 'kundli_match_amount', 'latitude', 'longitude','address','email','phone','shipping_charge','notify','notify_link','procedure_en','procedure_hi']
          });
          return { datas: res };
        } catch (e: any) {
          return { error: e };
        }
    }
      }

      
      async edit(id: bigint) {
        try {
          const res = await Setting.findOne({
            where: {
              id: id
            }
          });
          return { res };
        } catch (e: any) {
          return { error: e };
        }
      }


      async update(put: instance) {
        const phoneno = /^\d{10}$/;
        const val = await Setting.findOne({ where: { id: put.id }});
    
         if (!val ) {
            throw new Error('Id not found');
        }else if(!put.session_amount ||!put.kundli_amount || !put.kundli_match_amount)
        throw new Error('Must include all fields'); 
        
        else {
          try {
            const res = await Setting.update(put, { where: { id: put.id } });
            if(put.session_amount != val.dataValues.session_amount){
              let booking = await Booking.destroy({where: {type: 6}})
            
            }
            if(put.kundli_amount != val.dataValues.kundli_amount){
              let booking = await Booking.destroy({where: {type: 5}})

            }
            if(put.kundli_match_amount != val.dataValues.kundli_match_amount){
              let booking = await Booking.destroy({where: {type: 7}})

            }
        
            return { body: res };
          } catch (e: any) {
            return { error: e };
          }
        }
      }
  
    
}