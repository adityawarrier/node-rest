import { model, Schema } from "mongoose";

interface ISession {
  user: Schema.Types.ObjectId;
  valid: boolean;
  userAgent: string;
}

const sessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const SessionModel = model<ISession>("Session", sessionSchema);

export { SessionModel, ISession };
