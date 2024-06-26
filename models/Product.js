const { mongoose, models } = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: {
      type: Number,
      required: true,
    },
    newProductCheck : {type: Boolean},
    popular : {type: Boolean},
    featured: { type: Boolean },
    images: { type: [String] },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

export const Product =
  models.Product || mongoose.model("Product", ProductSchema);
