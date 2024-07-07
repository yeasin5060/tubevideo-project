import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";
import { Users } from "../models/users.models.js";

export const auth = async (req , res , next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer" , "")
      if(!token){
        return res.json(new ApiError(401 , "unauthorized access" ));
      }

      const decodeToken = jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET)

      if(!decodeToken){
        return res.json(new ApiError(401 , "unauthorized access" ));
      }

      const user = await Users.findById(decodeToken._id)
      req.user = user
      next()
    } catch (error) {
      return res.json(new ApiError(401 , error.message ));
    }
}