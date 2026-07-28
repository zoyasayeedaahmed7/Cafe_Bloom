import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";

const toastStyle = {
  background: "#1a0e14",
  color: "#e2e8f0",
  border: "1px solid rgba(166, 38, 72,0.35)",
  borderRadius: "14px",
  fontSize: "13px",
};

/**
 * Renders "Add to Cart" until the item is in the cart, then swaps to a
 * quantity stepper so the count can be changed without leaving the menu.
 */
const AddToCartButton = ({ item, className = "" }) => {
  const { addItem, changeQty, getQty } = useCart();
  const qty = getQty(item.id);

  const handleAdd = (e) => {
    // These buttons sit inside cards that are themselves hover/link targets.
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    toast.success(`${item.name} added`, {
      style: toastStyle,
      icon: <Check size={16} className="text-primary" />,
    });
  };

  const step = (delta) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    changeQty(item.id, delta);
    if (delta < 0 && qty === 1) {
      toast(`${item.name} removed`, { style: toastStyle, icon: "🗑️" });
    }
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {qty === 0 ? (
          <motion.button
            key="add"
            type="button"
            onClick={handleAdd}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Add ${item.name} to cart`}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                       bg-primary/10 border border-primary/30 text-primary
                       text-[11px] font-bold uppercase tracking-[0.18em]
                       hover:bg-primary hover:text-white hover:border-primary
                       transition-colors duration-300"
          >
            <ShoppingBag size={14} /> Add to Cart
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="flex items-center justify-between p-1.5 rounded-xl
                       bg-primary border border-primary shadow-lg shadow-primary/25"
          >
            <button
              type="button"
              onClick={step(-1)}
              aria-label={`Reduce ${item.name} quantity`}
              className="w-9 h-9 rounded-lg flex items-center justify-center
                         text-white/90 hover:bg-white/20 active:scale-90 transition"
            >
              <Minus size={15} />
            </button>

            <div className="flex flex-col items-center leading-none">
              <motion.span
                key={qty}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white font-bold text-sm"
              >
                {qty}
              </motion.span>
              <span className="text-[8px] text-white/60 uppercase tracking-[0.15em] mt-0.5">
                in cart
              </span>
            </div>

            <button
              type="button"
              onClick={step(1)}
              aria-label={`Increase ${item.name} quantity`}
              className="w-9 h-9 rounded-lg flex items-center justify-center
                         text-white/90 hover:bg-white/20 active:scale-90 transition"
            >
              <Plus size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddToCartButton;
