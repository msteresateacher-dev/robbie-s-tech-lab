import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Users, Trophy, Lightbulb, Clock, 
  TrendingUp, AlertCircle, CheckCircle2, Loader2,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LanguageToggle from '@/components/LanguageToggle';
import { useLanguage } from '@/components/LanguageContext';
import { t } from '@/components/translations';

export default function TeacherDashboard() {
  const { language } = useLanguage();
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list()
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.MissionSession.list('-created_date', 100)
  });

  const isLoading = studentsLoading || sessionsLoading;

  // Calculate stats
  const totalStudents = students.length;
  const totalMissionsCompleted = sessions.filter(s => s.completed).length;
  const avgHintsPerSession = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + (s.hints_used || 0), 0) / sessions.length).toFixed(1)
    : 0;
  
  const studentsNeedingHelp = students.filter(s => (s.total_hints_used || 0) > 3);

  // Get recent activity
  const recentSessions = sessions.slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link to={createPageUrl('TeacherResources')}>
            <Button variant="outline" className="rounded-full">
              📚 {t('resourceCenter', language)}
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{t('teacherDashboard', language)}</h1>
          <LanguageToggle />
        </div>
      </header>

      <main className="px-4 py-6 max-w-6xl mx-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
                  <p className="text-sm text-gray-500">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalMissionsCompleted}</p>
                  <p className="text-sm text-gray-500">Missions Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{avgHintsPerSession}</p>
                  <p className="text-sm text-gray-500">Avg Hints</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{studentsNeedingHelp.length}</p>
                  <p className="text-sm text-gray-500">Need Support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="students" className="data-[state=active]:bg-sky-100">
              <Users className="w-4 h-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-sky-100">
              <BarChart3 className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-lg">Student Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {students.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No students yet. Have students start learning to see their progress!
                  </div>
                ) : (
                  <div className="divide-y">
                    {students.map(student => {
                      const studentSessions = sessions.filter(s => s.student_id === student.id);
                      const completedCount = studentSessions.filter(s => s.completed).length;
                      const totalHints = studentSessions.reduce((acc, s) => acc + (s.hints_used || 0), 0);
                      const needsHelp = totalHints > 3;

                      return (
                        <motion.div
                          key={student.id}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedStudent(
                            selectedStudent?.id === student.id ? null : student
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full ${student.avatar_color || 'bg-sky-400'} flex items-center justify-center text-white font-bold text-lg`}>
                                {student.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Trophy className="w-4 h-4 text-green-500" />
                                    {completedCount} missions
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                                    {totalHints} hints
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {needsHelp && (
                                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                                  Needs Support
                                </Badge>
                              )}
                              {completedCount > 0 && !needsHelp && (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  On Track
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Expanded details */}
                          {selectedStudent?.id === student.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 pt-4 border-t"
                            >
                              <h4 className="font-medium text-gray-700 mb-3">Recent Sessions</h4>
                              {studentSessions.length === 0 ? (
                                <p className="text-gray-500 text-sm">No sessions yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {studentSessions.slice(0, 5).map(session => (
                                    <div 
                                      key={session.id}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2">
                                        {session.completed ? (
                                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                          <Clock className="w-5 h-5 text-gray-400" />
                                        )}
                                        <span className="font-medium">{session.mission_name}</span>
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{session.hints_used || 0} hints</span>
                                        {session.time_spent_seconds && (
                                          <span>{Math.round(session.time_spent_seconds / 60)}m</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-0 shadow-md">
              <CardHeader className="border-b bg-gray-50">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentSessions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No activity yet. Sessions will appear here as students complete missions.
                  </div>
                ) : (
                  <div className="divide-y">
                    {recentSessions.map(session => (
                      <div key={session.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {session.completed ? (
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {session.student_name} - {session.mission_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.hints_used || 0} hints used
                              {session.struggles?.length > 0 && (
                                <span className="ml-2 text-orange-500">
                                  • Struggled with: {session.struggles.join(', ')}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(session.created_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}