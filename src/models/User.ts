import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string; // Unique username for the user
  avatar?: string; // URL to the profile picture
  bio?: string; // Short bio for the user
  followers: mongoose.Types.ObjectId[]; // Array of user IDs who follow this user
  following: mongoose.Types.ObjectId[]; // Array of user IDs this user is following
  isVerified: boolean; // Whether the user's email has been verified
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Username field
    avatar: { type: String }, // Profile picture URL (optional)
    bio: { type: String }, // Bio (optional)
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of people the user is following
    isVerified: { type: Boolean, default: false }, // Email verification status
  },
  { timestamps: true }
);

userSchema.index({ username: "text", bio: "text" });


// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Method to follow another user
userSchema.methods.follow = async function (userId: mongoose.Types.ObjectId) {
  if (!this.following.includes(userId)) {
    this.following.push(userId);
    await this.save();
  }
};

// Method to unfollow another user
userSchema.methods.unfollow = async function (userId: mongoose.Types.ObjectId) {
  this.following = this.following.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  await this.save();
};

// Method to add a follower
userSchema.methods.addFollower = async function (userId: mongoose.Types.ObjectId) {
  if (!this.followers.includes(userId)) {
    this.followers.push(userId);
    await this.save();
  }
};

// Method to remove a follower
userSchema.methods.removeFollower = async function (userId: mongoose.Types.ObjectId) {
  this.followers = this.followers.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  await this.save();
};

const User = models?.User || model<IUser>("User", userSchema);

export default User;


// Usage Example
// Creating a User:
// const newUser = await User.create({
//   email: "user@example.com",
//   password: "password123",
//   username: "newuser",
//   bio: "This is my bio!",
//   profilePicture: "https://example.com/profile.jpg",
//   isVerified: false, // Set to true after email verification
// });
// Comparing Password:
// const user = await User.findOne({ email: "user@example.com" });
// const isMatch = await user.comparePassword("password123");
// if (isMatch) {
//   console.log("Password matched!");
// } else {
//   console.log("Password does not match.");
// }
// Following a User:
// const user = await User.findById(userId);
// const userToFollow = await User.findById(userToFollowId);

// await user.follow(userToFollow._id);
// await userToFollow.addFollower(user._id);
// Unfollowing a User:
// const user = await User.findById(userId);
// const userToUnfollow = await User.findById(userToUnfollowId);

// await user.unfollow(userToUnfollow._id);
// await userToUnfollow.removeFollower(user._id);
// Retrieving Users (For Followers/Following):
// const user = await User.findById(userId).populate('followers').populate('following');
// console.log(user.followers); // List of followers
// console.log(user.following); // List of users they are following

// ***Search Query Example:
// const users = await User.find({ $text: { $search: "junaid" } });
