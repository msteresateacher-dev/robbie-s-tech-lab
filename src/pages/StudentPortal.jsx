import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StudentCard from '@/components/StudentCard';
import RobbieFace from '@/components/RobbieFace';
import SpeechBubble from '@/components/SpeechBubble';

const avatarColors = [
  'bg-pink-400', 'bg-purple-400', 'bg-blue-400', 'bg-green-400',
  'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-teal-400'
];

export default function StudentPortal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list()
  });

  const createStudentMutation = useMutation({
    mutationFn: (data) => base44.entities.Student.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      setNewStudentName('');
      setDialogOpen(false);
    }
  });

  const handleCreateStudent = () => {
    if (newStudentName.trim()) {
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
      createStudentMutation.mutate({
        name: newStudentName.trim(),
        avatar_color: randomColor,
        missions_completed: 0,
        total_hints_used: 0
      });
    }
  };

  const handleStartMission = () => {
    if (selectedStudent) {
      navigate(createPageUrl('MissionSelect') + `?studentId=${selectedStudent.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-sky-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Who's Learning Today?</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {/* Robbie greeting */}
        <div className="flex flex-col items-center mb-8">
          <RobbieFace 
            emotion={selectedStudent ? 'excited' : 'happy'} 
            speaking={isSpeaking}
            size="small"
          />
          <div className="mt-4 w-full">
            <SpeechBubble
              message={selectedStudent 
                ? `Hi ${selectedStudent.name}! Ready for an adventure?` 
                : "Pick your name to start learning!"}
              visible={true}
              onSpeakStart={() => setIsSpeaking(true)}
              onSpeakEnd={() => setIsSpeaking(false)}
            />
          </div>
        </div>

        {/* Student Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {students.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                selected={selectedStudent?.id === student.id}
                onClick={setSelectedStudent}
                showStats={true}
              />
            ))}

            {/* Add new student button */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-6 rounded-3xl border-4 border-dashed border-gray-300 hover:border-sky-400 transition-colors flex flex-col items-center justify-center min-h-[160px]"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <UserPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <span className="text-gray-500 font-medium">Add Student</span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl">New Friend!</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="What's your name?"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="text-xl h-14 rounded-xl text-center"
                    autoFocus
                  />
                  <Button
                    onClick={handleCreateStudent}
                    disabled={!newStudentName.trim() || createStudentMutation.isPending}
                    className="w-full h-14 text-xl rounded-xl bg-sky-400 hover:bg-sky-500"
                  >
                    {createStudentMutation.isPending ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-6 h-6 mr-2" />
                        Join the Fun!
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Start button */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-6 left-4 right-4 max-w-md mx-auto"
            >
              <Button
                onClick={handleStartMission}
                size="lg"
                className="w-full h-16 text-xl rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg shadow-green-200"
              >
                <span className="mr-2">🚀</span>
                Let's Go, {selectedStudent.name}!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}