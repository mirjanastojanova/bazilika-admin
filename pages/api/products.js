import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import multiparty from "multiparty";
import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const {
      title,
      description,
      price,
      newProductCheck,
      popular,
      featured,
      images,
      category,
    } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      newProductCheck,
      popular,
      featured,
      images,
      category,
    });
    res.json(productDoc);
  }
  if (method === "PUT") {
    const {
      _id,
      title,
      description,
      price,
      newProductCheck,
      popular,
      featured,
      images,
      category,
    } = req.body;
    await Product.updateOne(
      { _id: _id },
      {
        title: title,
        description: description,
        price: price,
        newProductCheck: newProductCheck,
        popular: popular,
        featured: featured,
        images: images,
        category: category,
      }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      const product = await Product.findById({ _id: req.query?.id });
      for (const image of product.images) {
        // Extract the public ID of the image (assuming the URL structure is consistent)
        const parts = image.split("/");
        const fileName = parts.pop(); // Get the last part of the URL, which is the file name
        const [publicId, extension] = fileName.split("."); // Split the file name into public ID and extension
        const completePublicId = `${publicId}.${extension}`;
        console.log("Public ID:", completePublicId);
        // Delete the image from Cloudinary
        await cloudinary.uploader
          .destroy(completePublicId)
          .then((result) => console.log(result));
      }
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
