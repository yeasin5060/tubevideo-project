import bcrypt from "bcrypt"
import { Users } from "../models/users.models";
const users = async ( req , res)=> {
    const {userName , fullName , email , password} = req.body;

    if([userName , fullName , email , password].some((field) => field ?.tirm() == "")){
        res.send("every thing is need" );
    }else{
        const hashPassword = await bcrypt.hash(password , 10);
        const user = await Users.create(userName , fullName , email , hashPassword)
        const removepass = await Users.findById(user._id).select("-password")
        res.json({message : "every thing ok"} , removepass)
    }
}

export{users}