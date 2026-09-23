import { JST_TIME_ZONE } from "./jst";

export interface JstParts {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
}

/** Date を日本時間の各要素に分解する（URL生成・表示の基礎） */
export function getJstParts(date: Date): JstParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: JST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour,
    minute: map.minute,
    second: map.second,
  };
}

/** 日付を「YYYY.MM.DD」形式に整形する（日本時間基準） */
export function formatDate(date: Date): string {
  const { year, month, day } = getJstParts(date);
  return `${year}.${month}.${day}`;
}

/** datetime 属性用の「YYYY-MM-DD」（日本時間基準） */
export function isoDate(date: Date): string {
  const { year, month, day } = getJstParts(date);
  return `${year}-${month}-${day}`;
}

/** サイドバー等で使う「YYYY/MM」ラベル */
export function formatMonthLabel(year: string | number, month: string | number): string {
  return `${year}/${String(month).padStart(2, "0")}`;
}
