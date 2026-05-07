"use client";
import { useRouter } from "next/navigation";


// Content Present under the images
const Content = function () {
  const router = useRouter();
 
  return (
    <section className="bg-(--brand-dark) py-16 px-6">
 
      <div className="max-w-3xl mx-auto text-center mb-14">

        <p className="text-lg text-slate-200 leading-relaxed mb-4 font-semibold">
          Self-identity refers to how we define and perceive ourselves, encompassing our beliefs, values, personality traits and characteristics which make us unique.
        </p>
        <p className="text-lg text-slate-200 leading-relaxed font-semibold">
          We have prepared a test to help you uncover the real nature of your personal self-identity. Learn what aspects of your personal identity are most important to who you are, and what this means for your happiness and well-being.
        </p>
      </div>
 
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
 

 
      </div>
    </section>
  );
};
 
export default Content;