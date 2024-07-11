import { Users } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generatorAccessAndRefreshToken = async (user) => {
  try {
    const accessToken = await user.generatorAccessToken();
    const refreshToken = await user.generatorRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error.message);
    throw new Error("Token generation failed");
  }
}

const register = async ( req , res) => {
  try {
    const {userName , fullName , email, password} = req.body;

  if([userName , fullName , email , password].some((field) => field ?.trim() === "")){
    return res.json( new ApiError(400 , "All field require"));
  }

  const existingUser = await Users.findOne({
      $or : [{userName } , {email}]
  })

  if(existingUser){
   return res.json({
      statuscode : 400,
      message : "username is all redy existed"
   })
  }

  const user = await Users.create({userName , fullName , email , password});
  const cteateUser = await Users.findById(user._id).select("-password -refreshToken");

  if(!cteateUser){
   return res.json(new ApiError(401 , "invalide user"));
  }
  res.json(new ApiResponse( 200 , "user create" , cteateUser ));
  } catch (error) {
    console.log(error.message);
  }
}

const login = async ( req , res) => {
    try {
      const {email , password} = req.body;
      
      if([email , password ].some((field) => field ?.trim () == "")){
        return res.json( new ApiError( 400 , "All field require"));
      }
    
      const userFound = await Users.findOne({ email });

      if(!userFound){
        return res.json( new ApiError( 400 , "user not found"));
      }

      const isPassword = await userFound.isPasswordCorrect(password);

      if(!isPassword){
        return res.json( new ApiError( 400 , "authtication faild"));
      }

      const { accessToken , refreshToken} = await generatorAccessAndRefreshToken(userFound);
      const loginUser = await Users.findById(userFound._id).select("-password")
      let options = {
        secure : true,
        httpOnly : true
      };
     res.cookie("accessToken" ,accessToken , options).cookie("refreshToken" ,refreshToken , options).json(new ApiResponse(200 , "login successfully" , {loginUser , accessToken}));

    } catch (error) {
      res.json(new ApiError( error.message));
    }
}

const logOut = async (req, res) => {
  await Users.findByIdAndUpdate(req.user,{
    $set : {
      refreshToken : null
    }
  })
  let options = {
    secure : true,
    httpOnly : true
  }
  res.cookie("accessToken" ,options).cookie("refreshToken" , options)
  res.json(new ApiResponse(200 , "ok"))
}

const uploadAvatarAndcover = async (req , res) => {
      res.send(req.file)
}
export{register , login , logOut , uploadAvatarAndcover}