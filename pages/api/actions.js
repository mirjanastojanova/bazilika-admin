import { Action } from "../../models/Action";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Action.findOne({ _id: req.query.id }));
    } else {
      res.json(await Action.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category } = req.body;
    const productDoc = await Action.create({
      title,
      description,
      price,
      images,
      category,
    });
    res.json(productDoc);
  }
  if (method === "PUT") {
    const { _id, title, description, price, images, category } = req.body;
    await Action.updateOne(
      { _id: _id },
      {
        title: title,
        description: description,
        price: price,
        images: images,
        category: category,
      }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Action.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
