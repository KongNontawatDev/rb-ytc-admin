import { useState, useEffect } from "react";
import { Flex, Form, Input, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import {  useAccessoryById } from "../hooks/useAccessoryQuery";
import { Accessory } from "../types";
import {
	useCreateAccessory,
	useUpdateAccessory,
} from "../hooks/useAccessoryMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useAccessoryPage } from "../hooks/useAccessoryPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useActiveList } from "../../../hooks/useActiveList";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";
import ImageUpload from "../../../components/common/ImageUpload";
import { getImage } from "../../../hooks/getImage";
const { Text } = Typography;

interface AccessoryFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function AccessoryForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: AccessoryFormProps) {
	const { t } = useTranslation(["common", "validation", "accessory"]);
	const [form] = Form.useForm<Accessory>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useAccessoryPage({});
	const { data, isPending: isDataLoading } = useAccessoryById(id);
	const createAccessory = useCreateAccessory(onSuccess);
	const updateAccessory = useUpdateAccessory(onSuccess);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isImageRemoved, setIsImageRemoved] = useState(false);

	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;

	// Reset form when mode or data changes
	useEffect(() => {
		if (mode === "create") {
			form.resetFields();
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue(data?.data);
			form.setFieldValue("image",getImage(data?.data?.image,"accessory"))
		}
	}, [form, mode, data]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(originalValues);
		setIsDirty(hasChanges || isImageRemoved || !!imageFile);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({isModify:isDirty});

	const handleCustomUpload = async ({ file, onSuccess: onUploadSuccess }: any) => {
		setImageFile(file);
		setIsImageRemoved(false);
		setIsDirty(true);
		onUploadSuccess?.();
	};

	const handleImageRemove = () => {
		setImageFile(null);
		setIsImageRemoved(true);
		setIsDirty(true);
		form.setFieldValue('image', '');
	};

	const handleSubmit = async (values: Accessory) => {
		try {
			setIsSaving(true);

			const formData = new FormData();
			const convertToString = (value: string | number | Date | undefined): string => {
				if (value === undefined || value === null) return '';
				if (value instanceof Date) return value.toISOString();
				return String(value);
			};

			Object.entries(values).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, convertToString(value));
				}
			});

			// Handle image upload
			if (imageFile) {
				formData.append('image', imageFile);
			} else if (mode === 'edit' && data?.data?.image && !isImageRemoved) {
				// If editing and no new image is selected, send the existing image URL
				formData.append('image', convertToString(data.data.image));
			} else if (isImageRemoved) {
				// If image was removed, send empty string
				formData.append('image', '');
			}

			if (mode === "edit" && id) {
				await updateAccessory.mutateAsync({ id, ...Object.fromEntries(formData.entries()) as any});
			} else {
				await createAccessory.mutateAsync(Object.fromEntries(formData.entries()) as any);
			}
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save accessory:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("accessory:title")} />;
	}

	return (
		<Spin spinning={isDataLoading && mode !== "create"}>
			{errorSubmit && (
				<AlertSubmitFail
					message={t(mode=="create"?"common:createData.error":"common:editData.error", {
						data: t("accessory:title"),
					})}
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
				<Form.Item
					label={t("accessory:schema.image.label")}
					name="image"
					className="flex justify-center"
					// rules={[
					// 	{
					// 		required: true,
					// 		message: t("validation:required", {
					// 			field: t("accessory:schema.image.label"),
					// 		}),
					// 	},
					// ]}
					tooltip={`${t("common:imageUpload.maxSize",{data:5})}, ${t("common:imageUpload.supportedFormat")}, ${t("common:imageUpload.requiredDimensions",{data:"32x32"})}, ${t("common:imageUpload.requiredAspectRatio",{data:"1:1"})}`}
				>
					<ImageUpload
						displayType="picture-wall"
						maxCount={1}
						maxFileSize={5}
						customRequest={handleCustomUpload}
						value={data?.data?.image}
						loading={isSaving}
						centered={true}
						aspectRatio="1:1"
						imageWidth={32}
						imageHeight={32}
						folder="accessory"
						onDelete={handleImageRemove}
					/>
				</Form.Item>
				<Form.Item
					label={t("accessory:schema.name.label")}
					name="name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("accessory:schema.name.label"),
							}),
						},
						{
							max: 50,
							message: t("validation:maxLength", {
								field: t("accessory:schema.name.label"),
								max: 50,
							}),
						},
					]}
				>
					<Input
						allowClear
						showCount
						maxLength={50}
						placeholder={t("validation:placeholder", {
							field: t("accessory:schema.name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("name")}
									title={t("accessory:schema.name.label")}
								/>
							)
						}
					/>
				</Form.Item>
				<Form.Item
					label={t("accessory:schema.detail.label")}
					name="detail"
				>
					<Input.TextArea
						allowClear
						showCount
						maxLength={255}
						placeholder={t("validation:placeholder", {
							field: t("accessory:schema.detail.label"),
						})}
						rows={3}
					/>
				</Form.Item>

				{(isReadOnly || mode == "edit") && (
					<Form.Item
						label={t("accessory:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("accessory:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("accessory:schema.status.label"),
							})}
							options={useActiveList(null) as any}
							disabled={shouldDisableForm}
						/>
					</Form.Item>
				)}

				{(isReadOnly || mode == "edit") && (
					<Flex wrap gap={15} className="mb-4">
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

				<Flex justify="space-between" align="center" gap={5}>
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