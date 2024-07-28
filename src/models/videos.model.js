import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videosSchema = new Schema({

    videofile : {
        type : String , 
        required : true
    },
    title : {
        type : String , 
        required : true,
        trmi : true
    },
    description : {
        type : String , 
        required : true,
        trmi : true
    },
    duration : {
        type : Number, // come in clodinary 
    },
    thumbnail : {
        type : String , // come in clodinary 
    },
    views : {
        type : Number , 
        default : 0
    },
    ispublish : {
        type : Boolean,
        default : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }


}, {timestamps : true})

videosSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model.Video?? mongoose.model("Video" , videosSchema)