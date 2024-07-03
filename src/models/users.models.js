import mongoose , {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const usersSchema = new Schema({
    userName : {
        type : String,
        require : true,
        unique : true
    },
    fullName : {
        type : String,
        require : true,
    },
    email : {
        type : String,
        require : true,
        unique : true

    },
    password : {
        type : String,
        require : true
    },
    avatar : {
        type : String
    },
    coverphoto : {
        type : String
    },
    videos : [
        {
            type : Schema.Types.ObjectId,
            ref : "Videos"
        }
    ],
    history : [
        {
            type : Schema.Types.ObjectId,
            ref : "History"
        }
    ],
    playlist : [
        {
            type : Schema.Types.ObjectId,
            ref : "Playlist"
        }
    ],
    refreshToken : {
        type : String
    }
} , {
    timestamps : true
});

usersSchema.pre("save" , async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10);
        next()
    }else{
        return next()
    }
});

usersSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
};

usersSchema.methods.accessToken = async function (){
    const accessToken =  jwt.sign({id : this._id , username : this.userName , email : this.email}, process.env.ACCESS_TOKEN_SECRET ,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    });
    return accessToken
};

usersSchema.methods.refreshToken = async function (){
    const refreshToken =  jwt.sign({id : this._id , username : this.userName , email : this.email}, process.env.REFRESH_TOKEN_SECRET ,{
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    });
    return refreshToken
};

export const Users = mongoose.model.Users ?? mongoose.model("Users" , usersSchema)