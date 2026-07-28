import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { menuData, mustTryDishes } from "../data/menuData";
import GlassCard from "../components/ui/GlassCard";
import { formatPrice } from "../utils/helpers";
import { staggerContainer } from "../utils/animations";
import { Search, Flame, Star, Utensils, Info } from "lucide-react";
import AddToCartButton from "../components/ui/AddToCartButton";

const Menu = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["Must Try", "All", ...new Set(menuData.map((item) => item.category))];

  // Pick the base list from the active tab, then narrow it by the search box.
  const baseMenu =
    filter === "Must Try"
      ? mustTryDishes
      : filter === "All"
      ? menuData
      : menuData.filter((item) => item.category === filter);

  const filteredMenu = baseMenu.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 bg-bg-main min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-serif text-white mb-4">The Full Collection</h2>
          <p className="text-slate-500 tracking-[0.2em] uppercase text-xs font-bold">
            Explore 50+ Signature Delicacies
          </p>
        </motion.div>
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-20">
          {/* Categories with Layout Animation */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 w-full lg:w-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className="relative px-6 py-2 group"
              >
                <span className={`relative z-10 text-xs uppercase tracking-widest transition-colors duration-300 ${
                  filter === cat ? 'text-white font-bold' : 'text-slate-500 group-hover:text-white'
                }`}>
                  {cat}
                </span>
                {filter === cat && (
                  <motion.div 
                    layoutId="activeTabMenu"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={search}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          variants={staggerContainer} 
          initial="initial" 
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <GlassCard className="group h-[620px] p-0 overflow-hidden flex flex-col border-white/5 hover:border-primary/20 transition-all duration-500">
                    {/* Image Area */}
                    <div className="relative h-[45%] shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      {/* Badge Overlays */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {item.tags.includes("Best Seller") && (
                          <span className="bg-primary/90 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                            <Star size={10} fill="white" /> POPULAR
                          </span>
                        )}
                        {item.tags.includes("Spicy") && (
                          <span className="bg-orange-500/90 backdrop-blur-md text-[10px] text-white px-3 py-1 rounded-full font-bold flex items-center gap-1">
                            <Flame size={10} fill="white" /> SPICY
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-lg">
                        <span className="text-primary text-[10px] font-bold">{item.calories}</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1">
                            {item.category}
                          </p>
                          <h4 className="text-2xl text-white font-serif tracking-wide">{item.name}</h4>
                        </div>
                        <span className="text-xl text-white font-serif italic">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="w-8 h-[1px] bg-primary mb-4 group-hover:w-full transition-all duration-500" />

                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Nutritional info tag footer + cart action */}
                      <div className="mt-auto space-y-5">
                        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
                            <Info size={12} className="text-primary" /> Freshly Prepared
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-[10px] uppercase font-bold tracking-tighter">
                            <Utensils size={12} className="text-primary" /> Premium Quality
                          </div>
                        </div>

                        <AddToCartButton item={item} />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            ) : (
              /* No Results State */
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-20 text-center"
              >
                <div className="text-slate-600 mb-4 flex justify-center">
                  <Search size={48} />
                </div>
                <h3 className="text-white font-serif text-2xl">No delicacies found</h3>
                <p className="text-slate-500">Try adjusting your search or category filter.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Menu;