import {Company, Users, Challenge} from "../models";
import HttpError from "http-errors";
import sharp from "sharp";
import path from "path";

class ChallengeController {
    static createChallenge = async (req, res, next) => {
        try {
            const {userId, userRole, file} = req;
            let user = []
            let challenges = []
            let ownerName = ""
            let role = ""
            let companyId = null
            let usersId = null
            const {
                challengeName,
                challengeCity,
                challengeAddress,
                challengePrice,
                group,
                industry,
                description,
                startDate,
                endDate,
                difficulty,
                gift,
            } = req.body

            if (userRole === "tourist" || userRole === "vipTourist") {
                user = await Users.findOne({
                    where: {
                        id: userId
                    }
                })
                if (userRole === "tourist") {
                    challenges = await Challenge.findAll({
                            where: {
                                userId: userId
                            }
                        }
                    )
                    if (challenges.length >= 3) {
                        throw HttpError(403, 'You not vip');
                    }
                }
                if (!user) {
                    throw HttpError(403, 'Not allowed user');
                }
                if (!user.allFields) {
                    throw HttpError(403, 'Please register your profile Fields');
                }
                ownerName = user.nickname
                role = "users"
                usersId = userId
            }

            if (userRole === "vipCompany" || userRole === "company") {
                user = await Company.findOne({
                    where: {
                        id: userId
                    }
                })
                if (userRole === "company") {
                    challenges = await Challenge.findAll({
                            where: {
                                companyId: userId
                            }
                        }
                    )
                    if (challenges.length >= 3) {
                        throw HttpError(403, 'You not vip');
                    }
                }
                if (!user || !user.allFields) {
                    throw HttpError(403, 'Not allowed user');
                }
                ownerName = user.nickname
                role = "company"
                companyId = usersId
            }

            if (!file) {
                throw HttpError(403, 'You have not sent a picture');
            }


            const challenge = await Challenge.create({
                challengeName,
                img: "/images/challenge_img/" + file.filename,
                ownerName,
                role,
                challengeCity,
                challengeAddress,
                challengePrice,
                industry,
                description,
                startDate,
                endDate,
                difficulty,
                companyId: companyId,
                userId: usersId,
            });
            await sharp(file.path)
                .rotate()
                .resize(512)
                .jpeg({
                    quality: 75
                })
                .png({
                    quality: 75
                })
                .toFile(path.join(__dirname, '../public/images/challenge_img', file.filename))

            res.json({
                status: 'ok',
                challenge
            })
        } catch (e) {
            next(e)
        }
    }
    static allChallenge = async (req, res, next) => {
        try {
            const {of = 1, limit = 10, s} = req.query;
            const offset = (of - 1) * 10;
            let challenge = []
            const {
                challengeName,
                challengeCity,
                industry,
                startDate,
                endDate,
                difficulty,
                rating,
                userNum
            } = req.body
            if (challengeName || startDate || industry || difficulty || rating || userNum || challengeCity || s) {
                challenge = await Challenge.findAll({
                    where: {
                        $or: [
                            {challengeName: {$like: `%${s}%`}},
                            {challengeCity: {$like: `%${s}%`}},
                            {industry: {$like: `%${s}%`}},

                            {challengeName: {$like: `%${challengeName}%`}},
                            {challengeCity: {$like: `%${challengeCity}%`}},
                            {industry: {$like: `%${industry}%`}},
                            {difficulty: {$like: `%${difficulty}%`}},
                            {rating: {$like: `%${rating}%`}},
                            {userNum: {$like: `%${userNum}%`}},

                            {startDate: {$between: [startDate, endDate]}}, //test?
                        ],
                    },
                    order: [['challengeName', 'ASC']],
                    limit,
                    offset
                })
            } else {
                challenge = await Challenge.findAll()
            }

            res.json({
                status: 'ok',
                challenge
            })
        } catch (e) {
            next(e)
        }
    }
    static myChallenge = async (req, res, next) => {
        try {
            const {userId, userRole} = req;
            const {of = 1, limit = 10} = req.query;
            const offset = (of - 1) * 10;
            let companyId = null
            let usersId = null
            let role = ""

            if (userRole === "tourist" || userRole === "vipTourist") {
                role = "users"
                usersId = userId
            }
            if (userRole === "vipCompany" || userRole === "company") {
                role = "company"
                companyId = userId
            }
            const challenge = await Challenge.findAll({
                where: {
                    companyId: companyId,
                    userId: usersId,
                    role
                },
                order: [['challengeName', 'ASC']],
                limit,
                offset
            })
            res.json({
                status: 'ok',
                challenge
            })
        } catch (e) {
            next(e)
        }
    }
    static deleteChallenge = async (req, res, next) => {
        try {
            const {userId, userRole} = req;
            let companyId = null
            let usersId = null
            let role = ""
            if (userRole === "tourist" || userRole === "vipTourist") {
                role = "users"
                usersId = userId
            }
            if (userRole === "vipCompany" || userRole === "company") {
                role = "company"
                companyId = userId
            }
            const challenge = await Challenge.destroy({
                where: {
                    companyId: companyId,
                    userId: usersId,
                    role
                },
            })
            res.json({
                status: 'ok',
            })
        } catch (e) {
            next(e)
        }
    }
}

export default ChallengeController
