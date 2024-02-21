import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// generate access token

const generateAccessToken = async (userId) => {
  try {
    const user = await db("users").where("id", userId).first();

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};

// register user

const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  const { username, email, password } = req.body;
  console.log("email:", email);

  // validation-not empty
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: email, username
  const existingUser = await db("users")
    .where({ email })
    .orWhere({ username })
    .first();
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  console.log("existingUser:", existingUser);

  // create user object-create entry in mysql db
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    username,
    email,
    password_hash: hashedPassword,
  };
  const [id] = await db("users").insert(user);

  // remove password and refresh tokens from the response
  const userResponse = { id, username, email };

  // check for user creation
  if (!id) {
    throw new ApiError(500, "User creation failed");
  }

  // return response
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: userResponse },
        "User registered successfully"
      )
    );
});

// login user

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await db("users").where("email", email).first();

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken } = await generateAccessToken(user.id);

  const loggedInUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await db("users").where("id", id).first();

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
