import express from "express";
import ChallengeController from "../controllers/ChallengeController";
import multer from "multer";
import HttpError from "http-errors";
import {v4 as uuIdV4} from "uuid"
import os from "os";
import checkAuth from "../middlewares/checkAuth";


const createChallengeImg = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, os.tmpdir())
        },
        filename: (req, file, cb) => {
            if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
                cb(HttpError(422, 'Invalid file type'))
                return;
            }
            cb(null, `${uuIdV4()}_${file.originalname}`);
        }
    })
})

const router = express.Router();
router.post('/createChallenge', checkAuth, createChallengeImg.single('img'), ChallengeController.createChallenge);
router.post('/allChallenge', ChallengeController.allChallenge);
router.get('/myChallenge', checkAuth, ChallengeController.myChallenge);
router.delete('/delete', checkAuth, ChallengeController.deleteChallenge);


export default router;
