import express from "express";
import CompanyController from "../controllers/CompanyController";
import multer from "multer";
import HttpError from "http-errors";
import {v4 as uuIdV4} from "uuid"
import os from "os";
import checkAuth from "../middlewares/checkAuth";
const router = express.Router();

const imgUpdateCompany = multer({
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



router.post('/register', CompanyController.register);
router.get('/confirmEmail', CompanyController.confirmEmail);
router.post('/login', CompanyController.login);
router.get('/info',checkAuth, CompanyController.companyInfo);
router.get('/allCompany', CompanyController.allCompany);
router.put('/update', checkAuth,CompanyController.updateProfile);
router.delete('/delete',checkAuth, CompanyController.delete);
router.get('/passwordChange', CompanyController.passwordChange);
router.get('/passwordChangeCode', CompanyController.passwordChangeCode);
router.put('/imgUpdate',checkAuth, imgUpdateCompany.single('avatar'), CompanyController.imgUpdate);
// router.get('/companyRate', CompanyController.companyRate); kisate e

export default router;
