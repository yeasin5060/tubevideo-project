import { app } from "./app.js";
import { PORT } from "./constant.js";
import { dbCannect } from "./db/index.js";

dbCannect()
app.listen(PORT , ()=> {
    console.log("server is running" , PORT)
})