import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Activity,
  Key as KeyIcon
} from "lucide-react";
import { generateLicense } from "./lib/api";

export default function App() {
  const [loading, setLoading] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (prefix: string, days: number) => {
    setLoading(prefix || "default");
    setError(null);
    setToken(null);
    try {
      const result = await generateLicense(prefix, days);
      setToken(result.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 bg-navy-950">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <main className="w-full max-w-md z-10">
        <div className="premium-card p-10 flex flex-col items-center text-center">
          {/* Logo Section */}
          <div className="mb-8 relative">
            <div className="w-20 h-20 bg-navy-900 rounded-2xl flex items-center justify-center shadow-inner group overflow-hidden border border-white/5">
              <img 
                src="https://i.ibb.co/Kj03LFpP/0712025c-2dcc-4de3-bda3-bcdb796a7d1f.png" 
                alt="Logo" 
                className="w-full h-full object-cover relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -inset-2 bg-blue-500/20 blur-xl opacity-50 rounded-full"></div>
          </div>

          <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-200 mb-3 tracking-tight">Lisans Paneli</h2>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed px-2">
              Kullanım süresini belirleyin ve anahtar üretin. Süre dolduğunda anahtar geçersiz sayılacaktır.
            </p>

            <div className="space-y-6">
              {/* Duration Selection */}
              <div className="space-y-3 mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 text-left block">LİSANS SÜRESİ SEÇİN</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "7 GÜN", days: 7 },
                    { label: "1 AY", days: 30 },
                    { label: "1 YIL", days: 365 }
                  ].map((option) => (
                    <button
                      key={option.days}
                      onClick={() => setDuration(option.days)}
                      className={`py-3 rounded-xl border text-[10px] font-bold transition-all duration-300 ${
                        duration === option.days 
                        ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                        : "bg-slate-800/30 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-400"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {token ? (
                  <motion.div 
                    key="active-token"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">ÜRETİLEN ANAHTAR</label>
                    <div 
                      className="premium-input bg-blue-500/5 border-blue-500/20 text-blue-400 font-mono text-xl tracking-widest flex items-center justify-center gap-4 relative overflow-hidden group/token cursor-pointer" 
                      onClick={copyToClipboard}
                    >
                      <div className="absolute inset-0 bg-blue-500/5 animate-pulse opacity-0 group-hover/token:opacity-100 pointer-events-none"></div>
                      {token}
                      <div className="p-1.5 rounded-lg bg-blue-500/10">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 italic">Anahtar veritabanına kaydedildi.</p>
                  </motion.div>
                ) : (
                  <div className="h-16 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                    <KeyIcon className="w-6 h-6 text-slate-700" />
                  </div>
                )}
              </AnimatePresence>

              <button 
                onClick={() => {
                  const prefixes: Record<number, string> = { 7: "TRIAL", 30: "LITE", 365: "GOLD" };
                  handleGenerate(prefixes[duration], duration);
                }}
                disabled={!!loading}
                className="premium-button w-full flex items-center justify-center gap-3"
              >
                {loading ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                <span>LİSANS ANAHTARI ÜRET</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-10 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] opacity-50">
            SECURE ACCESS SYSTEM V2.0
          </p>
        </div>
      </main>

      {/* Error Messaging */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 px-6 py-4 rounded-2xl bg-red-950/20 border border-red-500/20 backdrop-blur-xl flex items-center gap-4 shadow-2xl z-50 max-w-md"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="text-[11px] text-red-200/80 font-medium leading-tight">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Elements for visual depth */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-blue-600/5 blur-[150px] -z-10 rounded-full"></div>
      <div className="fixed bottom-0 left-0 w-1/4 h-1/4 bg-purple-600/5 blur-[150px] -z-10 rounded-full"></div>
    </div>
  );
}
