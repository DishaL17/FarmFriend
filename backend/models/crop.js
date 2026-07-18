import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  crop: String,
  area: String,
  date: String,
});

export default mongoose.model("Crop", cropSchema);