import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: "question" | "answear";
  voteType: "upvote" | "downvote";
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, require: true, ref: "User" },
    id: { type: Schema.Types.ObjectId, require: true },
    type: { type: String, require: true, enum: ["question", "answear"] },
    voteType: { type: String, require: true, enum: ["upvote", "downvote"] },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
