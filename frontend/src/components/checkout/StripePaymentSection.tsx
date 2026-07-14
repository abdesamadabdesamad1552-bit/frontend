"use client";

import { useMemo, useState } from "react";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import type { CartItem } from "@/lib/cart-context";
import type { CountryCode } from "@/lib/pricing";
import { toMinorUnits } from "@/lib/payments/amount";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface CustomerDetails {
  name: string;
  phone: string;
  city: string;
  address: string;
}

interface StripePaymentSectionProps {
  items: CartItem[];
  country: CountryCode;
  currency: string;
  amount: number; // major units — the server-verified total already shown to the user
  customer: CustomerDetails;
  /** Show the manual card-number entry fields (only when the "بطاقة بنكية" radio is selected). The Apple/Google Pay express button always shows above it, independent of this. */
  showCardFields: boolean;
  onValidate: () => boolean;
  onOrderCreated: (orderId: string) => void;
  onError: (message: string) => void;
}

async function createIntent(payload: {
  method: "card" | "apple_pay";
  items: CartItem[];
  country: CountryCode;
  currency: string;
  customer: CustomerDetails;
}): Promise<{ clientSecret: string; orderId: string }> {
  const res = await fetch("/api/payments/create-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.clientSecret) {
    throw new Error(data.message || data.error || "تعذر بدء عملية الدفع");
  }
  return data;
}

type InnerFormProps = Omit<StripePaymentSectionProps, "amount">;

function InnerForm({
  items,
  country,
  currency,
  customer,
  showCardFields,
  onValidate,
  onOrderCreated,
  onError,
}: InnerFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);

  async function confirmWith(method: "card" | "apple_pay") {
    if (!stripe || !elements) return;
    setIsPaying(true);
    try {
      const { clientSecret, orderId } = await createIntent({
        method,
        items,
        country,
        currency,
        customer,
      });
      onOrderCreated(orderId);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "تعذر إتمام الدفع");
        return;
      }
      // No redirect was needed (e.g. a card that didn't require 3DS) — the
      // webhook may already be in flight, so send the shopper to the same
      // success/poll page ourselves instead of leaving them stranded.
      if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        window.location.href = `${window.location.origin}/checkout/success?orderId=${orderId}`;
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsPaying(false);
    }
  }

  async function handleCardSubmit() {
    if (!stripe || !elements) return;
    if (!onValidate()) return;
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message || "يرجى مراجعة بيانات البطاقة");
      return;
    }
    await confirmWith("card");
  }

  async function handleExpressConfirm(event: { expressPaymentType?: string }) {
    if (!stripe || !elements) return;
    if (!onValidate()) return;
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message || "تعذر التحقق من بيانات الدفع");
      return;
    }
    await confirmWith(event.expressPaymentType === "apple_pay" ? "apple_pay" : "card");
  }

  return (
    <div className="space-y-4">
      {/* Apple Pay / Google Pay / Link — renders nothing if unavailable on this device/browser. */}
      <ExpressCheckoutElement onConfirm={handleExpressConfirm} />

      {showCardFields && (
        <>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-brand-beige-dark" />
            <span className="text-xs text-brand-gray">أو أدخلي بيانات البطاقة</span>
            <span className="h-px flex-1 bg-brand-beige-dark" />
          </div>
          <PaymentElement />
          <button
            type="button"
            onClick={handleCardSubmit}
            disabled={isPaying || !stripe}
            className="w-full bg-brand-black text-brand-white text-base font-semibold py-4 rounded-full transition-all duration-300 hover:bg-brand-gold active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
          >
            {isPaying ? "جاري المعالجة..." : "ادفعي الآن"}
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Mounts once near the top of the payment-methods section (regardless of
 * which method radio is selected) so the Apple Pay / Google Pay express
 * button — Stripe's Express Checkout Element — is always available as a
 * one-tap shortcut. The manual card-entry Payment Element only appears when
 * `showCardFields` is true (the shopper picked "بطاقة بنكية").
 *
 * Uses the "collect details, create the intent on submit" pattern: Elements
 * mounts in deferred `mode:'payment'` (no clientSecret up front); the
 * PaymentIntent is created via /api/payments/create-session only once the
 * shopper confirms, then immediately confirmed.
 *
 * Renders nothing if NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY isn't set, unless the
 * card fields were requested, in which case it shows a short "coming soon" note.
 */
export default function StripePaymentSection(props: StripePaymentSectionProps) {
  const { amount, currency, showCardFields } = props;

  const options: StripeElementsOptions = useMemo(
    () => ({
      mode: "payment",
      amount: toMinorUnits(currency, amount),
      currency: currency.toLowerCase(),
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#C8A24A",
          colorText: "#111111",
          colorBackground: "#ffffff",
          borderRadius: "12px",
          fontFamily: "IBM Plex Sans Arabic, sans-serif",
        },
      },
    }),
    [amount, currency]
  );

  if (!stripePromise) {
    if (!showCardFields) return null;
    return (
      <p className="text-sm text-brand-gray p-4 bg-brand-beige rounded-xl">
        الدفع بالبطاقة قيد التفعيل حالياً. جرّبي طريقة دفع أخرى.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <InnerForm {...props} />
    </Elements>
  );
}
