// 全角英数字 → 半角英数字
export const stringToHalfWidth = (str: string): string => {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str
}

// 日本時間に変換
export const dateToYYYYMMDD = (d: Date | undefined): string => {
  if (!d) { return ""}
  const converted = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split(/T|\./)
  const date = converted[0]
  const hour = converted[1]
  return date +  ' ' + hour
}

// 数字にカンマを入れる
export const addComma = (num: number | undefined) => {
  if (!num) { return ""}
  return new Intl.NumberFormat("ja-JP").format(num)
}

// 指定の文字数を超えたら省略する
export const omitText = (limit: number, text: string) => {
  let returnText = text

  if (text.length > limit) {
    returnText = text.substring(0, limit) + "..."
  }
  return returnText
}

