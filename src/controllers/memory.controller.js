import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/database.js";

const createMemory = asyncHandler(async (req, res) => {
  const { creator, description } = req.body;

  if ([creator, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(400, "Image file is required");
  }

  try {
    const [id] = await db("memories").insert({
      creator,
      image: image.url,
      description,
      likes: 0,
    });

    const memory = await db("memories")
      .join("users", "memories.creator", "=", "users.id")
      .where("memories.id", id)
      .select("memories.*", "users.username")
      .first();

    return res
      .status(201)
      .json(new ApiResponse(200, memory, "Memory created successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating the memory");
  }
});

const addLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const memory = await db("memories").where({ id }).first();

    if (!memory) {
      throw new ApiError(404, "Memory not found");
    }

    const updatedMemory = await db("memories")
      .where({ id })
      .update({ likes: memory.likes + 1 }, ["id", "likes"]);

    res
      .status(200)
      .json(new ApiResponse(200, updatedMemory, "Like added successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while adding a like");
  }
});

export { createMemory, addLike };
