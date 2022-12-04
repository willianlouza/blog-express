import cloudinary from "cloudinary";
import env from "../../../env";

const cloud = cloudinary.v2;

cloud.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_KEY,
  api_secret: env.CLOUD_SECRET,
  secure: true,
});

export async function uploadImage(imageUploaded: string) {
  return new Promise((resolve, reject) => {
    cloud.uploader.upload(imageUploaded, (err, res) => {
      if (err) reject(err);
      resolve(res?.url);
    });
  });
}
