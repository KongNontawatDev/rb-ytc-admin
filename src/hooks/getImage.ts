export const getImage = (filename: string, folder: string) => {
  if (filename && filename.includes("https")) {
    return filename;
  }
  return `${import.meta.env.VITE_API_URL}/public/${folder}/${filename}`;
};
