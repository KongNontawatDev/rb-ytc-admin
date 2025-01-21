import { useState, useEffect } from "react";
import { Flex, Form, Input, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useUserById } from "../hooks/useUserQuery";
import { User } from "../types";
import { useCreateUser, useUpdateUser } from "../hooks/useUserMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useUserPage } from "../hooks/useUserPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useActiveList } from "../../../hooks/useActiveList";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";
import ImageUpload from "../../../components/common/ImageUpload";
import DepartmentDropdown from "../../department/components/DepartmentDropdown";
const { Text } = Typography;

interface UserFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

type FieldType = Partial<User>;

export default function UserForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: UserFormProps) {
	const { t } = useTranslation(["common", "validation", "user", "department"]);
	const [form] = Form.useForm<User>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useUserPage({});
	const { data, isPending: isDataLoading } = useUserById(id);
	const createUser = useCreateUser(onSuccess);
	const updateUser = useUpdateUser(onSuccess);
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
		}
	}, [form, mode, data]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		const hasChanges =
			JSON.stringify(currentValues) !== JSON.stringify(originalValues);
		setIsDirty(hasChanges || isImageRemoved || !!imageFile);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({ isModify: isDirty });

	const handleCustomUpload = async ({
		file,
		onSuccess: onUploadSuccess,
	}: any) => {
		setImageFile(file);
		setIsImageRemoved(false);
		setIsDirty(true);
		onUploadSuccess?.();
	};

	const handleImageRemove = () => {
		setImageFile(null);
		setIsImageRemoved(true);
		setIsDirty(true);
		form.setFieldValue("image", "");
	};

	const handleSubmit = async (values: User) => {
		try {
			setIsSaving(true);

			const formData = new FormData();
			const convertToString = (
				value: string | number | Date | undefined
			): string => {
				if (value === undefined || value === null) return "";
				if (value instanceof Date) return value.toISOString();
				return String(value);
			};

			Object.entries(values).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, convertToString(value as any));
				}
			});

			// Handle image upload
			if (imageFile) {
				formData.append("image", imageFile);
			} else if (mode === "edit" && data?.data?.image && !isImageRemoved) {
				// If editing and no new image is selected, send the existing image URL
				formData.append("image", convertToString(data.data.image));
			} else if (isImageRemoved) {
				// If image was removed, send empty string
				formData.append("image", "");
			}

			if (mode === "edit" && id) {
				await updateUser.mutateAsync({
					id,
					...(Object.fromEntries(formData.entries()) as any),
				});
			} else {
				await createUser.mutateAsync(
					Object.fromEntries(formData.entries()) as any
				);
			}
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save user:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("user:title")} />;
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
							data: t("user:title"),
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
					label={t("user:schema.image.label")}
					name="image"
					className="flex justify-center"
					tooltip={`${t("common:imageUpload.maxSize", { data: 5 })}, ${t(
						"common:imageUpload.supportedFormat"
					)}, ${t("common:imageUpload.requiredDimensions", {
						data: "32x32",
					})}, ${t("common:imageUpload.requiredAspectRatio", { data: "1:1" })}`}
				>
					<ImageUpload
						displayType="picture-wall"
						maxCount={1}
						maxFileSize={5}
						customRequest={handleCustomUpload}
						value={data?.data?.image}
						loading={isSaving}
						centered={true}
						folder="user"
						onDelete={handleImageRemove}
					/>
				</Form.Item>
				<Form.Item<FieldType>
					label={t("user:schema.full_name.label")}
					name="full_name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("user:schema.full_name.label"),
							}),
						},
						{
							max: 150,
							message: t("validation:maxLength", {
								field: t("user:schema.full_name.label"),
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
							field: t("user:schema.full_name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("full_name")}
									title={t("user:schema.full_name.label")}
								/>
							)
						}
					/>
				</Form.Item>
				<Form.Item<FieldType>
					label={t("department:title")}
					name="department_id"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("department:title"),
							}),
						},
					]}
				>
					<DepartmentDropdown
						value={form.getFieldValue("department_id")}
						onChange={(value) => {
							form.setFieldValue("department_id", value); // อัปเดตค่าในฟอร์ม
							handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
						}}
						disabled={isReadOnly}
					/>
				</Form.Item>
				<Form.Item<FieldType> label={t("user:schema.tel.label")} name="tel" rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("user:schema.tel.label"),
							}),
						},
						{
							max: 10,
							message: t("validation:maxLength", {
								field: t("user:schema.tel.label"),
								max: 10,
							}),
						},
					]}>
					<Input
						allowClear
						showCount
						maxLength={10}
						placeholder={t("validation:placeholder", {
							field: t("user:schema.tel.label"),
						})}
					/>
				</Form.Item>

				{(isReadOnly || mode == "edit") && (
					<Form.Item<FieldType>
						label={t("user:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("user:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("user:schema.status.label"),
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
