"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionSection({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.section id={id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.section>
  );
}
