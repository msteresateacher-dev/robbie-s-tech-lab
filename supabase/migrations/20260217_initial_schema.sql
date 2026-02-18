-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT NOT NULL,
  avatar_url TEXT,
  grade_level TEXT,
  missions_completed INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_email ON students(email);

-- ============================================
-- MISSION SESSIONS TABLE
-- ============================================
CREATE TABLE mission_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  mission_name TEXT NOT NULL,
  mission_type TEXT,
  score INTEGER,
  max_score INTEGER,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER,
  attempts INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX idx_mission_sessions_student_id ON mission_sessions(student_id);
CREATE INDEX idx_mission_sessions_completed ON mission_sessions(completed);
CREATE INDEX idx_mission_sessions_created_at ON mission_sessions(created_at DESC);
CREATE INDEX idx_mission_sessions_mission_name ON mission_sessions(mission_name);

-- ============================================
-- USER LOGS TABLE (for analytics)
-- ============================================
CREATE TABLE user_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  page_name TEXT NOT NULL,
  action TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_user_logs_student_id ON user_logs(student_id);
CREATE INDEX idx_user_logs_created_at ON user_logs(created_at DESC);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to auto-update updated_at
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mission_sessions_updated_at
  BEFORE UPDATE ON mission_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Users can view their own student record"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own student record"
  ON students FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student record"
  ON students FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Teachers can view all students (assuming you'll add a role system later)
CREATE POLICY "Public can view all students"
  ON students FOR SELECT
  USING (true);

-- Mission sessions policies
CREATE POLICY "Users can view their own mission sessions"
  ON mission_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = mission_sessions.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own mission sessions"
  ON mission_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = mission_sessions.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own mission sessions"
  ON mission_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = mission_sessions.student_id
      AND students.user_id = auth.uid()
    )
  );

-- Public can view all mission sessions (for teacher dashboard)
CREATE POLICY "Public can view all mission sessions"
  ON mission_sessions FOR SELECT
  USING (true);

-- User logs policies
CREATE POLICY "Users can insert their own logs"
  ON user_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = user_logs.student_id
      AND students.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own logs"
  ON user_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = user_logs.student_id
      AND students.user_id = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get student stats
CREATE OR REPLACE FUNCTION get_student_stats(student_uuid UUID)
RETURNS TABLE (
  total_missions INTEGER,
  completed_missions INTEGER,
  total_points INTEGER,
  average_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_missions,
    COUNT(*) FILTER (WHERE completed = true)::INTEGER as completed_missions,
    COALESCE(SUM(score), 0)::INTEGER as total_points,
    COALESCE(AVG(score) FILTER (WHERE score IS NOT NULL), 0) as average_score
  FROM mission_sessions
  WHERE student_id = student_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  student_id UUID,
  student_name TEXT,
  total_points INTEGER,
  missions_completed INTEGER,
  rank INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.name,
    s.total_points,
    s.missions_completed,
    ROW_NUMBER() OVER (ORDER BY s.total_points DESC, s.missions_completed DESC)::INTEGER as rank
  FROM students s
  ORDER BY s.total_points DESC, s.missions_completed DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
