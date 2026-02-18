import { supabase } from './supabaseClient';

// ============================================
// STUDENTS SERVICE
// ============================================

export const studentService = {
    async list() {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async get(id) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getByUserId(userId) {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return data;
    },

    async create(studentData) {
        const { data, error } = await supabase
            .from('students')
            .insert([studentData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    async getStats(studentId) {
        const { data, error } = await supabase
            .rpc('get_student_stats', { student_uuid: studentId });
        if (error) throw error;
        return data;
    },
};

// ============================================
// MISSION SESSIONS SERVICE
// ============================================

export const missionSessionService = {
    async list(limit = 100) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .select('*, students(name, email)')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    async get(id) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .select('*, students(name, email)')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getByStudent(studentId) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getCompletedByStudent(studentId) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .select('*')
            .eq('student_id', studentId)
            .eq('completed', true)
            .order('completed_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async create(sessionData) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .insert([sessionData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('mission_sessions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async markCompleted(id, score = null) {
        const updates = {
            completed: true,
            completed_at: new Date().toISOString(),
        };
        if (score !== null) {
            updates.score = score;
        }

        const { data, error } = await supabase
            .from('mission_sessions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('mission_sessions')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },
};

// ============================================
// USER LOGS SERVICE
// ============================================

export const userLogService = {
    async log(studentId, pageName, action = null, metadata = null) {
        try {
            const { error } = await supabase
                .from('user_logs')
                .insert([
                    {
                        student_id: studentId,
                        page_name: pageName,
                        action,
                        metadata,
                    },
                ]);
            if (error) console.error('Logging error:', error);
        } catch (err) {
            // Silent fail for logging
            console.error('Failed to log user activity:', err);
        }
    },

    async getByStudent(studentId, limit = 100) {
        const { data, error } = await supabase
            .from('user_logs')
            .select('*')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },

    async getRecentActivity(limit = 50) {
        const { data, error } = await supabase
            .from('user_logs')
            .select('*, students(name, email)')
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data;
    },
};

// ============================================
// LEADERBOARD SERVICE
// ============================================

export const leaderboardService = {
    async getTop(limit = 10) {
        const { data, error } = await supabase
            .rpc('get_leaderboard', { limit_count: limit });
        if (error) throw error;
        return data;
    },
};
