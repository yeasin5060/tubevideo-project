import { Users } from "../models/users.models.js"
import { ApiError } from "../utils/ApiError.js"

const register = async ( req , res)=> {
  const {userName , fullName , email, password} = req.body

  if([userName , fullName , email , password].some((field) => field ?.trim() === "")){
    res.json( new ApiError())
  }

  const existingUser = await Users.findOne({
      $or : [{userName } , {email}]
  })

  if(!existingUser){
   res.json({
      statuscode : 200,
      message : "sob thik ache"
   })
  }
}

export{register}