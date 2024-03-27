const { mongoose, models } = require("mongoose");
const Schema = mongoose.Schema;

const ActionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: {
      type: Number,
      required: true,
    },
    images: { type: [String] },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Action =
  models.Action || mongoose.model("Action", ActionSchema);