import { User } from "../models/User";
import { UserAddress, instance } from "../models/UserAddress"
const { Op } = require("sequelize");
import jwt from 'jsonwebtoken'
import { Booking } from "../models/Booking";
class UserAddressRepository {
  // POST

  async store(post: instance) {
  
    const phoneno = /^\d{10}$/;
    let phoneNumber = String(post.phone)
    let altphoneNumber = String(post.alternate_phone)
    if (!post.first_name || !post.last_name || !post.phone || !post.address || !post.user_id || !post.state || !post.pincode)
      throw new Error('Must include all fields');
    else if (!phoneNumber.match(phoneno) || (post.alternate_phone && !altphoneNumber.match(phoneno))) {
      throw new Error('Contact no. is not valid');
    } else if (post.pincode.length != 6) {
      throw new Error('Please enter 6 digit Pincode');
    } else if (post.address.length < 5) {
      throw new Error('Address is too short');
    }
    else {
      try {
        let res = await UserAddress.create(post);
   
        await UserAddress.update({default: 0}, {where : {id :  { [Op.ne] : res.dataValues.id}}})
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }
  //GET
  async get() {
    try {
      const res = await UserAddress.findAll();
      return { body: res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async update(put: instance, id: any) {
    const phoneno = /^\d{10}$/;
    let phoneNumber = String(put.phone)
    let altphoneNumber = String(put.alternate_phone)
    const val = await UserAddress.findOne(id);

    if (!val) {
      throw new Error('Id not found');
    } else if (!put.first_name || !put.first_name || !put.phone || !put.address || !put.user_id || !put.state || !put.pincode)
      throw new Error('Must include all fields');
    else if (!phoneNumber.match(phoneno) || (put.alternate_phone && !altphoneNumber.match(phoneno))) {
      throw new Error('Contact no. is not valid');
    } else if (put.pincode.length != 6) {
      throw new Error('Please enter 6 digit Pincode');
    } else if (put.address.length < 5) {
      throw new Error('Address is too short');
    }

    else {
      try {
        const res = await UserAddress.update(put, id);
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  //DELETE
  async delete(id: bigint) {
    const val = await UserAddress.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await UserAddress.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }

    }
  }
  async listingAddresses(req) {
    try {
      let user
      let decodedToken;
      let userAddresId:any = 0;
      let userAddress = null;
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      if (user) {
        const data = await UserAddress.findAll({ where: { user_id: decodedToken.id } })

      if(data) {
        userAddresId = data[0] ? data[0].dataValues.id : '';
        userAddress = data[0] ? data[0].dataValues : ''
        const booking = await Booking.findOne(
          { 
            where: { user_id: decodedToken.id, 
              user_address_id: {
                [Op.ne]: null
              } 
            },
            include: [
              UserAddress
            ] 
          })

        if(booking && userAddresId != '' && userAddress != '') {
          userAddresId = booking.dataValues.user_address_id
          userAddress = booking['UserAddress'].dataValues
          
        }
      }
        return { data, userAddresId, userAddress }
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  async addUserAddressToCart(req) {
    try {
      let user
      let decodedToken;
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      if (user) {
        const datas = await UserAddress.findOne({ where: { user_id: decodedToken.id, id: req.params.id } })
       

        if (datas) {
          await Booking.update(
            { user_address_id: datas.dataValues.id },
            { where: { user_id: datas.dataValues.user_id } }
          );

          return { datas }
        }

     
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  async addAddress(req) {
    try {
      let user
      let decodedToken;
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(' ')[1];
        decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      if (user) {
        const createAddress = await UserAddress.create({
          user_id: decodedToken.id,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          landmark: req.body.landmark,
          phone: req.body.phone,
          alternate_phone: req.body.alternate_phone,
          pincode: req.body.pincode,
          state: req.body.state,
          address: req.body.address,
          default: req.body.default
        })
      
        await UserAddress.update({default: 0}, {where : {id :  { [Op.ne] : createAddress.dataValues.id}}})
        if (createAddress) {
          const datas = await UserAddress.findAll({ where: { user_id: decodedToken.id } })
          await Booking.update(
            { user_address_id: createAddress.dataValues.id },
            { where: { user_id: decodedToken.id } }
          );
          return {data : createAddress, datas: datas}
        }
      }
    } catch (e: any) {
      return { error: e };
    }
  }

  async removeAddress(req) {
    const jwtString = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(jwtString);
    const user = await User.findOne({ where: { id: decodedToken.id } });
    try {
      if(user){
        await UserAddress.destroy({ where: { id: req.body.id } });
      }
    } catch (e: any) {
      return { error: e };
    }
  }
}

export { UserAddressRepository };