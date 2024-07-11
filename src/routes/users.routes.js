import { Router } from "express";
import { login, logOut, register, uploadAvatarAndcover } from "../controllers/users.controllers.js";
import { auth } from "../middlewares/auth.meddlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(auth,logOut);
router.route("/uploadPhoto").post(auth,upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "cover",
        maxCount : 3
    }
]),uploadAvatarAndcover)

export default router