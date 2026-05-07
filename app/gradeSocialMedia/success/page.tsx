"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Reveal } from "@/app/components/Reveal";
export default function SuccessPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(()=> {
    if (timeLeft == 0) {
      router.push("/");
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000)

    return () => clearInterval(timerId)

  }, [timeLeft, router])

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 px-6">
    <Reveal delay={0.2}>
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
      
      <div 
        className="absolute top-0 left-0 h-1.5 bg-(--brand-hover) transition-all duration-1000 ease-linear"
        style={{ width: `${(timeLeft / 10) * 100}%` }}
      />

      <div className="mb-8">
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
          Thank You!
        </h1>
        
        <p className="text-slate-600 text-lg leading-relaxed italic">
           We appreciate you participating in our Social Media Test 
        Your insights help us understand the science of self-identity better.
        </p>
      </div>

      <div className="space-y-6">
        <div className="py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">
            Redirecting to Homepage in 
            <span className="text-(--brand-hover) font-bold ml-1">{timeLeft}s</span>
          </p>
        </div>

        <a 
          href="/" 
          className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-(--brand-hover) transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
        >
          Return Home Now
        </a>
      </div>
    </div>
    </Reveal>
    
  </div>
);
}