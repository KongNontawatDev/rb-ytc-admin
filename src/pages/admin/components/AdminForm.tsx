import { useState, useEffect } from "react";
import { Button, Flex, Form, Input, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import {useAdminById } from "../hooks/useAdminQuery";
import { Admin } from "../types";
import { useCreateAdmin, useUpdateAdmin } from "../hooks/useAdminMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useAdminPage } from "../hooks/useAdminPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useActiveList } from "../../../hooks/useActiveList";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";
import ImageUpload from "../../../components/common/ImageUpload";
import RoleDropdown from "../../role/components/RoleDropdown";
import useAuthStore from "../../auth/hooks/useAuthStore";
import { KeyOutlined } from "@ant-design/icons";
import AdminModalChangePassword from "./AdminModalChangePassword";
import { getImage } from "../../../hooks/getImage";
const { Text } = Typography;

interface AdminFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

type FieldType = Partial<Admin>;

export default function AdminForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: AdminFormProps) {
	const { t } = useTranslation(["common", "validation", "admin", "role","auth"]);
	const [form] = Form.useForm<Admin>();
	const {admin} = useAuthStore()
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useAdminPage({});
	const { data, isPending: isDataLoading } = useAdminById(id);
	const createAdmin = useCreateAdmin(onSuccess);
	const updateAdmin = useUpdateAdmin(onSuccess);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isImageRemoved, setIsImageRemoved] = useState(false);
	const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;

	// Reset form when mode or data changes
	useEffect(() => {
		if (mode === "create") {
			form.resetFields();
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue(data?.data);
			form.setFieldValue("image",getImage(data?.data?.image,"admin"))
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

	const handleSubmit = async (values: Admin) => {
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
				await updateAdmin.mutateAsync({
					id,
					...(Object.fromEntries(formData.entries()) as any),
				});
			} else {
				await createAdmin.mutateAsync(
					Object.fromEntries(formData.entries()) as any
				);
			}
		} catch (error: any) {
			if (error.status === 400) {
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save admin:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("admin:title")} />;
	}

	const passwordRules = [
		{
			required: mode === "create",
			message: t("validation:required", {
				field: t("admin:schema.password.label"),
			}),
		},
		{
			min: 8,
			message: t("validation:minLength", {
				field: t("admin:schema.password.label"),
				min: 8,
			}),
		},
		{
			max: 20,
			message: t("validation:maxLength", {
				field: t("admin:schema.password.label"),
				max: 20,
			}),
		},
		{
			pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_$%^&.*])(?=.{8,})/,
			message: t("validation:password.pattern"),
		},
	];

	return (
		<Spin spinning={isDataLoading && mode !== "create"}>
			<AdminModalChangePassword
				id={id}
				onClose={()=>setIsOpenChangePassword(false)}
				open={isOpenChangePassword}
			/>
			{errorSubmit && (
				<AlertSubmitFail
					message={t(
						mode == "create"
							? "common:createData.error"
							: "common:editData.error",
						{
							data: t("admin:title"),
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
				initialValues={{role_id:1}}
			>
				<Form.Item<FieldType>
					label={t("admin:schema.image.label")}
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
						folder="admin"
						onDelete={handleImageRemove}
					/>
				</Form.Item>
				<Form.Item<FieldType>
					label={t("admin:schema.name.label")}
					name="name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("admin:schema.name.label"),
							}),
						},
						{
							max: 150,
							message: t("validation:maxLength", {
								field: t("admin:schema.name.label"),
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
							field: t("admin:schema.name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("name")}
									title={t("admin:schema.name.label")}
								/>
							)
						}
					/>
				</Form.Item>
				<Form.Item<FieldType>
					label={t("role:title")}
					name="role_id"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("role:title"),
							}),
						},
					]}
				>
					<RoleDropdown
						value={form.getFieldValue("role_id")}
						onChange={(value) => {
							form.setFieldValue("role_id", value); // อัปเดตค่าในฟอร์ม
							handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
						}}
						disabled={isReadOnly}
					/>
				</Form.Item>
					<Form.Item<FieldType>
						label={t("admin:schema.email.label")}
						name="email"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("admin:schema.email.label"),
								}),
							},
							{
								max: 60,
								message: t("validation:maxLength", {
									field: t("admin:schema.email.label"),
									max: 60,
								}),
							},
						]}
					>
						<Input
							allowClear
							showCount
							type="email"
							maxLength={60}
							placeholder={t("validation:placeholder", {
								field: t("admin:schema.email.label"),
							})}
						/>
					</Form.Item>

				{mode === "create" && (
					<Form.Item<FieldType>
						label={t("admin:schema.password.label")}
						name="password"
						rules={passwordRules}
						tooltip={t("validation:password.requirements")}
					>
						<Input.Password
							allowClear
							placeholder={t("validation:placeholder", {
								field: t("admin:schema.password.label"),
							})}
						/>
					</Form.Item>
				)}

				{(isReadOnly || mode == "edit") && (
					<Form.Item<FieldType>
						label={t("admin:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("admin:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("admin:schema.status.label"),
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

				{mode=="edit"&&<Button block className="mt-4" icon={<KeyOutlined/>} onClick={()=>setIsOpenChangePassword(true)}>{t("auth:changePassword")}</Button>}

				<Flex justify="space-between" align="center" gap={5} className="mt-4">
					{mode == "edit" ? (
						<ButtonDelete
							disabled={admin.id==data?.data?.id||admin.role_id!=2}
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
