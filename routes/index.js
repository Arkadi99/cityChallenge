import express from "express";
import users from "./users";
import company from "./company";
import challenge from "./challenge"

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({ status: 'ok' });
});

router.use('/users', users);
router.use('/company', company);
router.use('/challenge', challenge);





export default router;
