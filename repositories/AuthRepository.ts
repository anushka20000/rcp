import * as jwt from "jsonwebtoken"
import { config } from "../config/jwt-config"
import { User } from "../models/User";
import { authenticator } from 'otplib'
import EmailConfig from '../config/mail-config'
import NewUserEmailTemplate from '../views/NewUserEmailTemplate'
import OtpEmailTemplate from '../views/OtpEmailTemplate'
import { Booking } from "../models/Booking";
import NewUserEmailTemplateHi from "../views/NewUserEmailTemplateHi";
import OtpEmailTemplateHi from "../views/OtpEmailTemplateHi";
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");

export class AuthRepository {
    // to verify user and generate otp
    async Login(userCredential) {
        const lang = userCredential.lang ? userCredential.lang : 'en'
        const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^\d{10}$/;
  
        // Validations
        if (!(userCredential.email || userCredential.phone)) {
            throw new Error("Email or Phone Is Required")
        } else if (userCredential.email) {
            if (!userCredential.email.match(mailRegex)) {
                throw new Error("Email Format Incorrect")
            } else {
                const findEmail = await User.findOne({ where: { email: userCredential.email } });
                const findUser = JSON.parse(JSON.stringify(findEmail))
                if (findUser === null) {
                    const addNewUser = await User.create({ email: userCredential.email, type: 2 })
                    // generate otp 
                    let otp = Math.floor(1000 + Math.random() * 9000).toString();
                    // storing otp to db
                    const updateSecret = await User.update({ otp: otp }, { where: { email: userCredential.email } })
                    // sharing otp to user email    
                    let subject = lang == 'en' ? "Welcome To Puja Path Booking" : "पूजा पथ बुकिंग में आपका स्वागत है"

                    let mailOptions = {
                        from: process.env.EMAIL_FROM,
                        to: userCredential.email,
                        subject: subject,
                        html: lang == 'en' ? NewUserEmailTemplate(userCredential.email, otp) : NewUserEmailTemplateHi(userCredential.email, otp)
                    }
                    EmailConfig.sendMail(mailOptions, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(data)
                        }
                    })

                } else {

                    // // generate secret key for extra security and save to db
                    // const secret = authenticator.generateSecret()
                    // let updatedData = { otp: secret }
                    // const updateSecret = await User.update(updatedData, { where: { email: userCredential.email } });

                    // // generate and send otp to phone
                    // const otp = authenticator.generate(secret);
                    // console.log(otp)

                    // generate otp 
                    if(findEmail.dataValues.status == 0){
                        throw new Error("Your account is blocked. Please contact with admin.")
                    }else{
                        let otp = Math.floor(1000 + Math.random() * 9000).toString();
                        let updatedData = { otp: otp }
                        // storing otp to db
                        const updateSecret = await User.update(updatedData, { where: { email: userCredential.email } })
                        // sharing otp to user email 
                        let subject = lang == 'en' ? "OTP for Puja Path Booking" : "पूजा पाठ बुकिंग के लिए ओटीपी"
    
                        let mailOptions = {
                            from: process.env.EMAIL_FROM,
                            to: userCredential.email,
                            subject: subject,
                            html: lang == 'en' ? OtpEmailTemplate(otp) : OtpEmailTemplateHi(otp)
                        }
                        EmailConfig.sendMail(mailOptions, function (err, data) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(data)
                            }
                        })
                    }

                    // return { result: 'Otp Sent Successfull!' }

                }
            }
        } else if (userCredential.phone) {
            if (!userCredential.phone.match(phoneRegex)) {
                throw new Error("Phone Format Incorrect")
            } else {
                const findPhone = await User.findOne({ where: { phone: userCredential.phone } });
                const findUser = JSON.parse(JSON.stringify(findPhone))
                if (findUser === null) {
                    // throw new Error("Phone Not Exists")
                    const addNewUser = await User.create({ phone: userCredential.phone, type: 2 })
                    // generate otp
                    let otp = Math.floor(1000 + Math.random() * 9000).toString();
                    // sharing otp to user phone
                    const updateSecret = await User.update({ otp: otp }, { where: { phone: userCredential.phone } })
                    console.log(otp)
                } else {
                    // // generate secret key for extra security and save to db
                    // const secret = authenticator.generateSecret()
                    // let updatedData = { otp: secret }
                    // const updateSecret = await User.update(updatedData, { where: { phone: userCredential.phone } });

                    // // generate and send otp to phone
                    // const otp = authenticator.generate(secret);
                    // console.log(otp)

                    // // pending to send on phone
                    // return { result: 'Otp Sent Successfull!' }
                    let otp = Math.floor(1000 + Math.random() * 9000).toString();
                    let updatedData = { otp: otp }
                    const updateSecret = await User.update(updatedData, { where: { phone: userCredential.phone } })

                    console.log(otp)
                    return { result: 'Otp Sent Successfull!' }
                }
            }
        }
    }


    // to verify otp and login
    async verifyOTP(data) {
        if (data.email) {
            /*const findEmail = await User.findOne({ where: { 
                email: {
                    [Op.like]: `${data.email}`,
                  }
            } });*/
            const findEmail = await User.findOne({ where: { email: data.email, type: 2 } });
            const findUser = JSON.parse(JSON.stringify(findEmail))
            // verifying user otp with db secret key
            // let token = String(data.otp)
            // const isValid = authenticator.check(token, findUser.otp);

            if (data.otp != findUser.otp) {
                throw new Error("Incorrect OTP")
            } else {
                const updateUserData = await User.update({ is_verified: 1, status: 1, otp: null }, { where: { email: data.email } })
                const token = jwt.sign(
                    {
                        id: findUser.id,
                        email: findUser.email,
                        type: findUser.type
                    },
                    config.jwt.SECRET,
                    { expiresIn: "20d" }
                )

                let updatedData = { user_id: findUser.id, booking_token: data.booking_token};

                if (data.booking_token != '') {
                    const bookingUpdate = await Booking.update(updatedData, {
                        where: { booking_token: data.booking_token }
                    })
                }

                return { token: token };
            }
        } else if (data.phone) {
            const findPhone = await User.findOne({ where: { phone: data.phone, type: 2 } });
            const findUser = JSON.parse(JSON.stringify(findPhone))

            // verifying user otp with db secret key
            // let token = String(data.otp)
            // const isValid = authenticator.check(token, findUser.otp);

            if (data.otp != findUser.otp) {
                throw new Error("Incorrect OTP")
            } else {

                const updateUserData = await User.update({ is_verified: 1, status: 1, otp: null }, { where: { phone: data.phone } })

                const token = jwt.sign(
                    {
                        id: findUser.id,
                        email: findUser.email,
                        type: findUser.type
                    },
                    config.jwt.SECRET,
                    { expiresIn: "20d" }
                )

                let updatedData = { user_id: findUser.id, booking_token: data.booking_token};

                if (data.booking_token != '') {
                    const bookingUpdate = await Booking.update(updatedData, {
                        where: { booking_token: data.booking_token }
                    })
                }
                return { token: token };
            }
        }
    }

    async adminLogin(data) {
        /*
        const salt = await bcrypt.genSalt(10)
        let hashPassword = await bcrypt.hash(data.password, salt)
        
        await User.update(
            { password: hashPassword },
            { where: { id: isUserExist.dataValues.id } }
        );
        */

        if (data.email == '' || data.password == '') {
            throw new Error("Invalid credentials!");
        }

        const user = await User.findOne({
            where: {
                email: data.email,
                type: 1
            }
        });

        if (user) {
            let passwordIsValid = bcrypt.compareSync(data.password, user.dataValues.password);
            if (!passwordIsValid) {
                return { result: { token: null, error: 'Invalid password!' } }
            }

            const token = jwt.sign({ id: user.dataValues.id }, config.jwt.SECRET, { expiresIn: "30d" });
            return { result: { token: token } };
        } else {
            return { result: { token: null, error: 'Invalid credentials!' } }
        }
    }


    async getUserByEmail(email) {


        if (email == '') {
            throw new Error("Email Required!");
        }

        const user = await User.findOne({
            where: {
                email: email,
                type: 1
            }
        });

        return { result: user }
    }
    async getUserByEmailAdmin(email) {
        if (email == '') {
            throw new Error("Email Required!");
        }
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        return { result: user }
    }
    async getUserByPhoneAdmin(phone) {
        const user = await User.findOne({
            where: {
                phone: phone,
            }
        });

        return { result: user }
    }

}


