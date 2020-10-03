import mongoose from "mongoose";

export interface ClassDocument extends mongoose.Document {
  id: string;
  name: string;
  period: string | null;
  videos: {
    id: string; // Id of the Video
  }[];
}

const ClassSchema = new mongoose.Schema({
  name: String,
  period: String,
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
});

const Class = mongoose.model<ClassDocument>("Class", ClassSchema);

export default Class;
