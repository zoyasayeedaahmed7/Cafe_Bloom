import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, ChevronRight, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatPrice } from "../utils/helpers";
import GlassCard from "../components/ui/GlassCard";
import { fadeIn, staggerContainer } from "../utils/animations";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const toastStyle = {
  background: "#150a0e",
  color: "#e2e8f0",
  border: "1px solid rgba(168, 29, 64,0.35)",
  borderRadius: "14px",
  fontSize: "13px",
};

// Add-on sauces offered alongside the order.
const sauces = [
  {
    id: "sauce-chilli",
    name: "Smoked Chilli Chutney",
    price: 120,
    image: "https://images.unsplash.com/photo-1575919159574-e49dc9e1228f?auto=format&fit=crop&q=70&w=600",
  },
  {
    id: "sauce-aioli",
    name: "Truffle Garlic Aioli",
    price: 150,
    image: "https://images.unsplash.com/photo-1758700835219-0422fdc4dd54?auto=format&fit=crop&q=70&w=600",
  },
];

const Order = () => {
  const {
    items, addItem, changeQty, removeItem, clearCart, getQty,
    isEmpty, count, subtotal, taxes, delivery, total, amountToFreeDelivery,
  } = useCart();

  const steps = [
    { id: 1, name: "Cart", icon: <ShoppingBag size={14} />, active: true },
    { id: 2, name: "Details", icon: <Truck size={14} />, active: false },
    { id: 3, name: "Payment", icon: <CreditCard size={14} />, active: false },
  ];

  return (
    <div className="pt-32 pb-20 bg-bg-main min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* Progress Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${step.active ? "text-primary" : "text-slate-600"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step.active ? "border-primary bg-primary/10" : "border-slate-800"}`}>
                    {step.id}
                  </span>
                  {step.name}
                </div>
                {idx !== steps.length - 1 && <ChevronRight size={14} className="text-slate-800" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left Column: Cart Items */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 space-y-6"
          >
            <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <h2 className="text-4xl font-serif text-white">Your Selection</h2>
              <div className="flex items-center gap-5">
                <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                  {count} {count === 1 ? "Item" : "Items"}
                </span>
                {!isEmpty && (
                  <button
                    onClick={() => {
                      clearCart();
                      toast("Selection cleared", { style: toastStyle, icon: "🧹" });
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-red-400 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {isEmpty ? (
                <motion.div
                  key="empty"
                  variants={fadeIn("up", 0.2)}
                  className="py-20 text-center"
                >
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 text-slate-700">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl text-white font-serif mb-4">Your gallery is empty</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    Looks like you haven't added any delicacies to your order yet.
                  </p>
                  <Link to="/menu">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                      Return to Menu
                    </motion.button>
                  </Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <GlassCard className="p-4 flex flex-col sm:flex-row gap-6 sm:items-center group">
                      {/* Thumbnail */}
                      <div className="w-full sm:w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Name + unit price */}
                      <div className="flex-grow min-w-0">
                        <p className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                          {item.category}
                        </p>
                        <h4 className="text-xl text-white font-serif truncate">{item.name}</h4>
                        <p className="text-slate-500 text-xs mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => changeQty(item.id, -1)}
                          aria-label={`Reduce ${item.name} quantity`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white active:scale-90 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <motion.span
                          key={item.qty}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-8 text-center text-white font-bold text-sm"
                        >
                          {item.qty}
                        </motion.span>
                        <button
                          onClick={() => changeQty(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white active:scale-90 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line total + remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:w-32">
                        <span className="text-lg text-white font-serif italic">
                          {formatPrice(item.price * item.qty)}
                        </span>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                            toast(`${item.name} removed`, { style: toastStyle, icon: "🗑️" });
                          }}
                          aria-label={`Remove ${item.name}`}
                          className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {/* Recommended Section — add-on sauces */}
            <div className="mt-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
              <h4 className="text-white font-serif mb-6 text-lg">Chef's Recommendations</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sauces.map((sauce) => {
                  const qty = getQty(sauce.id);
                  return (
                    <button
                      key={sauce.id}
                      onClick={() => {
                        addItem(sauce);
                        toast.success(`${sauce.name} added`, { style: toastStyle });
                      }}
                      aria-label={`Add ${sauce.name} to cart`}
                      className="group text-left"
                    >
                      <div className="aspect-square bg-white/5 rounded-2xl mb-3 overflow-hidden border border-white/5 relative">
                        <img
                          src={sauce.image}
                          alt={sauce.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                          <Plus size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {qty > 0 && (
                          <span className="absolute top-2 right-2 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {qty}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 font-bold group-hover:text-primary transition-colors">{sauce.name}</p>
                      <p className="text-[10px] text-primary">{formatPrice(sauce.price)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Summary */}
          <motion.div
            variants={fadeIn("left", 0.3)}
            initial="initial"
            animate="animate"
            className="h-fit lg:sticky lg:top-28"
          >
            <GlassCard className="p-8 space-y-8 border-primary/10">
              <div className="space-y-4">
                <h3 className="text-white font-serif text-2xl tracking-wide">Summary</h3>
                <div className="w-12 h-1 bg-primary rounded-full" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold">Subtotal</span>
                  <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold">Delivery Fee</span>
                  {delivery === 0 ? (
                    <span className="text-emerald-500 font-bold tracking-tighter uppercase">Free</span>
                  ) : (
                    <span className="text-white font-medium">{formatPrice(delivery)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 uppercase tracking-widest font-bold">Taxes (GST 5%)</span>
                  <span className="text-white font-medium">{formatPrice(taxes)}</span>
                </div>

                {!isEmpty && amountToFreeDelivery > 0 && (
                  <p className="text-[11px] text-primary/80 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 leading-relaxed">
                    Add {formatPrice(amountToFreeDelivery)} more for free delivery.
                  </p>
                )}

                <div className="h-px bg-white/10 my-6" />

                <div className="flex justify-between items-end">
                  <span className="text-white font-serif text-lg">Total Amount</span>
                  <span className="text-3xl text-primary font-serif italic">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <motion.button
                  disabled={isEmpty}
                  onClick={() => toast.success("Payment step coming soon", { style: toastStyle })}
                  whileHover={!isEmpty ? { scale: 1.02 } : {}}
                  whileTap={!isEmpty ? { scale: 0.98 } : {}}
                  className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/10 ${
                    isEmpty
                      ? "bg-white/5 text-slate-700 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  Proceed to Payment <ChevronRight size={18} />
                </motion.button>

                <p className="text-[10px] text-center text-slate-600 uppercase tracking-[0.2em] font-bold">
                  Secure 256-bit SSL Payment
                </p>
              </div>
            </GlassCard>

            {/* Back Link */}
            <Link to="/menu" className="flex items-center justify-center gap-2 mt-8 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Continue Browsing
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Order;
