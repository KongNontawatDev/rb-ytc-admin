import dayjs from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';

import buddistEra from 'dayjs/plugin/buddhistEra';

import th from 'dayjs/locale/th';

dayjs.locale(
  {
    ...th,
    formats: {
      LT: 'H:mm',
      LTS: 'H:mm:ss',
      L: 'DD/MM/BBBB',
      LL: 'D MMMM BBBB',
      LLL: 'D MMMM BBBB เวลา H:mm',
      LLLL: 'วันddddที่ D MMMM BBBB เวลา H:mm',
    },
  },
  undefined,
  true
);

dayjs.extend(buddistEra);


const config = {
  ...dayjsGenerateConfig,
  getFixedDate: (string: string) => dayjs(string, ['BBBB-M-DD', 'BBBB-MM-DD']),
  setYear: (date: dayjs.Dayjs, year: number) => {
    return date.year(year - 543);
  },
  getYear: (date: dayjs.Dayjs) => Number(date.format('BBBB')),
};

const DatePicker = generatePicker(config);

export default DatePicker;
