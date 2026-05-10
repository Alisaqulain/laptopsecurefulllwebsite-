"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltipShown, setTooltipShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    const t2 = setTimeout(() => setTooltipShown(true), 3500);
    const t3 = setTimeout(() => setTooltipShown(false), 9500);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const link = buildWhatsAppLink(waMessages.generic());

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex items-center gap-3"
        >
          <AnimatePresence>
            {tooltipShown && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                className="hidden md:flex items-center gap-2 rounded-2xl glass-strong border border-emerald-500/30 px-4 py-2.5 text-sm font-medium shadow-2xl"
              >
                <span>💬 Need help? Chat with us!</span>
                <button
                  onClick={() => setTooltipShown(false)}
                  aria-label="Close tooltip"
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative group"
          >
            <span
              className="absolute inset-0 -z-10 rounded-full bg-[#25D366] animate-ping opacity-20"
              aria-hidden
            />
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_40px_rgba(37,211,102,0.5),0_0_0_4px_rgba(37,211,102,0.15)] transition-shadow hover:shadow-[0_10px_50px_rgba(37,211,102,0.7),0_0_0_8px_rgba(37,211,102,0.2)]"
            >
              <MessageCircle
                className="h-7 w-7 md:h-8 md:w-8 text-white"
                strokeWidth={2.2}
              />
            </motion.span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
