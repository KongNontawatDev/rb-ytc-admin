import { useState, useEffect } from "react";
import {
	Col,
	DatePicker,
	Flex,
	Form,
	Input,
	Row,
	Spin,
	Typography,
} from "antd";
import { useTranslation } from "react-i18next";
import { useBookingListById } from "../hooks/useBookingListQuery";
import { BookingList } from "../types";
import {
	useCreateBookingList,
	useUpdateBookingList,
} from "../hooks/useBookingListMutate";
import { FormMode } from "../../../types/formType";
import ButtonCancel from "../../../components/common/ButtonCancel";
import ButtonClearForm from "../../../components/common/ButtonClearForm";
import ButtonSave from "../../../components/common/ButtonSave";
import { delay } from "../../../utils/promise";
import AlertSubmitFail from "../../../components/common/AlertSubmitFail";
import { toDateTime } from "../../../utils/dateFunction";
import ButtonCopy from "../../../components/common/ButtonCopy";
import ButtonDelete from "../../../components/common/ButtonDelete";
import { useBookingListPage } from "../hooks/useBookingListPage";
import EmptyData from "../../../components/common/EmptyData";
import Select from "../../../components/common/Select";
import { useNavigationBlock } from "../../../hooks/useNavigationBlock";
import { useNavigationBlockEnhanced } from "../../../utils/formUtils";

import dayjs from "dayjs";
import { datePickerTh } from "../../../components/common/InputDate";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import UserDropdown from "../../user/components/UserDropdown";
import DepartmentDropdown from "../../department/components/DepartmentDropdown";
import RoomDropdown from "../../room/components/RoomDropdown";
import { useUserForDropdown } from "../../user/hooks/useUserQuery";
import { useBookingStatusList } from "../../../hooks/useBookingStatusList";

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { Text } = Typography;

interface BookingListFormProps {
	id?: number | null;
	mode: FormMode;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function BookingListForm({
	id,
	mode,
	onCancel,
	onSuccess,
}: BookingListFormProps) {
	const { t } = useTranslation([
		"common",
		"validation",
		"booking_list",
		"user",
		"room",
	]);
	const [form] = Form.useForm<BookingList>();
	const [isDirty, setIsDirty] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState<string>();
	const { handleDelete } = useBookingListPage({});
	const { data, isPending: isDataLoading } = useBookingListById(id);
	const createBookingList = useCreateBookingList(onSuccess);
	const updateBookingList = useUpdateBookingList(onSuccess);
  const { data:userData } = useUserForDropdown();
	const isReadOnly = mode === "view";
	const shouldDisableForm = (mode === "edit" && isSaving) || isReadOnly;

	// Reset form when mode or data changes
	useEffect(() => {
		// encryptStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImNvbnRleHQiOiJrb25nQGdtYWlsLmNvbSIsImFjdG9yIjoiYWRtaW4iLCJpYXQiOjE3MzYzMDMxMTcsImV4cCI6MTczNjMwMzExN30.RRKzShYrUa1kT6gbLl_rXl7YzZTqbIoLyI3bt9za8BA")
		if (mode === "create") {
			form.resetFields();
		} else if (data?.data && (mode === "edit" || mode === "view")) {
			form.setFieldsValue({
				...data?.data,
				book_end: dayjs(data?.data.book_end),
				book_start: dayjs(data?.data.book_start),
			});
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
	useNavigationBlockEnhanced({ isModify: isDirty });

	const handleSubmit = async (values: Omit<BookingList, "id">) => {
		try {
			setIsSaving(true);
			await delay(500); // Add a small delay for better UX
			if (mode === "edit" && id) {
				await updateBookingList.mutateAsync({ id, ...values });
			} else {
				await createBookingList.mutateAsync(values);
			}
		} catch (error: any) {
			if (error.status == 400) {
				// const formattedError = handleApiError(error.response?.data || error);
				setErrorSubmit(error.response?.data?.message);
			}
			console.error("Failed to save booking_list:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const disabledDate = (current: dayjs.Dayjs) => {
		// Disable dates before today
		return current && current.isBefore(dayjs().startOf("day"));
	};

	if (!data?.data && !isDataLoading && mode !== "create") {
		return <EmptyData value={t("booking_list:title")} />;
	}

	const handleUserChange = (value:string | number | (string | number)[] | undefined)=> {
		const user = userData?.data.find((data:any)=>data.id==value)
		form.setFieldValue("department_id",user.department_id)
		form.setFieldValue("user_name",user.full_name)
		form.setFieldValue("tel",user.tel)
		
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
							data: t("booking_list:title"),
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
				initialValues={{ book_start: dayjs(), book_end: dayjs() }}
			>
				<Form.Item
					label={t("room:title")}
					name="room_id"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("room:title"),
							}),
						},
					]}
				>
					<RoomDropdown
						value={form.getFieldValue("room_id")}
						onChange={(value) => {
							form.setFieldValue("room_id", value); // อัปเดตค่าในฟอร์ม
							handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
						}}
						disabled={isReadOnly}
					/>
				</Form.Item>
				<Form.Item
					label={t("booking_list:schema.title.label")}
					name="title"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("booking_list:schema.title.label"),
							}),
						},
						{
							max: 255,
							message: t("validation:maxLength", {
								field: t("booking_list:schema.title.label"),
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
							field: t("booking_list:schema.title.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("title")}
									title={t("booking_list:schema.title.label")}
								/>
							)
						}
					/>
				</Form.Item>
				<Form.Item
					label={t("booking_list:schema.detail.label")}
					name="detail"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("booking_list:schema.detail.label"),
							}),
						},
					]}
				>
					<Input.TextArea
						rows={2}
						allowClear
						placeholder={t("validation:placeholder", {
							field: t("booking_list:schema.detail.label"),
						})}
					/>
				</Form.Item>
				<Form.Item
					label={t("user:title")}
					name="user_id"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("user:title"),
							}),
						},
					]}
				>
					<UserDropdown
						value={form.getFieldValue("user_id")}
						onChange={(value) => {
							form.setFieldValue("user_id", value); // อัปเดตค่าในฟอร์ม
							handleFormChange(); // ตรวจสอบว่าฟอร์มมีการแก้ไข
							handleUserChange(value)
						}}
						disabled={isReadOnly}
					/>
				</Form.Item>
				<Form.Item
					label={t("booking_list:schema.department.label")}
					name="department_id"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("booking_list:schema.department.label"),
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
				<Form.Item
					label={t("booking_list:schema.user_name.label")}
					name="user_name"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("booking_list:schema.user_name.label"),
							}),
						},
						{
							max: 150,
							message: t("validation:maxLength", {
								field: t("booking_list:schema.user_name.label"),
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
							field: t("booking_list:schema.user_name.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("user_name")}
									title={t("booking_list:schema.user_name.label")}
								/>
							)
						}
					/>
				</Form.Item>
				<Form.Item
					label={t("booking_list:schema.tel.label")}
					name="tel"
					rules={[
						{
							required: true,
							message: t("validation:required", {
								field: t("booking_list:schema.tel.label"),
							}),
						},
						{
							max: 10,
							message: t("validation:maxLength", {
								field: t("booking_list:schema.tel.label"),
								max: 10,
							}),
						},
					]}
				>
					<Input
						allowClear
						showCount
						maxLength={10}
						placeholder={t("validation:placeholder", {
							field: t("booking_list:schema.tel.label"),
						})}
						suffix={
							(isReadOnly || mode == "edit") && (
								<ButtonCopy
									textToCopy={form.getFieldValue("tel")}
									title={t("booking_list:schema.tel.label")}
								/>
							)
						}
					/>
				</Form.Item>

				<Row gutter={16}>
					<Col xs={24} sm={12}>
						<Form.Item
							label={t("booking_list:schema.book_start.label")}
							name="book_start"
							rules={[
								{
									required: true,
									message: t("validation:required", {
										field: t("booking_list:schema.book_start.label"),
									}),
								},
							]}
						>
							<DatePicker
								format="DD-MM-BBBB HH:mm"
								disabledDate={disabledDate}
								showTime={{ defaultValue: dayjs("00:00", "HH:mm") }}
								locale={datePickerTh}
								className="w-full" // Make DatePicker full width
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label={t("booking_list:schema.book_end.label")}
							name="book_end"
							rules={[
								{
									required: true,
									message: t("validation:required", {
										field: t("booking_list:schema.book_end.label"),
									}),
								},
							]}
						>
							<DatePicker
								format="DD-MM-BBBB HH:mm"
								disabledDate={disabledDate}
								showTime={{ defaultValue: dayjs("00:00", "HH:mm") }}
								locale={datePickerTh}
								className="w-full" // Make DatePicker full width
							/>
						</Form.Item>
					</Col>
				</Row>

				{(isReadOnly || mode == "edit") && (
					<Form.Item
						label={t("booking_list:schema.status.label")}
						name="status"
						rules={[
							{
								required: true,
								message: t("validation:required", {
									field: t("booking_list:schema.status.label"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("validation:placeholder", {
								field: t("booking_list:schema.status.label"),
							})}
							options={useBookingStatusList(null) as any}
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
