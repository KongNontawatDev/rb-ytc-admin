import { useState, useEffect } from "react";
import { Flex, Form, Input, InputNumber, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useRoomById } from "../hooks/useRoomQuery";
import { Room } from "../types";
import { useCreateRoom, useUpdateRoom } from "../hooks/useRoomMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useRoomPage } from "../hooks/useRoomPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useActiveList } from "../../../hooks/useActiveList";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";
import ImageUpload from "../../../components/common/ImageUpload";
import { UploadFile } from "antd/lib";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import AccessoryDropdown from "../../accessory/components/AccessoryDropdown";
import { getImage } from "../../../hooks/getImage";

const { Text } = Typography;

interface RoomFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

type FieldType = Partial<Room> & {
	accessorys: number[];
};

export default function RoomForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: RoomFormProps) {
	const { t } = useTranslation(["common", "validation", "room", "department"]);
	const [form] = Form.useForm<FieldType>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useRoomPage({});
	const { data, isPending: isDataLoading } = useRoomById(id);
	const createRoom = useCreateRoom(onSuccess);
	const updateRoom = useUpdateRoom(onSuccess);
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
	const [removedImages, setRemovedImages] = useState<string[]>([]);

	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;

	useEffect(() => {
		if (mode === "create") {
			form.resetFields();
			setExistingImages([]);
			setNewImageFiles([]);
			setRemovedImages([]);
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue(data.data);
			if (data.data.room_image) {
				const images = data.data.room_image.map((img: any) =>
					getImage(img.image, "room")
				);
				form.setFieldValue("image",images)
				setExistingImages(images);
			}
			if (data.data.room_accessory) {
				const accessorys = data.data.room_accessory.map(
					(acc: any) => acc.accessory_id
				);
				form.setFieldValue("accessorys", accessorys);
			}
		}
	}, [form, mode, data]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		const hasChanges =
			JSON.stringify(currentValues) !== JSON.stringify(originalValues) ||
			newImageFiles.length > 0 ||
			removedImages.length > 0;
		setIsDirty(hasChanges);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({ isModify: isDirty });

	const handleCustomUpload = (options: UploadRequestOption) => {
		const { file, onSuccess } = options;

		if (file instanceof File) {
			setNewImageFiles((prev) => [...prev, file]);
			onSuccess?.({ status: "success", filename: URL.createObjectURL(file) });
		}
		setIsDirty(true);
	};

	const handleImageRemove = (file: UploadFile) => {
		if (file.url) {
			// Handling existing image removal
			const imageName = file.name;
			setRemovedImages((prev) => [...prev, imageName]);
			setExistingImages((prev) => prev.filter((img) => img !== imageName));
		} else {
			// Handling new image removal
			setNewImageFiles((prev) => prev.filter((f) => f.name !== file.name));
		}
		setIsDirty(true);
	};

	const handleSubmit = async (values: any) => {
		try {
			setIsSaving(true);
			const formData = new FormData();

			// Append all form values except image-related fields
			Object.keys(values).forEach((key) => {
				if (values[key] !== undefined && key !== "image") {
					formData.append(key, values[key].toString());
				}
			});

			if (mode === "create") {
				// For create mode, append all new images
				newImageFiles.forEach((file) => {
					formData.append("images[]", file);
				});
				await createRoom.mutateAsync(formData);
			} else if (mode === "edit" && id) {
				// For edit mode
				// Append new images if any
				newImageFiles.forEach((file) => {
					formData.append("images[]", file);
				});

				// Append removed images if any
				removedImages.forEach((imageName) => {
					formData.append("removeImages[]", imageName);
				});
				formData.append("id", String(id));
				// Send update request with formData
				await updateRoom.mutateAsync({
					id,
					formData, // ส่ง formData โดยตรง
				});
			}
			onSuccess();
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data.message);
			}
			console.error("Failed to save room:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("room:title")} />;
	}

	return (
		<Spin spinning={isDataLoading && mode !== "create"}>
			{errorSubmit && (
				<AlertSubmitFail
					message={t(
						mode == "create"
							? "common:createData.error"
							: "common:editData.error",
						{
							data: t("room:title"),
						}
					)}
					description={errorSubmit}
				/>
			)}
			<Form
				form={form}
				layout="vertical"
				onValuesChange={handleFormChange}
				onFinish={handleSubmit}
				disabled={shouldDisableForm}
				className="mt-4"
			>
				<Form.Item<FieldType>
					label={t("room:schema.image.label")}
					name="image"
					className="flex justify-center"
					tooltip={`${t("common:imageUpload.maxSize", { data: 5 })}, ${t(
						"common:imageUpload.supportedFormat"
					)}`}
				>
				{/* <div className="my-5"> */}
					<ImageUpload
						displayType="picture-wall"
						maxCount={10}
						maxFileSize={5}
						customRequest={handleCustomUpload}
						onDelete={handleImageRemove}
						loading={isSaving}
						centered={true}
						folder="room"
						value={existingImages}
					/>
				{/* </div> */}
				</Form.Item>
				<Form.Item<FieldType>
					label={t("room:schema.name.label")}
					name="name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.name.label"),
							}),
						},
						{
							max: 150,
							message: t("validation:maxLength", {
								field: t("room:schema.name.label"),
								max: 150,
							}),
						},
					]}
				>
					<Input
						allowClear
						showCount
						maxLength={150}
						placeholder={t("validation:placeholder", {
							field: t("room:schema.name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("name")}
									title={t("room:schema.name.label")}
								/>
							)
						}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label={t("room:schema.detail.label")}
					name="detail"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.detail.label"),
							}),
						},
					]}
				>
					<Input.TextArea
						rows={2}
						allowClear
						showCount
						maxLength={999}
						placeholder={t("validation:placeholder", {
							field: t("room:schema.detail.label"),
						})}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label={t("room:schema.location.label")}
					name="location"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.location.label"),
							}),
						},
						{
							max: 255,
							message: t("validation:maxLength", {
								field: t("room:schema.location.label"),
								max: 255,
							}),
						},
					]}
				>
					<Input
						allowClear
						showCount
						maxLength={255}
						placeholder={t("validation:placeholder", {
							field: t("room:schema.location.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("location")}
									title={t("room:schema.location.label")}
								/>
							)
						}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label={t("room:schema.size.label")}
					name="size"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.size.label"),
							}),
						},
					]}
				>
					<Select
						allowClear
						placeholder={t("validation:placeholderSelect", {
							field: t("room:schema.size.label"),
						})}
						disabled={shouldDisableForm}
						options={[
							{ label: "เล็ก", value: "เล็ก" },
							{ label: "กลาง", value: "กลาง" },
							{ label: "ใหญ่", value: "ใหญ่" },
							{ label: "โดม", value: "โดม" },
							{ label: "หอประชุม", value: "หอประชุม" },
						]}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					label={t("room:schema.capacity.label")}
					name="capacity"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.capacity.label"),
							}),
						},
					]}
				>
					<InputNumber
						className="w-full"
						min={1}
						max={9999}
						placeholder={t("validation:placeholder", {
							field: t("room:schema.capacity.label"),
						})}
					/>
				</Form.Item>

				<Form.Item<FieldType>
					// label={t("room:schema.accessory.label")}
					name="accessorys"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:schema.accessory.label"),
							}),
						},
					]}
				>
					<AccessoryDropdown
						label={t("room:schema.accessory.label")}
						placeholder={t("validation:placeholderSelect", {
							field: t("room:schema.accessory.label"),
						})}
						mode="multiple"
						onChange={() => {}}
						disabled={shouldDisableForm}
					/>
				</Form.Item>

				{(isReadOnly || mode == "edit") && (
					<Form.Item<FieldType>
						label={t("room:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("room:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("room:schema.status.label"),
							})}
							options={useActiveList(null) as any}
							disabled={shouldDisableForm}
						/>
					</Form.Item>
				)}

				{(isReadOnly || mode == "edit") && (
					<Flex wrap gap={15}>
						<Flex gap={5}>
							<Text type="secondary" className="text-xs">
								{t("common:created_at")} :{" "}
							</Text>
							<Text className="text-xs">
								{toDateTime(data?.data?.created_at)}
							</Text>
						</Flex>
						<Flex gap={5}>
							<Text type="secondary" className="text-xs">
								{t("common:updated_at")} :{" "}
							</Text>
							<Text className="text-xs">
								{toDateTime(data?.data?.updated_at)}
							</Text>
						</Flex>
					</Flex>
				)}

				<Flex justify="space-between" align="center" gap={5} className="mt-4">
					{mode == "edit" ? (
						<ButtonDelete
							title={t("common:delete")}
							danger={true}
							onDelete={async () => {
								await handleDelete(data?.data?.id), onCancel();
							}}
						/>
					) : (
						<span> </span>
					)}
					<span>
						<ButtonCancel
							type="text"
							onClick={onCancel}
							disabled={isSaving}
							title={isReadOnly ? t("common:close") : t("common:cancel")}
						/>
						{!isReadOnly && (
							<>
								<ButtonClearForm
									title={t("clear")}
									onClick={() => form.resetFields()}
									disabled={!isDirty || isSaving}
								/>
								<ButtonSave
									type="primary"
									disabled={!isDirty || isSaving}
									loading={isSaving}
									title={t("common:save", { data: t("common:data") })}
								/>
							</>
						)}
					</span>
				</Flex>
			</Form>
		</Spin>
	);
}
