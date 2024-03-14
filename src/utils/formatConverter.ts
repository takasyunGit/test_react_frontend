// 全角英数字 → 半角英数字
export const stringToHalfWidth = (str: string): string => {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  return str
}