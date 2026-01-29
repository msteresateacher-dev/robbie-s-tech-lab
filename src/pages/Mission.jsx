import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Home, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RobbieFace from '@/components/RobbieFace';
import SpeechBubble from '@/components/SpeechBubble';
import DragDropSequence from '@/components/DragDropSequence';
import ProgressBar from '@/components/ProgressBar';

const MISSION_STEPS = [
  { id: 'wake', emoji: '☀️', label: 'Open your eyes' },
  { id: 'stretch', emoji: '🙆', label: 'Stretch your arms' },
  { id: 'brush', emoji: '🪥', label: 'Brush your teeth' },
  { id: 'dress', emoji: '👕', label: 'Get dressed' },
  { id: 'eat', emoji: '🥣', label: 'Eat breakfast' }
];

const CORRECT_ORDER = ['wake', 'stretch', 'brush', 'dress', 'eat'];

const HINTS = [
  "Hmm, what do you do first thing when you wake up? I bet it starts with your eyes!",
  "Think about what happens in the morning. First we wake up, then we stretch our sleepy arms!",
  "Oops! Let me help. We open our eyes first, stretch, brush teeth, get dressed, then eat breakfast!"
];

const INTRO_MESSAGES = [
  { text: "Oh no! I forgot how to start my morning!", emotion: 'surprised' },
  { text: "Can you help me put these steps in the right order?", emotion: 'encouraging' },
  { text: "This is called SEQUENCING - putting things in the right order. Just like computers do!", emotion: 'excited' }
];

export default function Mission() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId');
  
  const [currentPhase, setCurrentPhase] = useState('intro'); // intro, playing, complete
  const [introIndex, setIntroIndex] = useState(0);
  const [robbieEmotion, setRobbieEmotion] = useState('sleepy');
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

  // Intro sequence
  useEffect(() => {
    if (currentPhase === 'intro' && introIndex < INTRO_MESSAGES.length) {
      setRobbieEmotion(INTRO_MESSAGES[introIndex].emotion);
    }
  }, [introIndex, currentPhase]);

  const advanceIntro = () => {
    if (introIndex < INTRO_MESSAGES.length - 1) {
      setIntroIndex(prev => prev + 1);
    } else {
      setCurrentPhase('playing');
      setRobbieEmotion('thinking');
    }
  };

  const handleNeedHint = () => {
    if (hintsUsed < HINTS.length) {
      setCurrentHint(HINTS[hintsUsed]);
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      setRobbieEmotion('encouraging');
      
      setTimeout(() => {
        setShowHint(false);
        setRobbieEmotion('thinking');
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
      mission_name: 'Wake Up Robbie',
      completed: true,
      hints_used: hintsUsed,
      time_spent_seconds: timeSpent,
      struggles: hintsUsed > 1 ? ['sequencing'] : []
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
    navigate(createPageUrl('Home'));
  };

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
            <h1 className="text-lg font-bold text-gray-800">Wake Up Robbie!</h1>
            <p className="text-sm text-gray-500">{student?.name}'s Mission</p>
          </div>
          {currentPhase === 'playing' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNeedHint}
              disabled={hintsUsed >= HINTS.length}
              className="rounded-full text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
            >
              <Lightbulb className="w-5 h-5" />
            </Button>
          )}
          {currentPhase !== 'playing' && <div className="w-10" />}
        </div>
      </header>

      <main className="px-4 py-6 max-w-2xl mx-auto">
        {/* Progress */}
        {currentPhase === 'playing' && (
          <div className="mb-6">
            <ProgressBar 
              currentStep={attempts > 0 ? 1 : 0} 
              totalSteps={1} 
              label="Mission Progress"
            />
          </div>
        )}

        {/* Robbie */}
        <motion.div 
          className="flex flex-col items-center"
          layout
        >
          <RobbieFace
            emotion={robbieEmotion}
            speaking={isSpeaking}
            size={currentPhase === 'playing' ? 'medium' : 'large'}
          />

          {/* Speech bubble */}
          <div className="mt-6 w-full">
            <AnimatePresence mode="wait">
              {currentPhase === 'intro' && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SpeechBubble
                    message={INTRO_MESSAGES[introIndex].text}
                    visible={true}
                    onSpeakStart={() => setIsSpeaking(true)}
                    onSpeakEnd={() => setIsSpeaking(false)}
                  />
                  <Button
                    onClick={advanceIntro}
                    className="w-full mt-4 h-14 text-lg rounded-2xl bg-sky-400 hover:bg-sky-500"
                  >
                    {introIndex < INTRO_MESSAGES.length - 1 ? 'Next' : "Let's Help Robbie!"}
                  </Button>
                </motion.div>
              )}

              {currentPhase === 'playing' && showHint && (
                <motion.div
                  key="hint"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SpeechBubble
                    message={currentHint}
                    visible={true}
                    onSpeakStart={() => setIsSpeaking(true)}
                    onSpeakEnd={() => setIsSpeaking(false)}
                  />
                </motion.div>
              )}

              {currentPhase === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <SpeechBubble
                    message={`Wow, ${student?.name}! You're a SEQUENCING superstar! Now I know how to start my day!`}
                    visible={true}
                    onSpeakStart={() => setIsSpeaking(true)}
                    onSpeakEnd={() => setIsSpeaking(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Game area */}
        <AnimatePresence>
          {currentPhase === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="mt-8"
            >
              <div className="text-center mb-4">
                <p className="text-gray-600 font-medium">
                  Drag the steps into the right order!
                </p>
              </div>
              <DragDropSequence
                steps={MISSION_STEPS}
                correctOrder={CORRECT_ORDER}
                onComplete={handleComplete}
                onAttempt={handleAttempt}
                onNeedHint={handleNeedHint}
              />
            </motion.div>
          )}

          {currentPhase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center"
            >
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

              <Button
                onClick={handleGoHome}
                className="mt-6 h-14 px-8 text-lg rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500"
              >
                <Home className="w-5 h-5 mr-2" />
                Back Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}