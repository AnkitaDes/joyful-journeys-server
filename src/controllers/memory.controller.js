import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/database.js";

const createMemory = asyncHandler(async (req, res) => {
  console.log("req:", req);
  const { users_id, description } = req.body;
  console.log("req.body:", req.body);
  console.log("description:", description);

  if ([users_id, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const imageLocalPath = req.file?.path;
  console.log("imageLocalPath:", imageLocalPath);
  console.log("req.file:", req.file);

  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  console.log("image:", image);

  if (!req.file) {
    throw new ApiError(400, "Image is required");
  }

  try {
    const [id] = await db("memories").insert({
      users_id,
      image: image.url,
      description,
      likes: 0,
    });

    const memory = await db("memories")
      .join("users", "memories.users_id", "=", "users.id")
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

const getAllMemories = asyncHandler(async (req, res, next) => {
  const memories = await db("memories").select("*");
  if (!memories) {
    throw new ApiError(404, "No memories found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { memories }, "Fetched all memories successfully")
    );
});

const getMemoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const memory = await db("memories").where({ id }).first();
  if (!memory) {
    throw new ApiError(404, "Memory not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { memory }, "Fetched memory successfully"));
});

const getAllUserMemories = asyncHandler(async (req, res, next) => {
  console.log("Request parameters:", req.params);
  const { users_id } = req.params;

  const userId = Number(users_id);

  console.log("User ID:", userId);

  const memories = await db("memories").where({ users_id: userId }).select("*");

  console.log("Memories:", memories);

  if (memories.length === 0) {
    throw new ApiError(404, "No memories found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, { memories }, "Fetched all memories successfully")
    );
});

const getAllOtherMemories = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const memories = await db("memories")
    .whereNot("users_id", userId)
    .select("*");
  if (!memories) {
    throw new ApiError(404, "No memories found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { memories },
        "Fetched all other memories successfully"
      )
    );
});

const updateMemory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { users_id, description } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const localFilePath = req.file.path;

  if (
    [users_id, description, localFilePath].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
  const imageUrl = cloudinaryResponse ? cloudinaryResponse.url : null;

  if (!imageUrl) {
    throw new ApiError(500, "Image upload failed");
  }

  const memory = {
    users_id,
    description,
    image: imageUrl,
  };

  const existingMemory = await db("memories").where({ id }).first();

  if (!existingMemory) {
    throw new ApiError(404, "Memory not found");
  }

  const updateCount = await db("memories").where({ id }).update(memory);

  if (!updateCount) {
    throw new ApiError(500, "Memory update failed");
  }

  const updatedMemory = await db("memories").where({ id }).first();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { memory: updatedMemory },
        "Memory updated successfully"
      )
    );
});

const deleteMemory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedRows = await db("memories").where({ id }).del();

  if (!deletedRows) {
    throw new ApiError(404, "Memory not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Memory deleted successfully"));
});

export {
  createMemory,
  addLike,
  getAllMemories,
  getMemoryById,
  getAllUserMemories,
  getAllOtherMemories,
  updateMemory,
  deleteMemory,
};
