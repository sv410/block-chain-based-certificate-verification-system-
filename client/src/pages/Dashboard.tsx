import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, type InsertCertificate } from "@shared/routes";
import { useCertificates, useCreateCertificate } from "@/hooks/use-certificates";
import { format } from "date-fns";
import { FileSignature, Loader2, Copy, Check, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { toast } = useToast();
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  
  const { data: certificates, isLoading: isLoadingCerts } = useCertificates();
  const createMutation = useCreateCertificate();

  const form = useForm<InsertCertificate>({
    resolver: zodResolver(api.certificates.create.input),
    defaultValues: {
      studentName: "",
      courseName: "",
      issuedBy: "",
    },
  });

  const onSubmit = (data: InsertCertificate) => {
    createMutation.mutate(data, {
      onSuccess: (newCert) => {
        toast({
          title: "Certificate Issued Successfully",
          description: "The record has been anchored to the blockchain.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to issue",
          description: error.message,
        });
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Hash ready to be verified.",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold">Issuer Dashboard</h1>
        <p className="text-muted-foreground mt-2">Create and manage blockchain-anchored certificates.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Issue Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl glow-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileSignature className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-display font-semibold">Issue New</h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Student Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Alice Johnson" 
                          className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Course / Credential</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Advanced Solidity Development" 
                          className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/80">Issuing Institution</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Crypto Academy" 
                          className="bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                  className="w-full bg-primary text-black hover:bg-primary/90 font-semibold h-12 shadow-[0_4px_14px_rgba(0,255,128,0.2)]"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Anchoring to Chain...
                    </>
                  ) : (
                    "Issue & Anchor"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Column - Recent Certificates */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-2xl min-h-[500px]">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-display font-semibold">Ledger History</h2>
                </div>
                <div className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {certificates?.length || 0} Records
                </div>
             </div>

             <div className="space-y-4">
                {isLoadingCerts ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-black/20 flex flex-col gap-3">
                      <Skeleton className="h-5 w-1/3 bg-white/5" />
                      <Skeleton className="h-4 w-1/4 bg-white/5" />
                      <Skeleton className="h-8 w-full bg-white/5 mt-2" />
                    </div>
                  ))
                ) : certificates?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    <FileSignature className="w-12 h-12 mb-4 opacity-20" />
                    <p>No certificates issued yet.</p>
                    <p className="text-sm">Use the form to create your first record.</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {certificates?.map((cert) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={cert.id}
                        className="p-5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 transition-colors group relative overflow-hidden"
                      >
                        {/* Subtle decorative gradient */}
                        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-3 relative z-10">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{cert.studentName}</h3>
                            <p className="text-muted-foreground text-sm">{cert.courseName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">Issued</div>
                            <div className="text-sm font-medium">
                              {cert.issueDate ? format(new Date(cert.issueDate), "MMM d, yyyy") : "Unknown"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between group/hash">
                          <div className="flex-1 overflow-hidden mr-4">
                            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Certificate Hash</div>
                            <div className="font-mono text-sm text-primary/80 truncate">
                              {cert.certificateHash}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-white"
                            onClick={() => copyToClipboard(cert.certificateHash)}
                          >
                            {copiedHash === cert.certificateHash ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
