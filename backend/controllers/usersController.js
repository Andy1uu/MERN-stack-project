const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (request, response) => {
  const users = await User.find().select("-password").lean();
  if(!users?.length) {
    return response.status(400).json({message: "No users found."});
  }
  response.json(users);

});

// @desc Create a new user
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (request, response) =>{
  const { username, password, roles } = request.body;

  // Check for valid data
  if(!username || !password || !Array.isArray(roles) || !roles.length){
    return response.status(400).json({message: "All fields are required."});
  }

  // Check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();
  if(duplicate) {
    return response.status(409).json({message:"Duplicate Username."});
  }

  // Hashing password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = {username, "password": hashedPassword, roles};

  const user = await User.create(userObject);
  
  if(user) {
    response.status(201).json({message: `New user ${username} created.`});
  } else {
    response.status(400).json({message: "Invalid user data recieved."});
  }
});

// @desc Delete a user
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (request, response) =>{
  const { id } = request.body;

  if(!id){
    return response.status(400).json({message: "User ID Required."});
  }

  const notes = await Note.findOne({user: id}).lean().exec();
  if(notes?.length){
    return response.status(400).json({message: "User has assigned notes."});
  }

  const user = await User.findById(id).exec();
  if(!user) {
    return response.status(400).json({message: "User not found."});
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted.`;

  response.json(reply);
});

module.exports = {getAllUsers, createNewUser, deleteUser};