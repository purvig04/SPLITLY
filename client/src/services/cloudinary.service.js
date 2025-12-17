import gql from "graphql-tag";
import apolloClient from "@/apollo";

const REQUEST_AVATAR_UPLOAD = gql`
  mutation RequestAvatarUpload {
    requestAvatarUpload {
      signature
      timestamp
      public_id
      cloud_name
      api_key
    }
  }
`;

export const getCloudinarySignature = async () => {
  const { data } = await apolloClient.mutate({
    mutation: REQUEST_AVATAR_UPLOAD,
  });

  return data.requestAvatarUpload;
};

export const uploadAvatar = async (file) => {
  const { signature, timestamp, public_id, cloud_name, api_key } =
    await getCloudinarySignature();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("public_id", public_id);
  formData.append("overwrite", "true");
  formData.append("invalidate", "true");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Error Uploading Image to Cloudinary!!");
  }

  const data = await res.json();

  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    version: data.version,
  };
};

export const CLOUDINARY_CLOUD_NAME = process.env.VUE_APP_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;
