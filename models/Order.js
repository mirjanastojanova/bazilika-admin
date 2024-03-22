const { mongoose, models } = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    line_items: Object,
    name: String,
    email: String,
    city: String,
    postalCode: String,
    streetAddress: String,
    country: String,
    paid: Boolean,
  },
  { timestamps: true }
);

export const Order = models.Order || mongoose.model("Order", OrderSchema);
