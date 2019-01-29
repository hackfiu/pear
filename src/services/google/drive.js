import { google } from "googleapis";
import { Duplex } from "stream";
import path from "path";
import fs from "fs";

import parse from "url-parse";

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_FOLDER_ID
} = process.env;

const SCOPE = "https://www.googleapis.com/auth/drive";

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  [SCOPE]
);

const drive = google.drive("v3");

const asyncUpload = (drive, payload) =>
  new Promise((resolve, reject) => {
    drive.files.create(payload, (err, res) => {
      if (err) reject(err);

      resolve(res.data);
    });
  });

const asyncDownload = fileId =>
  new Promise(async (resolve, reject) => {
    drive.files.get({ auth, fileId, alt: "media" }, async (err, res) => {
      if (err) reject(err);

      // logging for debugging
      Object.keys(res).map(key => console.log({ key }));

      const dest = path.resolve("tmp/resume.pdf");

      await fs.writeFileSync(dest, res.data);
      resolve();
    });
  });

const bufferToStream = buffer => {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const upload = async (file, filename, folder) => {
  const { mimetype, buffer } = file;

  try {
    await auth.authorize();

    const resource = { name: filename, parents: [GOOGLE_FOLDER_ID] };

    const media = { mimeType: mimetype, body: bufferToStream(buffer) };

    const payload = { auth, resource, media, fields: "webViewLink" };

    const { webViewLink } = await asyncUpload(drive, payload);

    return webViewLink;
  } catch (err) {
    throw err;
  }
};

const download = async () => {
  var fileId = "1z9KPijNlPAfhyb40RDjpGwTISRsy3A6F";
  await auth.authorize();

  const file = await asyncDownload(fileId);
  console.log({ file });
};

export default { upload, download };
