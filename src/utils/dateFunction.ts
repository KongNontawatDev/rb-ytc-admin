import {default as dayjs} from "dayjs"
import {default as customParseFormat} from "dayjs/plugin/customParseFormat"
import {default as buddhistEra} from "dayjs/plugin/buddhistEra"
import utc from "dayjs/plugin/utc" // Import the UTC plugin
import timezone from "dayjs/plugin/timezone" // Import the timezone plugin
import "dayjs/locale/th"
dayjs.extend(buddhistEra)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
const localTimezone = "Asia/Bangkok"

/**
 * แปลงเวลาแบบ UTC ให้เป็นแบบไทย
 * @param time  2023-09-01T15:30:00.000Z
 * @returns 15:30:00
 */
export const toTime = (time: any): string => {
  if (time == "" || time == null) {
    return "-"
  }
  const localTime = dayjs(time).tz(localTimezone)
  return localTime.format("HH:mm")
}

/**
 * แปลงวันแบบ UTC ให้เป็นแบบไทย
 * @param date  2023-09-01T15:30:00.000Z
 * @returns 20/01/2567
 */
export const toDate = (date: any): string => {
  const localTime = dayjs.utc(date).tz(localTimezone)
  return localTime.format("DD/MM/BBBB")
}

/**
 * แปลงวันเวลาแบบ UTC ให้เป็นแบบไทย
 * @param datetime  2023-09-01T15:30:00.000Z
 * @returns 20/01/2567 15:30:00
 */
export const toDateTime = (datetime: any): string => {
  const localTime = dayjs.utc(datetime).tz(localTimezone)
  return localTime.format("DD/MM/BBBB HH:mm")
}

/**
 * วันเวลาปัจจุบัน แบบ UTC
 * @returns 2023-09-01T15:30:00.000Z
 */
export const sqlCurrentTimestamp = (): any => {
  return dayjs.utc().format()
}

/**
 * แปลงวันที่แบบ js ไปเป็นแบบ UTC และ รีเช็ทเวลา
 * @param date  Wed Jan 17 2024 14:21:43 GMT+0700 (Indochina Time)
 * @returns 2023-09-01T00:00:00.000Z
 */
export const sqlDate = (date: string): string => {
  return dayjs.utc(date).startOf("day").format()
}

/**
 * แปลงเวลาแบบ js ไปเป็นแบบ UTC
 * @param time Wed Jan 17 2024 14:21:43 GMT+0700 (Indochina Time)
 * @returns 2023-09-01T15:30:00.000Z
 */
export const sqlTime = (time: string): string => {
  return dayjs.utc(time).format()
}

/**
 * แปลงวันเวลาแบบ js ไปเป็นแบบ UTC
 * @param datetime Wed Jan 17 2024 14:21:43 GMT+0700 (Indochina Time)
 * @returns 2023-09-01T15:30:00.000Z
 */
export const sqlDateTime = (datetime: string): string => {
  return dayjs.utc(datetime).format()
}

/**
 * ดึงเอาวันที่ปัจจุบัน
 * @returns 2023-09-01T15:30:00.000Z
 */
export function getCurrentTimestamp(digit: number = 10): number {
  return +new Date().getTime().toString().substring(0, digit)
}

/**
 * ดึงเอาลิสปีออกมา ตั้งแต่ปีปัจจุบัน ย้อนกลับไป 30 ปี โดยเรียงจากปีปัจจุบันขึ้นก่อน
 * @returns 2023-09-01T15:30:00.000Z
 */
type YearList = {
  id: number
  name: string
}
export const getYearList = (numYears: number = 30): YearList[] => {
  const currentYear = dayjs().year()
  const lispi: YearList[] = []

  for (let i = 0; i < numYears; i++) {
    lispi.push({
      id: currentYear + 1 - i,
      name: String(currentYear + 1 - i),
    })
  }

  return lispi
}

export const calculateฺBetweenDays = (endDate: string): number|undefined => {
  const today = dayjs().startOf("day");
  const targetDate = dayjs(endDate).startOf("day");

  // Validate input date
  if (!targetDate.isValid()) {
    return undefined
  }

  // Calculate the difference in days
  const diffDays = targetDate.diff(today, 'days');

  return diffDays;
}

export const calculateDateFromDays = (value: number): string => {
  let days = Number(value)
  const today = dayjs().startOf('day');
  const targetDate = today.add(days, 'days');

  // Validate the target date
  if (!targetDate.isValid()) {
    throw new Error('Invalid date calculation');
  }

  return targetDate.format('YYYY-MM-DD');
};

export function calculateAge(dateString: any): number | null {
  const birthDate = dayjs(dateString);
  const currentDate = dayjs();

  if (!birthDate.isValid()) {
    // Invalid date string, return null or handle the error as needed
    return null;
  }

  const age = currentDate.diff(birthDate, 'year');
  return age;
}

export const calculateDaysOfWeek =  (days: string[]): string => {
  // Sort the days in chronological order
  days.sort((a, b) => getDayIndex(a) - getDayIndex(b));

  // Helper function to get the index of a day (0 for Mon, 1 for Tue, etc.)
  function getDayIndex(day: string): number {
    const daysOfWeek = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
    return daysOfWeek.indexOf(day);
  }

  // Check for consecutive days
  let startIndex = 0;
  let endIndex = 0;
  let consecutiveDays = [];
  let nonConsecutiveDays = [];

  while (startIndex < days.length) {
    endIndex = startIndex + 1;
    while (endIndex < days.length && getDayIndex(days[endIndex]) === getDayIndex(days[endIndex - 1]) + 1) {
      endIndex++;
    }

    if (endIndex - startIndex > 1) {
      consecutiveDays.push(`${days[startIndex]} - ${days[endIndex - 1]}`);
    } else {
      nonConsecutiveDays.push(...days.slice(startIndex, endIndex));
    }

    startIndex = endIndex;
  }

  return [...consecutiveDays, ...nonConsecutiveDays].join(', ');
}

export const restoreDaysOfWeek = (result: string): string[] => {
  const daysOfWeek = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
  const consecutiveDays = result.split(/, |, /g)
    .filter(str => str.includes('-'))
    .flatMap(str => {
      const [start, end] = str.split(' - ');
      const startIndex = daysOfWeek.indexOf(start);
      const endIndex = daysOfWeek.indexOf(end);
      const days: string[] = [];
      for (let i = startIndex; i <= endIndex; i++) {
        days.push(daysOfWeek[i]);
      }
      return days;
    });

  const nonConsecutiveDays = result.split(/, |, /g)
    .filter(str => !str.includes('-'));

  return [...consecutiveDays, ...nonConsecutiveDays];
}



export function calculateDaysApart(startDate: any, endDate: any): number|null {
  if(startDate==null&&endDate==null) {
    return null
  }
  const startDateTime = dayjs(startDate);
  const endDateTime = dayjs(endDate);

  // Calculate the difference in days
  const daysApart = endDateTime.diff(startDateTime, 'day')+1;

  return Math.abs(daysApart); // Use Math.abs to ensure a positive number
}