import { Router } from "express";
import { login, register } from "../controllers/users.controllers.js";


const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);

export default router