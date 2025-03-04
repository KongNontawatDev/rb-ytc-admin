import {
	TableOutlined,
	UnorderedListOutlined,
} from "@ant-design/icons";
import {  Segmented, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
	view: "table" | "card";
	setToggleView: () => void;
};

export default function ButtonToggleView({ setToggleView }: Props) {
	const { t } = useTranslation("common");
	return (
		<Segmented
			options={[
				{
					value: "table",
					label: (
						<>
							<Tooltip
								title={ t("toggleDisplayToTable") }
							>
								<UnorderedListOutlined />
							</Tooltip>
						</>
					),
				},
				{
					value: "card",
					label: (
						<>
							<Tooltip
								title={t("toggleDisplayToCard")}
							>
								<TableOutlined />
							</Tooltip>
						</>
					),
				},
			]}
			onChange={() => setToggleView()}
      className="border"
		/>
	);
}
