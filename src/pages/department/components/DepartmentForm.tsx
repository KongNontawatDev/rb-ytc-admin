import { useState, useEffect } from "react";
import { Flex, Form, Input, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useDepartmentById } from "../hooks/useDepartmentQuery";
import { Department } from "../types";
import {
	useCreateDepartment,
	useUpdateDepartment,
} from "../hooks/useDepartmentMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import { delay } from "../../../utils/promise";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useDepartmentPage } from "../hooks/useDepartmentPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useActiveList } from "../../../hooks/useActiveList";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";
const { Text } = Typography;
interface DepartmentFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function DepartmentForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: DepartmentFormProps) {
	const { t } = useTranslation(["common", "validation", "department"]);
	const [form] = Form.useForm<Department>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useDepartmentPage({});
	const { data, isPending: isDataLoading } = useDepartmentById(id);
	const createDepartment = useCreateDepartment(onSuccess);
	const updateDepartment = useUpdateDepartment(onSuccess);

	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;

	// Reset form when mode or data changes
	useEffect(() => {
		// encryptStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvbnRleHQiOiJrb25nQGdtYWlsLmNvbSIsImFjdG9yIjoiYWRtaW4iLCJpYXQiOjE3MzYzMDMxMTcsImV4cCI6MTczNjMwMzExN30.RRKzShYrUa1kT6gbLl_rXl7YzZTqbIoLyI3bt9za8BA")
		if (mode === "create") {
			form.resetFields();
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue(data?.data);
		}
	}, [form, mode, data]);

	const handleFormChange = () => {
		const currentValues = form.getFieldsValue();
		const originalValues = data?.data || {};
		setIsDirty(
			JSON.stringify(currentValues) !== JSON.stringify(originalValues)
		);
	};

	useNavigationBlock(isDirty);
	useNavigationBlockEnhanced({isModify:isDirty});

	const handleSubmit = async (values: Department) => {
		try {
			setIsSaving(true);
			await delay(500); // Add a small delay for better UX
			if (mode === "edit" && id) {
				await updateDepartment.mutateAsync({ ...values,id });
			} else {
				await createDepartment.mutateAsync(values);
			}
		} catch (error: any) {
			if (error.status == 400) {
				// const formattedError = handleApiError(error.response?.data || error);
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save department:", error);
		} finally {
			setIsSaving(false);
		}
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("department:title")} />;
	}

	return (
		<Spin spinning={isDataLoading && mode !== "create"}>
			{errorSubmit && (
				<AlertSubmitFail
					message={t(mode=="create"?"common:createData.error":"common:editData.error" , {
						data: t("department:title"),
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
					label={t("department:schema.name.label")}
					name="name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("department:schema.name.label"),
							}),
						},
						{
							max: 50,
							message: t("validation:maxLength", {
								field: t("department:schema.name.label"),
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
							field: t("department:schema.name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("name")}
									title={t("department:schema.name.label")}
								/>
							)
						}
					/>
				</Form.Item>

				{(isReadOnly || mode == "edit") && (
					<Form.Item
						label={t("department:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("department:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("department:schema.status.label"),
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
