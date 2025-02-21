import React, { useEffect, useState } from 'react';
import { Card, Col, Flex, Row, Statistic, theme, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  BarChartOutlined,
  TeamOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import Breadcrumb from '../../components/common/Breadcrumb';
import TitleHeader from '../../components/common/TitleHeader';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import thLocale from '@fullcalendar/core/locales/th';
import enLocale from '@fullcalendar/core/locales/en-au';
import { useLocaleStore } from '../../hooks/localeStore';
import { useDashboard } from './hooks/useDashboardQuery';
import BookingListViewModal from '../booking_list/components/BookingListViewModal';

// Types
interface Room {
  id: number;
  name: string;
}

interface BookingList {
  id: number;
  title: string;
  book_start: string;
  book_end: string;
  room: Room;
}

interface MonthlyBooking {
  month_name: string;
  count: number;
}

interface DashboardData {
  booking_list_count: number;
  room_count: number;
  user_count: number;
  accessory_count: number;
  bookings_by_month: MonthlyBooking[];
  booking_list: BookingList[];
}


interface StatisticCardProps {
  title: string;
  value: number;
  Icon: React.ComponentType;
  suffix: string;
  loading: boolean;
}

interface BookingChartProps {
  data?: MonthlyBooking[];
  loading: boolean;
  chartTitle: string;
  legendLabel: string;
  token: {
    colorPrimary: string;
  };
}

interface DashboardItem {
  key: keyof Pick<DashboardData, 'booking_list_count' | 'room_count' | 'user_count' | 'accessory_count'>;
  title: string;
  Icon: React.ComponentType;
  suffix: string;
}

// Components
const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, Icon, suffix, loading }) => (
  <Card loading={loading}>
    <Statistic
      title={title}
      value={value}
      prefix={<Icon />}
      suffix={suffix}
    />
  </Card>
);

const BookingChart: React.FC<BookingChartProps> = ({ data, loading, chartTitle, legendLabel, token }) => {
  if (!data?.length) return null;

  return (
    <Card loading={loading}>
      <Typography.Title level={4} className="text-center">
        {chartTitle}
      </Typography.Title>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month_name" />
            <YAxis />
            <Tooltip />
            <Legend
              formatter={() => (
                <span className="text-gray-800 text-sm">
                  {legendLabel}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={token.colorPrimary}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'app']);
  const localeStore = useLocaleStore();
  const { data, isPending } = useDashboard();
  const { token } = theme.useToken();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const dashboardItems: DashboardItem[] = [
    {
      key: 'booking_list_count',
      title: t('dashboard:schema.booking_list_count.label'),
      Icon: ScheduleOutlined,
      suffix: t('dashboard:schema.booking_list_count.display', { data: '' }).replace('{{data}}', ''),
    },
    {
      key: 'room_count',
      title: t('dashboard:schema.room_count.label'),
      Icon: AppstoreOutlined,
      suffix: t('dashboard:schema.room_count.display', { data: '' }).replace('{{data}}', ''),
    },
    {
      key: 'user_count',
      title: t('dashboard:schema.user_count.label'),
      Icon: TeamOutlined,
      suffix: t('dashboard:schema.user_count.display', { data: '' }).replace('{{data}}', ''),
    },
    {
      key: 'accessory_count',
      title: t('dashboard:schema.accessory_count.label'),
      Icon: InboxOutlined,
      suffix: t('dashboard:schema.accessory_count.display', { data: '' }).replace('{{data}}', ''),
    },
  ];

  const handleEventClick = (clickInfo: { event: { extendedProps: { bookId: number } } }): void => {
    setSelectedId(clickInfo.event.extendedProps.bookId);
    setOpenModal(true);
  };

  useEffect(() => {
    document.title = t('dashboard:header') + t('app:appTitle');
  }, [t]);

  return (
    <>
      <BookingListViewModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedId(null);
        }}
        id={selectedId}
      />
      
      <Flex vertical align="start" className="mt-3 lg:mt-5 mb-1">
        <Breadcrumb listItems={[{ title: t('dashboard:title') }]} />
        <TitleHeader title={t('dashboard:title')} icon={BarChartOutlined} back={false} />
      </Flex>

      <Row gutter={[15, 15]} className="mt-5">
        {dashboardItems.map(({ key, title, Icon, suffix }) => (
          <Col key={key} span={24} md={12} lg={6}>
            <StatisticCard
              title={title}
              value={data?.data?.[key] ?? 0}
              Icon={Icon}
              suffix={suffix}
              loading={isPending}
            />
          </Col>
        ))}
      </Row>

      <Row gutter={[15, 15]} className="mt-5">
        <Col span={24}>
          <BookingChart
            data={data?.data?.bookings_by_month}
            loading={isPending}
            chartTitle="จำนวนรายการจองแต่ละเดือน"
            legendLabel={t('dashboard:chart1')}
            token={token}
          />
        </Col>
      </Row>

      <Row gutter={[15, 15]} className="mt-5">
        <Col span={24}>
          <Card loading={isPending}>
            <FullCalendar
              locale={localeStore.locale === 'th' ? thLocale : enLocale}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={data?.data?.booking_list?.map((event:any) => ({
                title: `${event.title} (${event.room.name})`,
                start: event.book_start,
                end: event.book_end,
                roomName: event.room.name,
                bookId: event.id,
              }))}
              eventClick={()=>handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;