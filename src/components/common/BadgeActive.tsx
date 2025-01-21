import { Badge, Tooltip, Spin } from "antd";
import { useActiveList } from "../../hooks/useActiveList";

type Props = {
  value: number | string;
  label?: boolean;
  loading?: boolean;
};

export default function BadgeActive({ value, label = true, loading = false }: Props) {
  const [activeStatus] = useActiveList(Number(value));

  if (!activeStatus) return null;

  // Map the success/error color to antd Badge status
  const badgeStatus = activeStatus.color === 'success' ? 'success' : 'error';

  const badge = (
    <Badge 
      status={badgeStatus} 
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