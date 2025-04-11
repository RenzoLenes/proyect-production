// components/SuccessNotification.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useSound } from 'use-sound';
import { useEffect } from 'react';

interface SuccessNotificationProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  soundUrl?: string;
  duration?: number;
}

export const SuccessNotification = ({
  show,
  onClose,
  title = "¡Operación exitosa!",
  message = "La operación se completó correctamente",
  soundUrl = '/sounds/mixkit-achievement-bell-600.wav',
  duration = 2000
}: SuccessNotificationProps) => {
  const [play] = useSound(soundUrl, {
    volume: 0.7,
    interrupt: true
  });

  useEffect(() => {
    if (show) {
      play();
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose, play]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-background p-6 rounded-lg shadow-lg max-w-sm border"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="text-green-500"
              >
                <CheckCircle2 size={48} strokeWidth={1.5} />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold">{title}</h3>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-muted-foreground">{message}</p>
              </motion.div>

              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, x: Math.random() * 40 - 20, opacity: 0 }}
                    animate={{ y: 100, opacity: [1, 0] }}
                    transition={{
                      delay: 0.4 + i * 0.05,
                      duration: 1.5,
                      ease: "easeOut"
                    }}
                    className="absolute top-0 h-2 w-2 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: `hsl(${Math.random() * 60 + 100}, 80%, 60%)`
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};