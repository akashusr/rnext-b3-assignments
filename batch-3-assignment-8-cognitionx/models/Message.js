import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  ragContext: [
    {
      id: String,
      fileName: String,
      similarity: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
