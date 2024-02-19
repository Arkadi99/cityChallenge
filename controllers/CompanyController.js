import {Company, Users} from "../models";
import HttpError from "http-errors";
import Helpers from "../services/Helpers";
import jwt from "jsonwebtoken";
import ConfirmEmail from "../services/ConfirmEmail";
import fs from "fs";
import path from "path";
import sharp from "sharp";


class CompanyController {
    static register = async (req, res, next) => {
        try {
            const {email, password, companyName} = req.body
            const activationCode = Helpers.randomString(9)
            const company = await Company.create({
                email,
                password,
                companyName,
                activationCode,
                avatar: "http://localhost:4000/images/company_img/company.jpg",
                role: "company"
            });
            await ConfirmEmail.confirm(email, activationCode).catch(console.trace);
            const token = jwt.sign({
                id: company.id, role: company.role, email,
            }, process.env.SECRET_KEY)
            res.json({
                status: "ok", company, token
            })
        } catch (e) {
            next(e);
        }
    }
    static confirmEmail = async (req, res, next) => {
        try {
            const {email, code} = req.query
            const company = await Company.findOne({
                where: {email, activationCode: code}
            })
            if (!company) {
                throw HttpError(404, "not found");
            }
            company.status = "active"
            await company.save()
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
            const company = await Company.findOne({
                where: {
                    email, password: Company.passHash(password)
                }
            })
            if (!company) {
                throw HttpError(403, 'Invalid email or password');
            }
            if (company.status === 'pending') {
                throw HttpError(401, 'Your email is not confirmed')
            }
            const token = jwt.sign({
                id: company.id, role: company.role, email,
            }, process.env.SECRET_KEY)

            res.json({
                status: "ok", company, token
            })
        } catch (e) {
            next(e)
        }
    }
    static companyInfo = async (req, res, next) => {
        try {
            const {userId} = req;
            const company = await Company.findOne({
                where: {
                    id: userId
                }
            })
            if (!company) {
                throw HttpError(403, 'Not allowed');
            }
            res.json({
                status: "ok", company,
            })

        } catch (e) {
            next(e)
        }
    }
    static updateProfile = async (req, res, next) => {
        try {
            const {userId} = req
            const {
                number,
                city,
                address,
                industry,
                description
            } = req.body;
            const company = await Company.findOne({
                where: {
                    id: userId
                }
            })
            if (!company) {
                throw HttpError(403, 'Not allowed');
            }
            company.set({ number,
                city,
                address,
                industry,
                description,
                allFields:true
            });
            await company.save()
            res.json({
                status: "ok",
                company,
            })
        } catch (e) {
            next(e)
        }
    }
    static delete = async (req, res, next) => {
        try {
            const {userId} = req
            const company = await Company.findOne({
                where: {
                    id: userId
                }
            })
            if (!company) {
                throw HttpError(403, 'Not allowed');
            }
            if (fs.existsSync(path.join(__dirname, '../public/images/company_img', company.avatar))){
                fs.rmSync(path.join(__dirname, '../public/images/company_img', company.avatar))
            }
            await company.destroy()
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
            const company = await Company.findOne({
                where: {
                    email
                }
            })
            if (!company) {
                next(HttpError(403, 'Not allowed'))
            }
            const code = company.getDataValue("activationCode")
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
            const company = await Company.findOne({
                where: {
                    activationCode: code
                }
            })
            if (!company) {
                next(HttpError(403, 'Not allowed'))
            }
            company.password = password
            await company.save()
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    }
    static imgUpdate = async (req, res, next) => {
        try {
            const {userId, file} = req;
            const company = await Company.findOne({
                where: {
                    id: userId
                }
            })
            if (!company) {
                throw HttpError(422, 'Error');
            }
            if (fs.existsSync(path.join(__dirname, '../public/', company.avatar))){
                fs.rmSync(path.join(__dirname, '../public/', company.avatar))
            }
            if (file && company) {
                await sharp(file.path)
                    .rotate()
                    .resize(512)
                    .jpeg({
                        quality: 75
                    })
                    .png({
                        quality: 75
                    })
                    .toFile(path.join(__dirname, '../public/images/company_img', file.filename))
            }
            company.set({
                avatar: "/images/company_img/"+file.filename
            });
            await company.save();
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e);
        }
    }
    static allCompany = async (req, res, next) => {
        try {
            const {of} = req.query;
            const offset = (of-1)*10;
            const company = await Company.findAll({
                order: [['lastName', 'ASC']],
                limit: 10,
                offset
            })
            res.json({
                status: 'ok',
                company
            })
        } catch (e) {
            next(e)
        }
    }
    static companyRate = async (req, res, next) => {
        try {
            const {num,id} = req.query;
            const company = await Company.findOne({
                where: {
                    id
                }
            })
            company.set({
            });
            await company.save();
            res.json({
                status: 'ok',
                company
            })
        } catch (e) {
            next(e)
        }
    }
}

export default CompanyController
