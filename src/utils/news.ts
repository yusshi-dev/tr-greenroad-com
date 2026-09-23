/** お知らせの種別（CMS の「種別」の選択肢）に対応する色分け用クラス */
const NEWS_LABEL_MODIFIER: Record<string, string> = {
  お知らせ: "notice",
  営業: "open",
  キャンペーン: "campaign",
  休業: "closed",
};

/** 種別名から CSS の修飾子（notice / open / campaign / closed）を返す */
export function newsLabelModifier(label: string): string {
  return NEWS_LABEL_MODIFIER[label] ?? "notice";
}
