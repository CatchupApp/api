import mongoose from "mongoose";

export interface VideoDocument extends mongoose.Document {
  id: string;
  name: string;
  source: string;
  date: Date;
  transcript: {
    text: string;
    confidence: number;
    words: {
      word: string;
      start: number;
      end: number;
    }[];
    keywords: {
      [entity: string]: {
        salience: number;
        mentions: string[],
        meta: {[key: string]: string};
      }
    };
  }[];
}

const VideoSchema = new mongoose.Schema({
  name: String,
  source: String,
  date: Date,
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
