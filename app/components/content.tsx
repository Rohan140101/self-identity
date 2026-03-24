"use client";
import { useRouter } from "next/navigation";

const Content = function () {
  const router = useRouter();
 
  return (
    <section className="bg-slate-50 py-16 px-6">
 
      <div className="max-w-3xl mx-auto text-center mb-14">
        {/* <h2 className="text-3xl font-bold text-(--brand-dark) mb-6">
          The Science of Self-Identity
        </h2> */}
        <p className="text-lg text-slate-800 leading-relaxed mb-4 font-semibold">
          Self-identity refers to how we define and perceive ourselves, encompassing our beliefs, values, personality traits and characteristics which make us unique.
        </p>
        <p className="text-lg text-slate-800 leading-relaxed font-semibold">
          We have prepared a test to help you uncover the real nature of your personal self-identity. Learn what aspects of your personal identity are most important to who you are, and what this means for your happiness and well-being.
        </p>
      </div>
 
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
 
        {/* <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <h3 className="font-bold text-(--brand-dark) text-lg">Scientifically Designed</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Developed by psychologists using proven research on personality and behavior.
          </p>
        </div> */}
 
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3 className="font-bold text-(--brand-dark) text-lg">Quick &amp; Insightful</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Complete in just 3 minutes and receive a personalized identity profile.
          </p>
        </div>
 
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 className="font-bold text-(--brand-dark) text-lg">Private &amp; Secure</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your answers are fully confidential and your results are private.
          </p>
        </div>
 
      </div>
    </section>
  );
};
 
export default Content;