const { mongoose, models } = require("mongoose");
const Schema = mongoose.Schema;

const PriceListSchema = new Schema(
  {
    reden:{type:Number},
    naziv: String,
    cenam: String,
    pak: String,
  },
  { timestamps: true }
);

export const PriceList = models.PriceList || mongoose.model("PriceList", PriceListSchema);
