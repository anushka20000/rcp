import { User, instance } from "../models/User";
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";
import { UserAddress } from "../models/UserAddress";
import { config } from "../config/jwt-config";
const bcrypt = require("bcrypt");

class UserRepository {
  // POST

  async store(post: instance) {
    const phoneno = /^\d{10}$/;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNumber = String(post.phone);
    const phone_number = await User.findOne({ where: { phone: phoneNumber } });
    const email = await User.findOne({ where: { email: post.email } });
    if (!post.first_name )
      throw new Error("Must include Name");
    else if (!phoneNumber.match(phoneno)) {
      throw new Error("Contact no. is not valid");
    } else if (phone_number) {
      throw new Error("Contact no. is already present in the database");
    } else if (!post.email.match(mailformat)) {
      throw new Error("Email is not valid");
    } else if (email) {
      throw new Error("Email is already present in the database");
    } else {
      try {
        const res = await User.create(post);
        return { res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }
  //GET
  async get() {
    try {
      const res = await User.findAll({
        order: [["id", "DESC"]],
        where: {
          type: 2,
        },
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async getById(id: any) {
    try {
      const res = await User.findOne({ where: { id: id } });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async edit(post: any) {
    const phoneno = /^\d{10}$/;
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let phoneNumber = String(post.phone);
    const val = await User.findOne({ where: { id: post.id } });
    const value: User[] = await User.findAll({
      where: { id: { [Op.ne]: post.id }, phone: phoneNumber },
    });
    const email: User[] = await User.findAll({
      where: {
        id: { [Op.ne]: post.id },
        email: post.email,
      },
    });
    if (!val) {
      throw new Error("Id not found");
    } else if (!post.first_name )
      throw new Error("Must include Name");
    else if (!phoneNumber.match(phoneno)) {
      throw new Error("Contact no. is not valid");
    } else if (value.length) {
      throw new Error("Contact no. is already present in the database");
    } else if (!post.email.match(mailformat)) {
      throw new Error("Email is not valid");
    } else if (email.length) {
      throw new Error("Email is already present in the database");
    } else {
      try {
        const res = await User.update(post, { where: { id: post.id } });
        return { res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  //DELETE
  async delete(id: bigint) {
    const val = await User.findOne({ where: { id: id } });
    if (!val) {
      throw new Error("id not found");
    } else if (val) {
      try {
        const res = await User.destroy({ where: { id: id } });
        return { res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }
  async list(req) {
    try {
      let data;
      let decodedToken;

      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(" ")[1];
        decodedToken = jwt.decode(jwtString);
        data = await User.findOne({ where: { id: decodedToken.id } });
      }
      return { data };
    } catch (e: any) {
      return { error: e };
    }
  }

 
  async update(req) {
    let user;
    let decodedToken;
    let count = 0;

    if (req.headers.authorization) {
      const jwtString = req.headers.authorization.split(" ")[1];
      decodedToken = jwt.decode(jwtString);
      user = await User.findOne({ where: { id: decodedToken.id } });
    }
    if (user) {
      const findUserEmail = await User.findAll({
        where: {
          id: {
            [Op.ne]: decodedToken.id,
          },
        },
      });

      findUserEmail.map(async (data) => {
        if (data.dataValues.email == req.body.email) {
          count++;
        }
      });

      if (count != 0) {
        throw new Error("Email Id already exists");
      } else {
        try {
          await User.update(
            {
              first_name: req.body.first_name,
              phone: req.body.phone,
              email: req.body.email,
            },
            { where: { id: decodedToken.id } }
          );
        } catch (e: any) {
          return { error: e };
        }
      }
    }
  }

  async editAdmin(req) {
     
    if (!req.headers.authorization) 
    throw new Error("Invalid User");
   else {
    try {
      const jwtString = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.decode(jwtString); 
      const res = await User.findOne({ where: { id: decodedToken.id } }); 
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  }
  async updatePassword(req) {
    let user;
    let decodedToken;
    let count = 0;

    if (req.headers.authorization) {
      const jwtString = req.headers.authorization.split(" ")[1];
      decodedToken = jwt.decode(jwtString);
      user = await User.findOne({ where: { id: decodedToken.id } });
    }

    if (user) {
      let passwordIsValid = bcrypt.compareSync(
        req.body.currentPassword,
        user.dataValues.password
      );
      const findUserEmail = await User.findAll({
        where: { id: { [Op.ne]: decodedToken.id } },
      });
      findUserEmail.map(async (data) => {
        if (data.dataValues.email == req.body.email) {
          count++;
        }
      });
      if (!passwordIsValid) {
        return { result: { token: null, error: "Invalid current password!" } };
      }
      

      if (count != 0) throw new Error("Email Id already exists");
      else {
        const salt = await bcrypt.genSalt(10);
        const pass = req.body.newPassword;
        const hashedPassword = await bcrypt.hash(pass, salt);
        const token = jwt.sign({ id: user.dataValues.id }, config.jwt.SECRET, { expiresIn: "30d" });
          //return { result: { token: token } };

        try {
          await User.update(
            {
              password: hashedPassword,
              email: req.body.email,
              first_name: req.body.first_name,
              last_name: req.body.last_name,
            },
            { where: { id: decodedToken.id } }
          )
          return { result: { token: token } };
        } catch (e: any) {
          return { error: e };
        }
      }
    }
  }
  async listingProfileAddresses(req) {
    try {
      let user;
      let decodedToken;
      if (req.headers.authorization) {
        const jwtString = req.headers.authorization.split(" ")[1];
        decodedToken = jwt.decode(jwtString);
        user = await User.findOne({ where: { id: decodedToken.id } });
      }
      if (user) {
        const data = await UserAddress.findAll({
          where: { user_id: decodedToken.id },
        });
        return { data };
      }
    } catch (e: any) {
      return { error: e };
    }
  }
}

export { UserRepository };
