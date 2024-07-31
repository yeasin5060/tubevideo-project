import { Router } from "express";
import { changeCurrentPassword, generatorNewAccessToken, getUser, getUserChannleProfile, login, logOut, register, uploadAvatarAndcover, userAccoundDetails } from "../controllers/users.controllers.js";
import { auth } from "../middlewares/auth.meddlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(auth,logOut);
router.route("/generatorNewAccessToken").post(auth,generatorNewAccessToken);
router.route("/uploadPhoto").post(auth,upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "cover",
        maxCount : 3
    }
]),uploadAvatarAndcover);
router.route("/updatepassword").patch(auth,changeCurrentPassword);
router.route("/getuser").get(auth,getUser);
router.route("/updateprofile").patch(auth,userAccoundDetails);
router.route("/user-channle").get(getUserChannleProfile);

export default router