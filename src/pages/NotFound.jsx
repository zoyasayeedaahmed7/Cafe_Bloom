"use client";
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Boxes } from "../components/ui/background-boxes";
import { MoveLeft, HomeIcon } from "lucide-react";
import { cn } from "../utils/utils";

const NotFound = () => {
  return (
    <div className="h-screen relative w-full overflow-hidden bg-slate-950 flex flex-col items-center justify-center">
      {/* Radial Mask to make the boxes fade out at the edges */}
      <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />

      <div className="relative z-30 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={cn("md:text-9xl text-7xl font-serif text-white/10 select-none mb-4")}>
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl text-white font-serif mb-6">
            Lost in the <span className="text-primary-light italic">Aroma?</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
            The secret recipe for this page has vanished. Let's get you back to the main menu.
          </p>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 bg-primary hover:bg-primary text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-2xl shadow-primary/20"
            >
              <HomeIcon size={16} />
              Back to Home
              <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-primary/10 to-transparent z-20 pointer-events-none" />
    </div>
  );
};

export default NotFound;