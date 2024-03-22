import multiparty from "multiparty";

import { v2 as cloudinary } from "cloudinary";
import { mongooseConnect } from "../../lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

const handle = async (req, res) => {
  await mongooseConnect();
  await isAdminRequest(req, res);
  // Check this for Promise:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
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
  for (const file of files.file) {
    const ext = file.originalFilename.split(".").pop();
    const newFilename = Date.now() + "." + ext;
    const urlToImage = await cloudinary.uploader.upload(
      file.path,
      { public_id: newFilename },
      function (error, result) {
        console.log(result);
      }
    );
    links.push(urlToImage.url);
  }

  return res.json({ links });
};

export const config = {
  api: { bodyParser: false },
};

export default handle;
