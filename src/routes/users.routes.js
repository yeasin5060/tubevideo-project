import { Router } from "express";
import { users } from "../controllers/users.controllers.js";

const router = Router()

router.route("/register").post(users)

export default router