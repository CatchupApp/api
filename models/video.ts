import mongoose from "mongoose";

export interface VideoDocument extends mongoose.Document {
  id: string;
  source: string;
  transcript: {
    text: string;
    timestamp: number;
  }[];
  analysis: {
    text: string[];
    keywords: string[];
  }[];
}

const VideoSchema = new mongoose.Schema({
  name: String,
  period: String,
  transcript: [
    {
      text: String,
      timestamp: Number,
    },
  ],
  analysis: [
    {
      text: String,
      keywords: [
        {
          type: String,
        },
      ],
    },
  ],
});

const Video = mongoose.model<VideoDocument>("Video", VideoSchema);

export default Video;
