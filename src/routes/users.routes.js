import { Router } from "express";
import { login, logOut, register } from "../controllers/users.controllers.js";
import { auth } from "../middlewares/auth.meddlewares.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(auth,logOut);

export default router