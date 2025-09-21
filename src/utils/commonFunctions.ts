
import { enUS, zhTW, ja, fr, de, type Locale } from 'date-fns/locale'

export function parseMentionsToStringArr(str: string): string[] {
  // Mentions 格式：@[顯示文字](id)
  const mentionPattern = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const ids: string[] = [];
  let match: RegExpExecArray | null;

  // 使用 while 迴圈，反覆執行 mentionPattern.exec(str) 來找出所有匹配
  while ((match = mentionPattern.exec(str)) !== null) {
    if (!match[2]) continue;
    // match[1] 為顯示文字 (例："群組1")
    // match[2] 為 id (例："group1")
    ids.push(match[2]);
  }

  return ids;
}

export function parseMembersToMentions(members: { key: string, value: string, type?: number }[]): string {
  return members.map(item => `@[${item.value}](${item.key})`).join(' ');
}

export const numberToChineseMap: { [key: number]: string } = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日",
};

const localeMap: Record<string, Locale> = {
  'en-US': enUS,
  'zh-TW': zhTW,
  'ja-JP': ja,
  'fr-FR': fr,
  'de-DE': de,
}

export function getLocaleObject(code: string): Locale | undefined {
  return localeMap[code]
}

export function getLocaleFormat(locale: string): string {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date())
  const order = parts
    .filter(p => ['day', 'month', 'year'].includes(p.type))
    .map(p => p.type)
    .join('/')

  return order
    .replace('day', 'dd')
    .replace('month', 'MM')
    .replace('year', 'yyyy')
}