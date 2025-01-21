import { Badge, Tooltip, Spin } from "antd";
import { useBookingStatusList } from "../../../hooks/useBookingStatusList";

type Props = {
  value: number | string;
  label?: boolean;
  loading?: boolean;
};

export default function BadgeStatus({ value, label = true, loading = false }: Props) {
  const [activeStatus] = useBookingStatusList(Number(value));

  if (!activeStatus) return null;


  const badge = (
    <Badge 
      status={activeStatus.color} 
      text={label && activeStatus.label} 
      className="cursor-pointer"
    />
  );

  if (loading) {
    return (
      <Spin size="small">
        {badge}
      </Spin>
    );
  }

  return (
    <Tooltip title={!label && activeStatus.label}>
      {badge}
    </Tooltip>
  );
}