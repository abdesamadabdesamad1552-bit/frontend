import Image from "next/image";
import whyNaqaPillars from "@/data/why-naqa.json";

export default function WhyNaqaSection() {
  return (
    <section className="py-16 md:py-24 bg-brand-beige">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-black text-center mb-4">
          لماذا نقاء؟
        </h2>
        <p className="text-brand-gray text-center text-sm md:text-base mb-12 max-w-xl mx-auto">
          معايير فاخرة في كل تفصيل — من التركيبة إلى التجربة
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyNaqaPillars.map((pillar) => (
            <article
              key={pillar.id}
              className="group bg-brand-white rounded-2xl border border-brand-beige-dark p-6 text-center transition-shadow hover:shadow-md hover:border-brand-gold/30"
            >
              <div className="relative mx-auto mb-5 w-20 h-20 rounded-2xl bg-brand-beige border border-brand-beige-dark flex items-center justify-center overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  width={64}
                  height={64}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-bold text-brand-black mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-brand-gray leading-relaxed">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
