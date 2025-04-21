import express from "express";
import authController from "../controllers/authController";
import middleware from "../middleware/middleware";
import aclMidlleware from "../middleware/acl.midlleware";
import { ROLES } from "../utils/constant";
import mediaMidlleware from "../middleware/media.midlleware";
import mediaController from "../controllers/mediaController";
import categoryController from "../controllers/categoryController";

const router = express.Router();


router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', middleware, authController.me);
router.post('/auth/activation', authController.activation);

router.post('/category', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.create);
router.get('/category', categoryController.findAll);
router.get('/category/:id', categoryController.findOne);
router.put('/category/:id', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.update);
router.delete('/category/:id', [middleware, aclMidlleware([ROLES.ADMIN])], categoryController.remove);

router.post('/media/upload-single', [
  middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMidlleware.single('file')
], mediaController.single);
router.post('/media/upload-multiple',  [
    middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER]), mediaMidlleware.multiple('files')
  ], mediaController.multiple);
router.delete('/media/remove',  [
    middleware, aclMidlleware([ROLES.ADMIN, ROLES.MEMBER])
  ], mediaController.remove)



export default router;