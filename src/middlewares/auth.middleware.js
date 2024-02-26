import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import db from "../db/database.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    console.log("token:", token);

    if (!token || typeof token !== "string") {
      throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log("decodedToken:", decodedToken);
    } catch (error) {
      if (error.message === "jwt expired") {
        throw new ApiError(401, "Access token expired");
      } else {
        throw new ApiError(401, "Invalid Access Token");
      }
    }

    const user = await db("users").where({ id: decodedToken.id }).first();
    console.log("user:", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    delete user.password;

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export { verifyJWT };
