'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PlannerForm from '@/components/planner/PlannerForm';
import { Recommendation } from '@/types';
import { usePlannerStore } from '@/lib/store';
import { StepIndicator } from '@/components/ui/StepIndicator';

export default function PlannerPage() {
  const router = useRouter();
  const { setBasicInfo, setRecommendations } = usePlannerStore();

  const handleSuccess = (data: Recommendation[], dest: string, start: string, end: string) => {
    try {
      setBasicInfo(dest, start, end);
      setRecommendations(data);
      // Use replace to prevent back-button loops in some edge cases
      router.push('/recommendations');
    } catch (err) {
      console.error('Navigation error:', err);
      alert('화면 이동 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleError = () => {
    // Errors are now handled via Toast in PlannerForm
  };

    return (

      <main className="page-container">

        {/* Dynamic Background Elements */}

        <motion.div 

          animate={{ 

            scale: [1, 1.1, 1], 

            x: [0, 30, 0], 

            y: [0, 50, 0],

            rotate: [0, 45, 0]

          }}

          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}

          className="bg-orb -top-48 -left-48 w-[600px] h-[600px] bg-blue-400/10 blur-[150px]"

        />

        <motion.div 

          animate={{ 

            scale: [1, 1.2, 1], 

            x: [0, -50, 0], 

            y: [0, -30, 0],

            rotate: [0, -30, 0]

          }}

          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}

          className="bg-orb bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-300/10 blur-[180px]"

        />

  

                    <div className="content-wrapper pt-4 pb-16 md:pt-8">

  

                      <div className="text-center space-y-8">

  

              

  

                  <motion.div 

  

                    initial={{ opacity: 0, y: 10 }}

  

                    animate={{ opacity: 1, y: 0 }}

  

                    className="flex justify-center mb-4"

  

                  >

  

                     <span className="px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">

  

                       Next-Gen Travel AI

  

                     </span>

  

                  </motion.div>

  

                  <motion.h1 

  

                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}

  

                    className="hero-title text-4xl md:text-7xl font-black tracking-tight"

  

                  >

  

                    기억에 남을 <br/>

  

                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400">여행의 첫 페이지</span>

  

                  </motion.h1>

  

                  <motion.p 

  

                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}

  

                    className="hero-description text-lg md:text-xl"

  

                  >

  

                    복잡한 계획은 AI에게 맡기세요. <br className="hidden md:block"/>

  

                    당신은 오직 그곳에서의 순간만을 기다리면 됩니다.

  

                  </motion.p>

  

                </div>

  

        

  

          <motion.div 

            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}

            className="relative"

          >

            {/* Decorative Elements for the Card */}

            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-sky-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>

            

            <div className="relative">

              <StepIndicator currentStep={1} />

              <div className="glass-card mt-8 ring-1 ring-white/20">

                <PlannerForm onSuccess={handleSuccess} onError={handleError} />

              </div>

            </div>

          </motion.div>

        </div>

      </main>

    );

  }

  