import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new Schema ( {
    subscripber : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    channle : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
}, {timeseries})

export const Subscription = mongoose.model.Subscription ?? mongoose.model("Subscription" , subscriptionSchema)