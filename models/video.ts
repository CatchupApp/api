import mongoose from "mongoose";

export interface VideoDocument extends mongoose.Document {
  id: string;
  name: string;
  source: string;
  date: Date;
  transcription: {
    transcript: string;
    confidence: number;
    words: {
      word: string;
      start: number;
      end: number;
    }[];
    keywords: {
      [entity: string]: {
        salience: number;
        mentions: string[];
        meta: { [key: string]: string };
      };
    };
  }[];
}

const VideoSchema = new mongoose.Schema({
  name: String,
  source: String,
  date: Date,
  transcription: [
    {
      transcription: String,
      confidence: Number,
      words: [
        {
          word: String,
          start: Number,
          end: Number,
        },
      ],
    },
  ],
});

const Video = mongoose.model<VideoDocument>("Video", VideoSchema);

export default Video;
