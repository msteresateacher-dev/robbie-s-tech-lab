import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Home, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobbieFace from '@/components/RobbieFace';
import SpeechBubble from '@/components/SpeechBubble';
import WakeUpRobbie, { wakeUpRobbieConfig } from '@/components/missions/WakeUpRobbie';
import HardwareAnatomy, { hardwareAnatomyConfig } from '@/components/missions/HardwareAnatomy';
import InputOutput, { inputOutputConfig } from '@/components/missions/InputOutput';
import RobbiesRace, { robbiesRaceConfig } from '@/components/missions/RobbiesRace';

const MISSION_CONFIGS = {
  wake_up_robbie: {
    title: 'Wake Up Robbie',
    component: WakeUpRobbie,
    config: wakeUpRobbieConfig
  },
  hardware_anatomy: {
    title: 'Hardware Anatomy',
    component: HardwareAnatomy,
    config: hardwareAnatomyConfig
  },
  input_output: {
    title: 'Input & Output',
    component: InputOutput,
    config: inputOutputConfig
  },
  robbies_race: {
    title: 'Robbie\'s Big Race',
    component: RobbiesRace,
    config: robbiesRaceConfig
  }
};

export default function Mission() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId');
  const missionId = urlParams.get('missionId') || 'wake_up_robbie';
  
  const missionData = MISSION_CONFIGS[missionId];
  const MissionComponent = missionData?.component;
  const missionConfig = missionData?.config;
  
  const [currentPhase, setCurrentPhase] = useState('playing');
  const [robbieEmotion, setRobbieEmotion] = useState(missionConfig?.emotion || 'happy');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const startTimeRef = useRef(Date.now());

  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const students = await base44.entities.Student.filter({ id: studentId });
      return students[0];
    },
    enabled: !!studentId
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Student.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['student', studentId])
  });

  const createSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.MissionSession.create(data)
  });

  const handleNeedHint = () => {
    if (missionConfig?.hints && hintsUsed < missionConfig.hints.length) {
      setCurrentHint(missionConfig.hints[hintsUsed]);
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setRobbieEmotion('encouraging');
      
      setTimeout(() => {
        setShowHint(false);
        setRobbieEmotion(missionConfig?.emotion || 'happy');
      }, 5000);
    }
  };

  const handleAttempt = () => {
    setAttempts(prev => prev + 1);
  };

  const handleComplete = async () => {
    setCurrentPhase('complete');
    setRobbieEmotion('excited');

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    // Create session record
    await createSessionMutation.mutateAsync({
      student_id: studentId,
      student_name: student?.name,
      mission_name: missionData?.title || 'Mission',
      completed: true,
      hints_used: hintsUsed,
      time_spent_seconds: timeSpent,
      struggles: hintsUsed > 1 ? [missionId] : []
    });

    // Update student stats
    if (student) {
      await updateStudentMutation.mutateAsync({
        id: studentId,
        data: {
          missions_completed: (student.missions_completed || 0) + 1,
          total_hints_used: (student.total_hints_used || 0) + hintsUsed
        }
      });
    }
  };

  const handleGoHome = () => {
    navigate(createPageUrl('MissionSelect') + `?studentId=${studentId}`);
  };

  if (!MissionComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Mission not found</p>
          <Button onClick={handleGoHome} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sky-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('StudentPortal')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800">{missionData?.title}</h1>
            <p className="text-sm text-gray-500">{student?.name}'s Mission</p>
          </div>
          {currentPhase === 'playing' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNeedHint}
              disabled={hintsUsed >= (missionConfig?.hints?.length || 0)}
              className="rounded-full text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
            >
              <Lightbulb className="w-5 h-5" />
            </Button>
          )}
          {currentPhase !== 'playing' && <div className="w-10" />}
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Robbie */}
        <motion.div 
          className="flex flex-col items-center mb-6"
          layout
        >
          <RobbieFace
            emotion={robbieEmotion}
            speaking={isSpeaking}
            size="medium"
          />
        </motion.div>

        {/* Mission Component */}
        <AnimatePresence mode="wait">
          {currentPhase === 'playing' && MissionComponent && (
            <motion.div
              key="mission"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <MissionComponent
                onComplete={handleComplete}
                onNeedHint={handleNeedHint}
                onAttempt={handleAttempt}
                currentHint={currentHint}
                showHint={showHint}
              />
            </motion.div>
          )}

          {currentPhase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6">
                <SpeechBubble
                  message={`Amazing work, ${student?.name}! You're a tech superstar! 🌟`}
                  visible={true}
                  onSpeakStart={() => setIsSpeaking(true)}
                  onSpeakEnd={() => setIsSpeaking(false)}
                />
              </div>
              {/* Celebration */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mission Complete!</h2>
                <p className="text-gray-600 mb-4">
                  You helped Robbie learn about sequencing!
                </p>
                <div className="flex justify-center gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-orange-500">{attempts}</div>
                    <div className="text-sm text-gray-500">Tries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-500">{hintsUsed}</div>
                    <div className="text-sm text-gray-500">Hints</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-500">
                      {Math.max(0, 5 - hintsUsed)}
                    </div>
                    <div className="text-sm text-gray-500">Stars</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1 h-14 px-6 text-lg rounded-2xl border-2"
                >
                  More Missions
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 h-14 px-6 text-lg rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500"
                >
                  Play Again!
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}