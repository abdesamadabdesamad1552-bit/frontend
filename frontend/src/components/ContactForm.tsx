"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ، يرجى المحاولة مرة أخرى");

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ، يرجى المحاولة مرة أخرى");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center p-8 rounded-2xl bg-brand-beige border border-brand-beige-dark">
        <span className="text-4xl block mb-3">✓</span>
        <p className="text-brand-black font-bold mb-1">تم إرسال رسالتك بنجاح</p>
        <p className="text-sm text-brand-gray">سنرد عليك خلال 24 ساعة في أيام العمل.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-brand-black font-bold underline underline-offset-2"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-black mb-1.5">
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: سارة أحمد"
          className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1.5">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          dir="ltr"
          className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-black mb-1.5">
          الرسالة
        </label>
        <textarea
          id="message"
          rows={5}
          required
          minLength={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="w-full px-4 py-3 rounded-xl border border-brand-beige-dark bg-brand-white text-brand-black placeholder:text-brand-gray-light focus:outline-none focus:border-brand-gold resize-none"
        />
      </div>

      {status === "error" && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-brand-black text-brand-white text-base font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "جاري الإرسال..." : "إرسال الرسالة"}
      </button>
    </form>
  );
}
