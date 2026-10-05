import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import { JsonWebTokenError } from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
         type: String,
         unique: true,
         required: true,
         lowercase: true,
         index: true,
         trim: true
        },
        email: {
         type: String,
         unique: true,
         required: true,
         lowercase: true,
         trim: true
        },
          fullname: {
         type: String,
       
         required: true,
        index: true,
         trim: true
        },
        avatar:{
            type: String,
            required: true,
        },
        coberImage: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectID,
                ref: "Video"
            }
        ],
        password:{
            type: String,
            required: [true,'password is required']

        },
        refreshToken: {
            type: String,
        }

    }, 
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.generateAccessToken = function(){
 return Jwt.sign(
    {
        _id:this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRETE,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
    {
        _id:this._id,
        
    },
    process.env.REFRESH_TOKEN_SECRETE,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    }
  )
}
export const USer = mongoose.model("User", userSchema)