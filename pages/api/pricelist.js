import fs from 'fs';
import multi  from 'multiparty';
import csvParser from 'csv-parser';
import {mongooseConnect} from '../../lib/mongoose';
import {PriceList} from '../../models/PriceList.js';
import { isAdminRequest } from './auth/[...nextauth]';

async function parseForm(req) {
  const form = new multi.Form();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// ✅ Exported directly as a default function (CommonJS-style)
export default async function handler(req, res) {

  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === "GET") {
    const pricelist = await PriceList.find().sort({ createdAt: -1 });
    return res.status(200).json(pricelist);
  }

  if (req.method === "POST") {
    const { files } = await parseForm(req);
    const file = files.csv?.[0];

    if (!file) {
      return res.status(400).json({ error: "No CSV file uploaded" });
    }

    const results = [];

    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        results.push({
          reden:row.reden,
          naziv: row.naziv,
          cenam: row.cenam,
          pak: row.pak,
        });
      })
      .on("end", async () => {
        const operations = results.map(row => ({
          updateOne: {
            filter: { reden: row.reden },
            update: { $set: row },
            upsert: true, // insert if not found
          },
        }));
      
        try {
          const result = await PriceList.bulkWrite(operations);
          fs.unlinkSync(file.path);
          res.status(200).json({ message: "CSV imported", stats: result });
        } catch (err) {
          res.status(500).json({ error: "Upload failed", details: err.message });
        }
      });
      
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
// ✅ Export config separately (NOT as `handler.config`)
export const config = {
  api: {
    bodyParser: false,
  },
};
