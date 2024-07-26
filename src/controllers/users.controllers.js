import { Users } from "../models/users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinaryDelete, cloudinaryUpload } from "../utils/cioudinary.js";
import { publicidex } from "../utils/publicidex.js";
import jwt from "jsonwebtoken";


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
  res.clearCookie("accessToken" ,options).clearCookie("refreshToken" , options)
  res.json(new ApiResponse(200 , "successfuly refreshtoken null"))
}

const uploadAvatarAndcover = async (req , res) => {
      try {
        if(req.files){
          const {avatar , cover} = req.files
          if(avatar){
            const {path} = avatar[0]
            const {secure_url} = await cloudinaryUpload(path , "user")
            if(req.user.avatar){
              const publicId = publicidex(req.user.avatar)
              await cloudinaryDelete(publicId)
            }
            req.user.avatar = secure_url
            await req.user.save({validationBeforeSave : false})
            const user = await Users.findById(req.user._id).select("-password")
            res.json(new ApiResponse(200 , "avatar upload successfully", user))
          }else{
            res.json(new ApiError( 400 , "avatar upload field"))
          }
          
          if(cover){
            const {path} = cover[0]
            const {secure_url} = await cloudinaryUpload(path , "user")
            if(req.user.cover){
              const publicId = publicidex(req.user.cover)
              await cloudinaryDelete(publicId)
            }
            req.user.cover = secure_url
            await req.user.save()
            const user = await Users.findById(req.user._id).select("-password")
            res.json(new ApiResponse(200 , "cover upload successfully", user)) 
          }else{
            res.json(new ApiError( 400 , "cover upload field"))
          }
          
        }
        res.json(new ApiResponse(200 , "the file upload in cloudinary successfully"))
      } catch (error) {
        console.log(error.message);
        if (!res.headersSent) {
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        //res.json(new ApiError( 400 , " photo upload rejected" , error.message))
      }
}

const generatorNewAccessToken = async ( req , res) => {
    try {
      const token = req.cookies?.refreshToken || req.body.refreshToken
      if(!token){
        return res.json(new ApiError(401 , "refresh token not found" ));
      }

      const decodeToken = jwt.verify(token ,process.env.REFRESH_TOKEN_SECRET)

      if(!decodeToken){
        return res.json(new ApiError(401 , "refresh token don't match " ));
      }

      const user = await Users.findById(decodeToken._id)

      if(!user){
        return res.json(new ApiError(401 , "user don't match" ));
      }
      const { accessToken , refreshToken} = await generatorAccessAndRefreshToken(user);
      const loginUser = await Users.findById(user._id).select("-password")
      let options = {
        secure : true,
        httpOnly : true
      };
     res.cookie("accessToken" ,accessToken , options).cookie("refreshToken" ,refreshToken , options).json(new ApiResponse(200 , "token generated successfully" , {loginUser , accessToken}));

    } catch (error) {
      return res.json(new ApiError(401 , "don't add new refresh token in database" , error.message ));
    }
}

const changeCurrentPassword = async (req ,res) => {
  try {
    const {oldPassword , newPassword} =  req.body;
  
    if([oldPassword , newPassword].some((field) => field?.trim() == "")){
      res.json(new ApiError( 400 , "All fields is require"));
    };
  
    const user = await Users.findById(req.user._id);
    const isNewPassword = await user.isPasswordCorrect(oldPassword);
  
    if ( !isNewPassword){
      return res.json(new ApiError( 400 , "Invalid is password"));
    };
  
    user.password = newPassword;
    user.save({validationBeforeSave : false});
  
    const updatePassword = await Users.findById(user._id).select("-password");
  
    res.status(200).json(new ApiResponse(200 , "password update successfully" , updatePassword));
    
  } catch (error) {
    res.json(new ApiError (400 , "updatepassword error" , error.message))
  }
}

const getUser = async ( req , res) => {
  try {
    const user = await Users.findById(req.user._id).select("-password")

    return res.status(200).json(new ApiResponse( 200 , "get user successfully" , user))

  } catch (error) {
    res.json(new ApiError(400 , "invalid user" , error.message))
  }
}

export{register , login , logOut , uploadAvatarAndcover , generatorNewAccessToken ,changeCurrentPassword , getUser}