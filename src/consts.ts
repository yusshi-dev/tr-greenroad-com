export const SITE = {
  title: "トータルリペア グリーンロード",
  description: "滋賀県甲賀市でホイールキズ、シート、内装のキズ修理、コーティング等を行っています。近隣地域は出張見積もり無料です。確かな技術の「トータルリペアグリーンロード」にお任せください。",
  url: "https://tr-greenroad.com",
  phone: "080-6215-7952",
  hours: "9:00〜18:00",
  /** OGP の既定画像（記事本文に画像が無いときなどに使う） */
  ogImage: "/img/hero-wheel.webp",
} as const;

/** グローバルメニュー。key は各ページの current と対応する */
export const NAV_ITEMS = [
  { key: "home", href: "/", label: "ホーム" },
  { key: "wheel-repair", href: "/service/wheel-repair/", label: "ホイールリペア" },
  { key: "interior-repair", href: "/service/interior-repair/", label: "インテリアリペア" },
  { key: "cleaning", href: "/service/cleaning/", label: "ルームクリーニング" },
  { key: "news", href: "/news/", label: "お知らせ" },
  { key: "blog", href: "/blog/", label: "ブログ（施工事例）" },
] as const;

/** RSS フィードに含める記事数 */
export const FEED_MAX_ITEMS = 10;

export const CONTACT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdwvHDCGmIGPR8O-mBhYs9CBMzVax018DHTC-i98Jtm_4jnvw/viewform";

export const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13081.283819715974!2d136.1766194!3d34.9485635!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x53771ed5e38db464!2z44OI44O844K_44Or44Oq44Oa44KiIOOCsOODquODvOODs-ODreODvOODiQ!5e0!3m2!1sja!2sjp!4v1556532218869!5m2!1sja!2sjp";
