import Image from "next/image";
import whyNaqaPillars from "@/data/why-naqa.json";

export default function WhyNaqaSection() {
  return (
    <section className="py-20 md:py-32 bg-brand-beige border-y border-brand-beige-dark">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-brand-gold text-xs font-semibold tracking-[0.25em] uppercase text-center mb-4">
          فلسفتنا
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-black text-center mb-5">
          لماذا نقاء؟
        </h2>
        <p className="text-brand-gray text-center text-sm md:text-base mb-14 md:mb-16 max-w-xl mx-auto leading-relaxed">
          معايير فاخرة في كل تفصيل — من التركيبة إلى التجربة
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyNaqaPillars.map((pillar) => (
            <article
              key={pillar.id}
              className="group bg-brand-white rounded-2xl border border-brand-beige-dark p-7 text-center shadow-[var(--shadow-luxe)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-[var(--shadow-luxe-lg)]"
            >
              <div className="relative mx-auto mb-6 w-20 h-20 rounded-full bg-brand-beige border border-brand-beige-dark flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:border-brand-gold/40">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  width={60}
                  height={60}
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2.5">
                {pillar.title}
              </h3>
              <p className="text-sm text-brand-gray leading-[1.8]">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
