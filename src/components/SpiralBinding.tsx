import { motion } from "framer-motion";

const SpiralBinding = () => {
  const holes = Array.from({ length: 15 });

  return (
    <motion.div
      className="relative w-full h-12 flex items-center justify-center z-10 bg-gradient-to-b from-muted/50 to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Top edge highlight - metallic */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      {/* Binding bar shadow */}
      <div className="absolute inset-x-0 top-2 h-2 bg-gradient-to-b from-black/5 to-transparent blur-sm" />

      {/* Metal wire */}
      <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-muted-foreground/20 via-muted-foreground/40 to-muted-foreground/20 rounded-full shadow-sm" />

      {/* Holes */}
      <div className="flex justify-between w-full px-4 py-2">
        {holes.map((_, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.02 }}
          >
            {/* Wire loop - 3D effect */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-5 border-2 border-muted-foreground/40 rounded-full shadow-sm"
              style={{
                boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            
            {/* Hole punch - deep shadow for 3D depth */}
            <div
              className="relative w-3 h-3 rounded-full bg-gradient-to-br from-muted-foreground/60 to-muted-foreground/80 shadow-sm"
              style={{
                boxShadow: "inset -1px -1px 3px rgba(0,0,0,0.3), inset 1px 1px 1px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.15)",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom edge shadow */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-b from-transparent to-black/5 blur-sm" />

      {/* Bottom highlight */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
};

export default SpiralBinding;
