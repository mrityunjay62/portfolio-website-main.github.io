"use client";

import { motion } from 'framer-motion';

export default function EntryGate({
  visitor,
  setVisitor,
  onEnter,
}: {
  visitor: { name: string; purpose: string };
  setVisitor: (value: { name: string; purpose: string }) => void;
  onEnter: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-violet-400/30 bg-slate-900/90 p-8 shadow-neon backdrop-blur"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500 text-xl font-bold text-white">
            MK
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Portfolio Gate</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-200">Name</span>
            <input
              required
              value={visitor.name}
              onChange={(e) => setVisitor({ ...visitor, name: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
              placeholder="Enter your name"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-200">Role / Purpose</span>
            <select
              value={visitor.purpose}
              onChange={(e) => setVisitor({ ...visitor, purpose: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none"
            >
              <option>Recruiter</option>
              <option>Client</option>
              <option>Just Browsing</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onEnter}
            className="mt-3 w-full rounded-full bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400"
          >
            Enter
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
