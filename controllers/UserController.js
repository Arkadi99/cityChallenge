import {Users} from "../models";
import HttpError from "http-errors";
import Helpers from "../services/Helpers";
import jwt from "jsonwebtoken";
import ConfirmEmail from "../services/ConfirmEmail";
import sharp from "sharp";
import path from "path";
import fs from "fs";
class UserController {
    static register = async (req, res, next) => {
        try {
            const {email, password} = req.body
            const activationCode = Helpers.randomString(9)
            const user = await Users.create({
                email, password, activationCode, avatar:"/images/users_img/users.png", role: "tourist"
            });

            await ConfirmEmail.confirm(email, activationCode).catch(console.trace);

            const token = jwt.sign({
                id: user.id, role: user.role, email,
            }, process.env.SECRET_KEY)

            res.json({
                status: "ok", user, token
            })
        } catch (e) {
            next(e);
        }
    }
    static confirmEmail = async (req, res, next) => {
        try {
            const {email, code} = req.query
            const user = await Users.findOne({
                where: {email, activationCode: code}
            })
            if (!user) {
                throw HttpError(404, "not found");
            }
            user.status = "active"
            await user.save()
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e);
        }
    }
    static login = async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const user = await Users.findOne({
                where: {
                    email, password: Users.passHash(password)
                }
            })
            if (!user) {
                throw HttpError(403, 'Invalid email or password');
            }
            if (user.status === 'pending') {
                throw HttpError(401, 'Your email is not confirmed')
            }
            const token = jwt.sign({
                id: user.id, role: user.role, email,
            }, process.env.SECRET_KEY)

            res.json({
                status: "ok", user, token
            })

        } catch (e) {
            next(e)
        }
    }

    static userInfo = async (req, res, next) => {
        try {
            const {userId} = req
            const user = await Users.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw HttpError(403, 'Not allowed');
            }
            res.json({
                status: "ok", user,
            })

        } catch (e) {
            next(e)
        }
    }
    static updateProfile = async (req, res, next) => {
        try {
            const {userId} = req
            const {firstName, lastName, nickname, number, gender, age} = req.body;
            const user = await Users.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw HttpError(403, 'Not allowed');
            }
            user.set({firstName, lastName, nickname, number, gender, age,allFields:true});
            await user.save()
            res.json({
                status: "ok",
                user,
            })
        } catch (e) {
            next(e)
        }
    }
    static delete = async (req, res, next) => {
        try {
            const {userId} = req
            const user = await Users.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw HttpError(403, 'Not allowed');
            }
            if (fs.existsSync(path.join(__dirname, '../public/images/users_img', user.avatar))){
                fs.rmSync(path.join(__dirname, '../public/images/users_img', user.avatar))
            }
            await user.destroy()
            res.json({
                status: "ok",
            })
        } catch (e) {
            next(e)
        }
    }
    static passwordChange = async (req, res, next) => {
        try {
            const {email} = req.query
            const user = await Users.findOne({
                where: {
                    email
                }
            })
            if (!user) {
                next(HttpError(403, 'Not allowed'))
            }
            const code = user.getDataValue("activationCode")
            await ConfirmEmail.confirmChange(email, code).catch(console.trace);
            res.json({
                status: 'ok',
                message: "Go your Email"
            })
        } catch (e) {
            next(e)
        }
    }
    static passwordChangeCode = async (req, res, next) => {
        try {
            const {code, password} = req.query
            const user = await Users.findOne({
                where: {
                    activationCode: code
                }
            })
            if (!user) {
                next(HttpError(403, 'Not allowed'))
            }
            user.password = password
            await user.save()
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    }
    static googleLogin = async (req, res, next) => {
        try {
            const {googleToken} = req.query
            const {data} = await Helpers.googleLogin(googleToken);
            const {given_name, family_name, email, email_verified, sub, picture} = data
            if (!googleToken) {
                throw HttpError(404, "not google users");
            }
            if (!email_verified) {
                throw HttpError(404, "not google verification");
            }
            const user = await Users.findOne({
                where: {
                    email, password: Users.passHash(sub)
                }
            })
            if (!user) {
                await Users.create({
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    password: sub,
                    status: "active",
                    avatar: picture,
                    allFields:true
                });
            }
            const token = jwt.sign({
                id: user.id,
                role: user.role,
                email,
            }, process.env.SECRET_KEY, {expiresIn: '24h'})
            res.json({
                status: 'ok',
                user,
                token
            })
        } catch (e) {
            next(e);
        }
    }
    static imgUpdate = async (req, res, next) => {
        try {
            const {userId, file} = req;
            const user = await Users.findOne({
                where: {
                    id: userId
                }
            })
            if (!user) {
                throw HttpError(422, 'Error');
            }
            if (fs.existsSync(path.join(__dirname, '../public/', user.avatar))){
                fs.rmSync(path.join(__dirname, '../public/', user.avatar))
            }
            if (file && user) {
                await sharp(file.path)
                    .rotate()
                    .resize(512)
                    .jpeg({
                        quality: 75
                    })
                    .png({
                        quality: 75
                    })
                    .toFile(path.join(__dirname, '../public/images/users_img', file.filename))
            }
            user.set({
                avatar: "/images/users_img/"+file.filename
            });
            await user.save();
            res.json({
                status: 'ok',
                user
            })
        } catch (e) {
            next(e);
        }
    }
    static allUsers = async (req, res, next) => {
        const {of=1,limit=10} = req.query;
        const offset = (of-1)*10;
        try {
            const users = await Users.findAll({
                order: [['lastName', 'ASC']],
                limit,
                offset
            })
            res.json({
                status: 'ok',
                users
            })
        } catch (e) {
            next(e)
        }
    }
}

export default UserController
