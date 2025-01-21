import React, { useState } from "react";
import { Divider, Space, Spin, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { useTranslation } from "react-i18next";

const { Dragger } = Upload;

interface DocumentUploadProps {
	uploadUrl?: string;
	maxCount?: number;
	maxFileSize?: number; // in MB
	onUploadSuccess?: (response: { url: string; name: string }) => void;
	onUploadError?: (error: { message: string; code: number }) => void;
	customRequest?: (options: UploadRequestOption<RcFile>) => void;
	onDelete?: (file: UploadFile) => void;
	allowedTypes?: string[]; // Array of allowed file extensions
  loading?:boolean
}

const DEFAULT_ALLOWED_TYPES = [
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/csv",
];

const DocumentUpload: React.FC<DocumentUploadProps> = ({
	uploadUrl,
	maxCount = 5,
	maxFileSize = 10, // Default 10MB
	onUploadSuccess,
	onUploadError,
	customRequest,
	onDelete,
	allowedTypes = DEFAULT_ALLOWED_TYPES,
	loading = false
}) => {
	const { t } = useTranslation();
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const validateFile = (file: RcFile): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			// Check file type
			const isAllowedType = allowedTypes.includes(file.type);
			if (!isAllowedType) {
				message.error(t("documentUpload.invalidFileType"));
				reject(false);
				return;
			}

			// Check file size
			const isLessThanMaxSize = file.size / 1024 / 1024 < maxFileSize;
			if (!isLessThanMaxSize) {
				message.error(
					t("documentUpload.maxSizeExceeded", { size: maxFileSize })
				);
				reject(false);
				return;
			}

			resolve(true);
		});
	};

	const handleRemove = (file: UploadFile) => {
		const newFileList = fileList.filter((item) => item.uid !== file.uid);
		setFileList(newFileList);
		onDelete?.(file);
	};

	const uploadProps: UploadProps = {
		name: "file",
		multiple: true,
		action: uploadUrl,
		beforeUpload: validateFile,
		customRequest,
		onChange: ({ fileList: newFileList, file }) => {
			setFileList(newFileList);

			if (file.status === "done") {
				onUploadSuccess?.(file.response);
			} else if (file.status === "error") {
				onUploadError?.({
					message: "Upload failed",
					code: file.error?.status || 500,
				});
			}
		},
		fileList,
		maxCount,
		onRemove: handleRemove,
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};

	const getAllowedExtensions = () => {
		const extensionMap: { [key: string]: string } = {
			"application/pdf": "PDF",
			"application/msword": "DOC",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
				"DOCX",
			"application/vnd.ms-excel": "XLS",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				"XLSX",
			"text/csv": "CSV",
		};

		return allowedTypes.map((type) => extensionMap[type] || type).join(", ");
	};

	return (
		<Spin spinning={loading}>
			<Dragger {...uploadProps}>
				<p className="ant-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="ant-upload-text">{t("documentUpload.dragText")}</p>
				<p className="ant-upload-hint">{t("documentUpload.uploadHint")}</p>
				<div style={{ marginTop: 8 }}>
					<Space split={<Divider type="vertical" />} wrap>
						<small>
							{t("documentUpload.allowedTypes", {
								types: getAllowedExtensions(),
							})}
							,
						</small>
						<small>{t("documentUpload.maxSize", { data: maxFileSize })}</small>
						<small>{t("documentUpload.maxCount", { data: maxCount })}</small>
					</Space>
				</div>
			</Dragger>
		</Spin>
	);
};

export default DocumentUpload;
