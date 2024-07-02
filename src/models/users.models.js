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
    }else{
        return next()
    }
});

usersSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password);
};

usersSchema.methods.accessToken = async function (password){
    return await jwt.sign({ foo: 'bar' }, 'shhhhh');
};
