import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "اتصل بنا | نقاء للتجميل الفاخر",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-text-primary mb-4">تواصل معنا</h1>
            <p className="text-[15px] text-text-muted max-w-lg mx-auto leading-relaxed">
              نسعد بتواصلك معنا. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
            <div className="p-7 rounded-xl bg-obsidian-surface border border-glass-border text-center">
              <Mail className="w-6 h-6 text-gold/50 mx-auto mb-3" strokeWidth={1.5} />
              <h2 className="text-[14px] font-bold text-text-primary mb-2">البريد الإلكتروني</h2>
              <a href="mailto:contact@naqabeauty.shop" className="text-[13px] text-gold/70 hover:text-gold transition-colors">
                contact@naqabeauty.shop
              </a>
            </div>
            <div className="p-7 rounded-xl bg-obsidian-surface border border-glass-border text-center">
              <Clock className="w-6 h-6 text-gold/50 mx-auto mb-3" strokeWidth={1.5} />
              <h2 className="text-[14px] font-bold text-text-primary mb-2">وقت الرد</h2>
              <p className="text-[13px] text-text-muted">خلال 24 ساعة في أيام العمل</p>
            </div>
          </div>

          <form className="space-y-5">
            {[
              { id: "name", label: "الاسم الكامل", type: "text", placeholder: "مثال: سارة أحمد" },
              { id: "email", label: "البريد الإلكتروني", type: "email", placeholder: "example@email.com", dir: "ltr" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-[12px] font-medium text-text-muted mb-1.5">{f.label}</label>
                <input
                  type={f.type} id={f.id} placeholder={f.placeholder} dir={f.dir as "ltr" | undefined}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-elevated border border-glass-border text-text-primary text-[14px] placeholder:text-text-faint focus:outline-none focus:border-gold/30 transition-colors"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="block text-[12px] font-medium text-text-muted mb-1.5">الرسالة</label>
              <textarea
                id="message" rows={5} placeholder="اكتب رسالتك هنا..."
                className="w-full px-4 py-3 rounded-xl bg-obsidian-elevated border border-glass-border text-text-primary text-[14px] placeholder:text-text-faint focus:outline-none focus:border-gold/30 transition-colors resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-gold text-obsidian text-[14px] font-bold py-3.5 rounded-xl hover:bg-gold-light transition-colors">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
