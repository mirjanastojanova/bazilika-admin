import multiparty from "multiparty";
import { v2 as cloudinary } from "cloudinary";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const handle = async (req, res) => {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  const links = [];
  const deletedImages = [];

  if (method === "POST") {
    for (const file of files.file) {
      const ext = file.originalFilename.split(".").pop();
      const newFilename = Date.now() + "." + ext;
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        public_id: newFilename,
      });
      links.push(uploadedImage.url);
    }
  } 
  // else if (method === "DELETE") {
  //   for (const productId of fields.deletedProductImages) {
  //     const publicId = fields[`${productId}_public_id`];
  //     try {
  //       await cloudinary.uploader.destroy(publicId);
  //       deletedImages.push(publicId);
  //     } catch (error) {
  //       console.error("Error deleting image:", error);
  //     }
  //   }
  // }

  return res.json({ links, deletedImages });
};

export const config = {
  api: { bodyParser: false },
};

export default handle;
