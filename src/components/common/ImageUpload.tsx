import React, { useState, useEffect } from "react";
import { Upload, Image as AntdImage, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { useTranslation } from "react-i18next";

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
type DisplayType = "avatar" | "picture-wall" | "picture-circle";

interface ImageUploadProps {
  uploadUrl?: string;
  displayType?: DisplayType;
  aspectRatio?: AspectRatio;
  maxCount?: number;
  maxFileSize?: number;
  imageWidth?: number;
  imageHeight?: number;
  onUploadSuccess?: (response: { url: string; name: string }) => void;
  onUploadError?: (error: { message: string; code: number }) => void;
  customRequest?: (options: UploadRequestOption<RcFile>) => void;
  onDelete?: (file: UploadFile) => void;
  loading?: boolean;
  value?: string | string[];
  centered?: boolean;
  folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  uploadUrl,
  displayType = "picture-wall",
  aspectRatio,
  maxCount = 3,
  maxFileSize,
  imageWidth,
  imageHeight,
  customRequest,
  onDelete,
  loading = false,
  value,
  centered = false,
  folder = "images",
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    
      console.log('value',value);
    if (value) {
      
      const urls = Array.isArray(value) ? value : [value];
      const initialFiles = urls
        .filter((url): url is string => typeof url === "string")
        .map((url, index) => ({
          uid: `-${index}`,
          name: url.split("/").pop() || `image-${index}`,
          status: "done" as const,
          url: url,
        }));
      setFileList(initialFiles);
    } else {
      setFileList([]);
    }
  }, [value, folder]);

  const validateImage = (file: RcFile): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        setErrorMessage(t("imageUpload.errorOnlyImages"));
        reject(false);
        return;
      }

      if (maxFileSize) {
        const isLessThanMaxSize = file.size / 1024 / 1024 < maxFileSize;
        if (!isLessThanMaxSize) {
          setErrorMessage(t("imageUpload.errorMaxSize", { maxFileSize }));
          reject(false);
          return;
        }
      }

      const getAspectRatioValues = (ratio: AspectRatio): number => {
        const [width, height] = ratio.split(":").map(Number);
        return width / height;
      };

      if (imageWidth || imageHeight) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (aspectRatio) {
            const expectedRatio = getAspectRatioValues(aspectRatio);
            const actualRatio = img.width / img.height;
            if (Math.abs(actualRatio - expectedRatio) > 0.1) {
              setErrorMessage(t("imageUpload.errorAspectRatio", { aspectRatio }));
              reject(false);
              return;
            }
          }
          if (img.width !== imageWidth || img.height !== imageHeight) {
            setErrorMessage(t("imageUpload.errorDimensions", { imageWidth, imageHeight }));
            reject(false);
            return;
          }
          setErrorMessage(""); // Clear error when validation passes
          resolve(true);
        };
      } else {
        setErrorMessage(""); // Clear error when validation passes
        resolve(true);
      }
    });
  };

  const handlePreview = async (file: UploadFile) => {
    let previewImageUrl = file.url || (file.preview as string);
    if (file.originFileObj) {
      previewImageUrl = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(previewImageUrl);
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    setErrorMessage(""); // Clear error when removing file
    onDelete?.(file);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.map((file) => {
      if (file.response && file.response.filename) {
        return {
          ...file,
          url: file.response.filename,
        };
      }
      return file;
    });
    setFileList(updatedFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t("imageUpload.title")}</div>
    </div>
  );

  return (
    <>
      <Spin spinning={loading}>
        <div className={centered ? "flex flex-col items-center w-full" : ""}>
          <Upload
            name="file"
            listType={
              displayType === "avatar"
                ? "picture-circle"
                : displayType === "picture-circle"
                ? "picture-circle"
                : "picture-card"
            }
            fileList={fileList}
            customRequest={customRequest}
            beforeUpload={validateImage}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
            action={uploadUrl}
            maxCount={maxCount}
            multiple={maxCount > 1}
            className={`${centered ? "flex justify-center" : ""} ${
              errorMessage ? "ant-upload-error" : ""
            }`}
          >
            {fileList.length < maxCount ? uploadButton : null}
          </Upload>
          {previewImage && (
            <AntdImage
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          {errorMessage && (
            <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>
          )}
        </div>
      </Spin>
    </>
  );
};

export default ImageUpload;
