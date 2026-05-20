"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ApplyNowCard, { type ApplyNowModalContent } from "./ApplyNowCard";

export default function ApplyNowModal({ content }: { content: ApplyNowModalContent }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("apply") === "1";

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  function closeModal() {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("apply");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  if (!isOpen) return null;

  return (
    <div className="apply-now-modal" role="dialog" aria-modal="true" aria-label="Apply now form">
      <button type="button" className="apply-now-modal__backdrop" onClick={closeModal} aria-label="Close" />
      <div className="apply-now-modal__content">
        <button type="button" className="apply-now-modal__close" onClick={closeModal} aria-label="Close">
          ×
        </button>
        <ApplyNowCard content={content} />
      </div>
    </div>
  );
}
