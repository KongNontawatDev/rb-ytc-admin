import { Form, Input } from "antd";
import React, { HTMLProps } from "react";

type Props = {
	value: string;
	placeholder?: string;
	allowClear?: boolean;
	onSearch?: () => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onPressEnter?: () => void;
	label?: string;
	className?: HTMLProps<HTMLElement>["className"];
	loading?: boolean;
};

const { Search } = Input;

export default function InputTextFilter({
	value,
	placeholder = "ค้นหา",
	allowClear = true,
	onSearch,
	onChange,
	onPressEnter,
	label,
	className,
	loading = false,
}: Props) {
	return (
		<>
			{label ? (
				<>
					<Form layout="vertical">
						<Form.Item label={label} className={className}>
							<Search
								value={value}
								placeholder={placeholder}
								allowClear={allowClear}
								onSearch={onSearch}
								onChange={onChange}
								onPressEnter={onPressEnter}
								loading={loading}
							/>
						</Form.Item>
					</Form>
				</>
			) : (
				<>
					<Search
						value={value}
						placeholder={placeholder}
						allowClear={allowClear}
						onSearch={onSearch}
						onChange={onChange}
						onPressEnter={onPressEnter}
						loading={loading}
						className="w-full lg:min-w-[250px] lg:max-w-[400px]"
					/>
				</>
			)}
		</>
	);
}
