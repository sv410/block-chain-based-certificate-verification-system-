import { useState } from "react";
import { useVerifyCertificate } from "@/hooks/use-certificates";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, XCircle, Loader2, Award, Hash, Building, Calendar, User } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Verify() {
  const [hashInput, setHashInput] = useState("");
  const verifyMutation = useVerifyCertificate();
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput.trim()) return;
    
    setHasSearched(true);
    verifyMutation.mutate(hashInput);
  };

  const result = verifyMutation.data;
  const isError = verifyMutation.isError;

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 text-center mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-xl">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Verify Authenticity</h1>
        <p className="text-xl text-muted-foreground">
          Enter a certificate hash to verify its cryptographically secured record on the blockchain.
        </p>
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <form onSubmit={handleVerify} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative flex items-center bg-card border border-white/20 p-2 rounded-2xl shadow-2xl backdrop-blur-xl">
            <Search className="w-6 h-6 text-muted-foreground ml-4 shrink-0" />
            <Input 
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              placeholder="Paste SHA-256 Hash (e.g. 0x...)" 
              className="border-0 focus-visible:ring-0 text-lg bg-transparent px-4 h-14 font-mono placeholder:font-sans placeholder:text-muted-foreground/50"
            />
            <Button 
              type="submit" 
              size="lg"
              disabled={verifyMutation.isPending || !hashInput.trim()}
              className="h-14 px-8 rounded-xl bg-primary text-black hover:bg-primary/90 font-bold text-base"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {verifyMutation.isPending && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-20 text-primary"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-pulse" />
                  <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
                  <ShieldCheck className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="mt-6 font-mono text-sm animate-pulse tracking-widest">QUERYING BLOCKCHAIN LEDGER...</p>
              </motion.div>
            )}

            {!verifyMutation.isPending && hasSearched && result?.valid && result.certificate && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {/* Certificate Card */}
                <div className="glass-panel p-1 rounded-3xl glow-border">
                  <div className="bg-gradient-to-b from-[#111] to-black rounded-[22px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary/10 border-b border-primary/20 p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <CheckCircleIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-primary font-bold text-xl">Verification Successful</h2>
                        <p className="text-primary/70 text-sm">This certificate is authentic and anchored.</p>
                      </div>
                    </div>
                    
                    {/* Body */}
                    <div className="p-8 grid sm:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <User className="w-4 h-4" /> Student Name
                          </div>
                          <div className="text-2xl font-bold">{result.certificate.studentName}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Award className="w-4 h-4" /> Course / Credential
                          </div>
                          <div className="text-xl font-medium">{result.certificate.courseName}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Building className="w-4 h-4" /> Issued By
                          </div>
                          <div className="text-lg">{result.certificate.issuedBy}</div>
                        </div>
                      </div>

                      <div className="space-y-6 sm:border-l border-white/5 sm:pl-8">
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Calendar className="w-4 h-4" /> Date of Issue
                          </div>
                          <div className="text-lg">
                            {result.certificate.issueDate ? format(new Date(result.certificate.issueDate), "MMMM do, yyyy") : "N/A"}
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                            <Hash className="w-4 h-4" /> Transaction Hash
                          </div>
                          <div className="font-mono text-sm bg-black p-3 rounded-lg border border-white/5 break-all text-muted-foreground">
                            {result.certificate.txHash}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!verifyMutation.isPending && hasSearched && (isError || (result && !result.valid)) && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel border-destructive/30 p-8 rounded-3xl text-center bg-destructive/5"
              >
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6 border border-destructive/20 shadow-[0_0_30px_rgba(255,0,0,0.2)]">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We could not find a valid certificate matching this hash on the network. The record may be forged, revoked, or the hash is incorrect.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Simple internal icon since Lucide's CheckCircle2 was used elsewhere but imported as CheckCircleIcon here for clarity
function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
