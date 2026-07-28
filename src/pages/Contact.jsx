import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Globe, Sparkles, Loader2 } from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { fadeIn, staggerContainer } from "../utils/animations";
import { sendEnquiry, isMailConfigured, CONTACT_EMAIL } from "../utils/sendEnquiry";

const toastStyle = {
  background: "#1a0e14",
  color: "#f7f0f2",
  border: "1px solid rgba(166,38,72,0.35)",
  borderRadius: "14px",
  fontSize: "13px",
};

const inputClasses =
  "w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none " +
  "focus:border-primary/50 focus:bg-white/10 transition-all";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { via } = await sendEnquiry(data);
      if (via === "mailto") {
        toast("Opening your email app…", { style: toastStyle, icon: "✉️" });
      } else {
        toast.success("Thanks — your enquiry is on its way.", { style: toastStyle });
        reset();
      }
    } catch (err) {
      toast.error(`Could not send: ${err.message}`, { style: toastStyle });
    }
  };

  const contactInfo = [
    { icon: <Phone size={20} />, title: "Call Us", detail: "+91 93804 28285", sub: "Daily, 10am - 11pm", href: "tel:+919380428285" },
    { icon: <Mail size={20} />, title: "Email Us", detail: "zoyasayeedaahmed05@gmail.com", sub: "Response within 24hrs", href: "mailto:zoyasayeedaahmed05@gmail.com" },
    { icon: <MapPin size={20} />, title: "Visit Us", detail: "Gottigere, Bangalore", sub: "Karnataka, India" },
    { icon: <Clock size={20} />, title: "Hours", detail: "10:00 AM - 11:00 PM", sub: "Open 7 Days a week" },
  ];

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit={{ opacity: 0 }}
      className="min-h-screen bg-bg-main text-white pt-32 pb-20 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          variants={fadeIn("up", 0.1)}
          className="text-center mb-20"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="text-primary" size={16} />
            <span className="text-primary uppercase tracking-[0.4em] text-xs font-bold">Get In Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Let’s Start a <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Conversation</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking to book a private event, inquire about our seasonal menu, 
            or just want to say hi, our team is ready to welcome you.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          
          {/* 1. Quick Contact Cards */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 h-fit"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={fadeIn("right", 0.1 * index)}>
                <GlassCard className="p-6 flex items-center gap-6 group hover:border-primary/40 transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {info.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-widest text-slate-500 mb-1 font-bold">{info.title}</h4>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-lg font-medium text-white hover:text-primary-light transition-colors break-words"
                      >
                        {info.detail}
                      </a>
                    ) : (
                      <p className="text-lg font-medium text-white break-words">{info.detail}</p>
                    )}
                    <p className="text-[10px] text-slate-600 uppercase font-bold mt-1">{info.sub}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          {/* 2. Interactive Contact Form */}
          <motion.div 
            variants={fadeIn("up", 0.3)}
            className="lg:col-span-2"
          >
            <GlassCard className="p-8 md:p-12 border-white/5">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 group-focus-within:text-primary transition-colors">Full Name</label>
                  <input
                    id="name"
                    className={inputClasses}
                    placeholder="John Doe"
                    aria-invalid={!!errors.name}
                    {...register("name", { required: "Please tell us your name" })}
                  />
                  {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>}
                </div>

                <div className="space-y-2 group">
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    className={inputClasses}
                    placeholder="john@example.com"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "We need an address to reply to",
                      pattern: { value: /^\S+@\S+\.\S+$/, message: "That doesn't look like an email" },
                    })}
                  />
                  {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-2 group">
                  <label htmlFor="subject" className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 group-focus-within:text-primary transition-colors">Subject</label>
                  <select
                    id="subject"
                    className={`${inputClasses} appearance-none [color-scheme:dark] cursor-pointer`}
                    {...register("subject")}
                  >
                    <option className="bg-bg-main">General Inquiry</option>
                    <option className="bg-bg-main">Private Event</option>
                    <option className="bg-bg-main">Catering Services</option>
                    <option className="bg-bg-main">Feedback</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2 group">
                  <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1 group-focus-within:text-primary transition-colors">Your Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className={`${inputClasses} resize-none`}
                    placeholder="How can we help you today?"
                    aria-invalid={!!errors.message}
                    {...register("message", {
                      required: "Please add a short message",
                      minLength: { value: 10, message: "A little more detail, please" },
                    })}
                  />
                  {errors.message && <p className="text-red-400 text-xs ml-1">{errors.message.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="w-full py-5 bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all"
                  >
                    {isSubmitting ? (
                      <>Sending <Loader2 size={18} className="animate-spin" /></>
                    ) : (
                      <>Send Message <Send size={18} /></>
                    )}
                  </motion.button>

                  {!isMailConfigured() && (
                    <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                      Delivery key not set yet — sending will open your own email app.
                      You can always write to{" "}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary-light hover:underline">
                        {CONTACT_EMAIL}
                      </a>.
                    </p>
                  )}
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>

        {/* 3. Extra Content: FAQ Section */}
        <motion.div 
          variants={fadeIn("up", 0.5)}
          className="mt-32 border-t border-white/5 pt-20"
        >
          <div className="flex items-center gap-4 mb-12">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="text-3xl font-serif">Common Queries</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { q: "Do you offer valet parking?", a: "Yes, we provide complimentary valet parking for all our dinner guests." },
              { q: "Can I host a corporate event?", a: "Absolutely. We have a private lounge equipped for presentations and fine dining." },
              { q: "Is there a dress code?", a: "We recommend smart casual to match the Cafe Bloom atmosphere." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {faq.q}
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;