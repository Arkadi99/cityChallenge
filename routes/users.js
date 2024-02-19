import express from "express";
import UserController from "../controllers/UserController";
import multer from "multer";
import HttpError from "http-errors";
import {v4 as uuIdV4} from "uuid"
import os from "os";
import checkAuth from "../middlewares/checkAuth";
const router = express.Router();

const imgUpdate = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, os.tmpdir())
            // cb(null, path.join(__dirname,'public/users_img'))
        },
        filename: (req, file, cb) => {
            if(!['image/jpeg', 'image/png'].includes(file.mimetype)){
                cb(HttpError(422, 'Invalid file type'))
                return;
            }
            cb(null, `${uuIdV4()}_${file.originalname}` );
        }
    })
})



router.post('/register', UserController.register);
router.get('/confirmEmail', UserController.confirmEmail);
router.post('/login', UserController.login);
router.get('/info',checkAuth, UserController.userInfo);
router.get('/allUsers', UserController.allUsers);
router.put('/update',checkAuth, UserController.updateProfile);
router.delete('/delete',checkAuth, UserController.delete);
router.get('/passwordChange', UserController.passwordChange);
router.get('/passwordChangeCode', UserController.passwordChangeCode);
router.get('/googleLogin', UserController.googleLogin);
router.put('/imgUpdate',checkAuth, imgUpdate.single('avatar'), UserController.imgUpdate);
export default router;
