import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Tamper-Proof Records",
      description: "Certificates are hashed and anchored to the blockchain, making them mathematically impossible to alter or forge."
    },
    {
      icon: Zap,
      title: "Instant Verification",
      description: "Employers can verify a candidate's credentials in milliseconds using our cryptographic verification engine."
    },
    {
      icon: Lock,
      title: "Cryptographic Security",
      description: "Utilizing industry-standard SHA-256 hashing to ensure data integrity and privacy of the original documents."
    }
  ];

  return (
    <div className="min-h-screen pt-20 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 text-sm font-medium text-primary"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Blockchain Verification System Now Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            End the era of <span className="text-gradient">fake credentials.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Issue secure, decentralized certificates for your institution. Empower employers to verify authenticity instantly with zero friction.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-black hover:bg-primary/90 text-lg font-semibold shadow-[0_0_30px_rgba(0,255,128,0.3)] transition-all hover:scale-105">
                Issue Certificates
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-full border-white/20 hover:bg-white/5 text-lg font-semibold transition-all">
                Verify a Hash
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Mockup / Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 relative rounded-2xl glass-panel p-2 glow-border"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 rounded-2xl" />
          <div className="bg-[#0A0A0A] rounded-xl overflow-hidden border border-white/5 flex flex-col md:flex-row">
             <div className="p-8 md:w-1/2 flex flex-col justify-center border-r border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Cryptographically Proven</h3>
                <p className="text-muted-foreground mb-6">When you issue a certificate, a unique cryptographic hash is generated and stored permanently on the blockchain ledger.</p>
                <div className="space-y-3 font-mono text-xs text-muted-foreground bg-black/50 p-4 rounded-lg border border-white/5">
                  <div className="flex justify-between"><span className="text-primary">Status:</span> <span>Verified</span></div>
                  <div className="flex justify-between"><span>Hash:</span> <span className="truncate ml-4">0x7f8c9b...2a1d</span></div>
                  <div className="flex justify-between"><span>Timestamp:</span> <span>{new Date().toISOString()}</span></div>
                </div>
             </div>
             {/* landing page hero web3 abstract visualization */}
             <div className="md:w-1/2 relative min-h-[300px] bg-black">
                <img 
                  src="https://pixabay.com/get/g0c90b9742f4394a3a7851efbfa2863dbbd847d450fb01ac4328671dd7b3987c095cc4c4fa96efe8fa92b5f96d42c5e7e857689a0e1e15f3a088512b66a842ead_1280.jpg" 
                  alt="Abstract web3 visualization"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
                />
             </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl glass-panel hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-primary border border-white/10">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
