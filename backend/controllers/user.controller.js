import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "All fields are required", success: false });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "try different Email", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Error in register controller:", error);
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Something is missing Please check", success: false });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect Email or Password", success: false });
    }

    
    const token = await jwt.sign({userId: user._id}, process.env.SECRET_KEY,{expiresIn:"1d"});
    user = {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
    }
   
    return res.cookie('token',token,{httpOnly:true, sameSite:'strict',maxAge:1*24*60*60*1000}).json({
        message:`Wlcome Back ${user.username}`,
        success:true,
        user,

    })

  } catch (error) {
    console.error("Error in login controller:", error);
  }
}


export const logout = async (req, res) => {
  try {
    return res
      .clearCookie("token","", {maxAge:0})
      .json({ message: "Logout successfully", success: true });
  } catch (error) {
    console.error("Error in logout controller:", error);
  }
};


export const getProfile = async (req, res) => {
  try {
    const {id: userId } = req.params;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "User ID is required", success: false });
    }

    // Check if user exists
    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getProfile controller:", error);
  }
}


export const editProfile = async (req, res) => {
  try {
    const userId = req.id;

    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if(profilePicture) {
      const filrUri = getDataUri(profilePicture);
      cloudResponse =  await cloudinary.uploader.upload(filrUri)
    }

    // Check if user exists
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }    
    if(bio) user.bio = bio;
    if(gender) user.gender = gender;
    if(profilePicture) user.prodilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      user,
    });


}catch (error) {
    console.error("Error in updateProfile controller:", error);
    }}



    export const getSuggestedUsers = async (req, res) => {
      try {
        
        const suggestedUsers = await User.find({_id:{$ne:req.id}}).select("-password")
        if (!suggestedUsers) {
          return res
            .status(400)
            .json({ message: "currently do not have any users", success: false });
        }
  
        return res.status(200).json({
          message: "Suggested users fetched successfully",
          success: true,
          users: suggestedUsers,
        });
      } catch (error) {
        console.error("Error in getSuggestedUser controller:", error);
      }
    };


    export const followorunfollow = async (req, res) => {
        try{
            const followKrneWala = req.id;
            const jsikoFollowKarunga= req.params.id;
            if(followKrneWala === jsikoFollowKarunga){
                return res.status(400).json({message:"You cannot follow/unfollow yourself", success:false})
            }

            const user = await User.findById(followKrneWala);
            const targetUser = await User.findById(jsikoFollowKarunga); 

            if(!user || !targetUser){
                return res.status(400).json({message:"User not found", success:false})
            }

            // check krna he ki follow krna he ya unfollow
            const isFollowing = user.following.includes(jsikoFollowKarunga);
            if(isFollowing){
                await Promise.all([
                    User.updateOne({_id: followKrneWala}, {$pull:{following:jsikoFollowKarunga}}),
                    User.updateOne({_id: jsikoFollowKarunga}, {$pull:{followers:followKrneWala}}), 

                ])
                return res.status(200).json({message:"Unfollowed successfully", success:true})
            }else{
                await Promise.all([
                    User.updateOne({_id: followKrneWala}, {$push:{following:jsikoFollowKarunga}}),
                    User.updateOne({_id: jsikoFollowKarunga}, {$push:{followers:followKrneWala}}), 

                ])
                return res.status(200).json({message:"Followed successfully", success:true})
            }

        }catch (error) {
            console.error("Error in followOrUnfollow controller:", error);
        }
    }