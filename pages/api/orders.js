import { Order } from "../../models/Order";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    res.json(await Order.find().sort({ createdAt: -1 }));
  } else if (method === "PUT") {
    const { _id, delivered } = req.body;
    await Order.updateOne(
      { _id: _id },
      {
        delivered: delivered,
      }
    );
    res.json(true);
  } else if (method === "DELETE") {
    if (req.query?.id) {
      await Order.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
