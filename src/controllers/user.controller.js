import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import  {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req , res) => {
    //get user detail from frontend
    //validation - not empty
    //check is user alredy exixts: username//  email
     //upload them to clodinary,avatar
     //create user object- create entry in db
     //remove password and refresh token field from response
     //check for user creation 
     // return result


   const {fullname, email , username , password} = req.body;
        console.log("email:", email);
   if(
    [fullname, email,username,password].some((field)=> field?.trim()==="")

   ){
    throw new ApiError(400,"All fields are required")
   }

    const existedUser = await User.findOne({
    $or: [ {username}, {email} ]
   })
console.log("USERNAME:", username);
console.log("EMAIL:", email);
console.log("EXISTED USER:", existedUser);

    if (existedUser){
        throw new ApiError(409, "user with email or username already exist")
    }
   console.log("REQ.FILES =", req.files);
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath= req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
          throw new ApiError(400,"Avatar file is required")
    }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
      fullname,
      avatar : avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()

    })
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
      if (!createdUser){
         throw new ApiError(500, "something went wrong while registering the user ")
      }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "USer registerd Successfully")
  )
} )
export {registerUser
    ,
}