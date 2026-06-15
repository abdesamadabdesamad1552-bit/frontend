"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  fallbackSrc?: string;
  badge?: string;
  badgeBg?: string;
}

export default function ProductGallery({
  images,
  productName,
  fallbackSrc,
  badge,
  badgeBg = "bg-brand-gold text-white",
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [brokenSrcs, setBrokenSrcs] = useState<Set<string>>(() => new Set());

  const markBroken = (src: string) => {
    setBrokenSrcs((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  };

  const displayImages = useMemo(() => {
    const valid = images.filter((img) => !brokenSrcs.has(img.src));
    if (valid.length > 0) return valid;
    if (fallbackSrc && !brokenSrcs.has(fallbackSrc)) {
      return [{ src: fallbackSrc, alt: productName }];
    }
    return [{ src: "/placeholder.png", alt: productName }];
  }, [images, brokenSrcs, fallbackSrc, productName]);

  useEffect(() => {
    if (currentIndex >= displayImages.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displayImages.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-beige border border-brand-beige-dark group">
        {badge && (
          <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${badgeBg}`}>
            {badge}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={displayImages[currentIndex]?.src ?? currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <motion.div
              animate={{
                scale: isZoomed ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full h-full"
            >
              <Image
                src={displayImages[currentIndex].src}
                alt={displayImages[currentIndex].alt}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => markBroken(displayImages[currentIndex].src)}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-brand-beige-dark flex items-center justify-center text-brand-black opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-brand-beige-dark flex items-center justify-center text-brand-black opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-md rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((img, idx) => (
            <button
              key={img.src}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                currentIndex === idx ? "border-brand-gold" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => markBroken(img.src)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
