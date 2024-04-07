import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const onUpload = (file: File) => {
  const storage = getStorage()
  const storageRef = ref(storage, `cover-images/${file.name}`);
  const promise = uploadBytes(storageRef, file);


  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        const url = await getDownloadURL(res.ref);
        // preload the image
        let image = new Image();
        image.src = url;
        image.onload = () => {
          resolve(url);
        };
      }).catch((e) => {
        throw new Error(`Error uploading image. Please try again.`);
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => e.message,
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
