import express from "express";
import authController from "../controllers/authController";
import middleware from "../middleware/middleware";

const router = express.Router();


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', middleware, authController.me);


export default router;