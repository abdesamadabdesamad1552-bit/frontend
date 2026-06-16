import type { CountryCode } from "./pricing";

export type CallUrgency = "now" | "morning";

export interface CallWindowMessage {
  urgency: CallUrgency;
  headline: string;
  subline: string;
  banner: string;
}

const GCC_TIMEZONE: Record<CountryCode, string> = {
  SA: "Asia/Riyadh",
  AE: "Asia/Dubai",
  KW: "Asia/Kuwait",
  QA: "Asia/Qatar",
  BH: "Asia/Bahrain",
  OM: "Asia/Muscat",
};

function localHour(date: Date, country: CountryCode): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    timeZone: GCC_TIMEZONE[country],
  }).format(date);
  return parseInt(formatted, 10);
}

/** COD confirmation calls: 9:00–21:00 local GCC time. */
export function getCallWindowMessage(
  country: CountryCode,
  orderDate = new Date()
): CallWindowMessage {
  const hour = localHour(orderDate, country);
  const inWindow = hour >= 9 && hour < 21;

  if (inWindow) {
    return {
      urgency: "now",
      headline: "انتظر اتصالنا خلال 10 دقائق",
      subline:
        "سنتصل من رقم قد لا يظهر باسم «نقاء» — الرجاء الرد لتأكيد عنوانك وإتمام الشحن.",
      banner: "📞 مهم: سناتصلك خلال 10 دقائق — لا تفوتي الرد!",
    };
  }

  return {
    urgency: "morning",
    headline: "ستتلقين اتصالنا صباح الغد",
    subline:
      "بين 9:00 و 10:00 صباحاً (توقيت بلدك) — نؤكد طلبك وعنوان التوصيل قبل الشحن.",
    banner: "📞 طلبك مسجّل — انتظر اتصالنا صباح الغد (9–10 ص)",
  };
}
