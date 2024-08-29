import axios from "axios";

export const imageUpload = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "my_upload_preset"); // Replace with your actual preset name

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );
  console.log(data);
  return data;
};
