import express from "express";
import { getUser, Login, logout, Register, updateProfile, addToWishlist, removeFromWishlist, getWishlist } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";

const userRoute = express.Router()

userRoute.post('/register', Register)
userRoute.post('/login', Login)
userRoute.post('/logout', logout)
userRoute.get('/getUser', protectRoute, getUser)
userRoute.post('/updateProfile', protectRoute, upload.single("profilePhoto"), updateProfile)
userRoute.post('/wishlist/add', protectRoute, addToWishlist)
userRoute.post('/wishlist/remove', protectRoute, removeFromWishlist)
userRoute.get('/wishlist', protectRoute, getWishlist)

export default userRoute
