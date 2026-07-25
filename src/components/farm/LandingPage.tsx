import { motion } from "framer-motion";
import { ArrowDown, Rocket, BarChart2 } from "lucide-react";
import { FIELDS } from "@/lib/farm-data";

export function LandingPage() {
  const scrollToDashboard = () => {
    const el = document.getElementById("dashboard");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F7F8F3] overflow-hidden flex items-center justify-center font-sans text-dark-text pt-12 pb-24">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M-100 200 C300 50 600 350 1500 150" stroke="#285943" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M-100 400 C400 250 800 550 1500 350" stroke="#6AA84F" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M-100 600 C500 450 1000 750 1500 550" stroke="#4FA3D9" strokeWidth="2" strokeDasharray="5 5" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="max-w-[600px]">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-border/50 mb-8"
          >
            <span className="w-5 h-5 rounded-full bg-leaf/20 flex items-center justify-center text-forest">
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2C8 8 6 12 6 15a6 6 0 0 0 12 0c0-3-2-7-6-13Z" />
              </svg>
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase text-dark-text">Precision Agriculture OS</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            What if you could see <span className="text-forest">your</span> soil's future?
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-light-text mb-10 leading-relaxed max-w-[540px]"
          >
            Real-time soil moisture, NPK analysis, and AI-driven agronomic insights — all in one command center built for the modern farmer.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button 
              onClick={scrollToDashboard}
              className="flex items-center gap-2 bg-forest text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              🚀 Launch Dashboard
            </button>
            <button 
              onClick={scrollToDashboard}
              className="flex items-center gap-2 bg-white text-dark-text border border-border/80 px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-gray-50 transition-all"
            >
              <BarChart2 size={18} className="text-water" />
              View Live Data
            </button>
          </motion.div>
        </div>

        {/* Right Content - 3x2 Grid Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50"
          style={{ boxShadow: "0 25px 50px -12px rgba(40, 89, 67, 0.15)" }}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-light-text">
              <span className="w-2 h-2 rounded-full bg-healthy animate-pulse"></span>
              Live Field Status (3x2 Mesh)
            </div>
            <div className="bg-background px-3 py-1 rounded-full text-xs font-mono text-light-text">
              6 Active Plots
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {FIELDS.map((field) => {
              const isHealthy = field.status === "healthy";
              const isWarning = field.status === "warning";
              const isCritical = field.status === "critical";
              
              const statusColor = isHealthy ? "bg-healthy" : isWarning ? "bg-warning" : "bg-critical";
              const textColor = isHealthy ? "text-healthy" : isWarning ? "text-warning" : "text-critical";

              return (
                <div key={field.id} className="bg-background rounded-2xl p-4 border border-border/40 hover:border-border transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-light-text">{field.id}</span>
                    <span className={`w-2 h-2 rounded-full ${statusColor} shadow-sm`}></span>
                  </div>
                  <div className="font-display font-bold text-base mb-4">{field.crop}</div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-[10px] uppercase font-bold ${textColor}`}>
                      {field.status}
                    </span>
                    <span className={`text-xs font-mono font-bold ${textColor}`}>
                      {field.hourly[0]?.moisture ?? 0}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={scrollToDashboard}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer text-light-text hover:text-dark-text transition-colors animate-bounce"
      >
        <ArrowDown size={24} />
      </motion.div>
    </div>
  );
}
