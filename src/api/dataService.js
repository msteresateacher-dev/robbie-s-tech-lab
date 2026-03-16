import { base44 } from '@/api/base44Client';

// ============================================
// STUDENTS SERVICE
// ============================================

export const studentService = {
    async list() {
        return base44.entities.Student.list('-created_date', 100);
    },

    async get(id) {
        return base44.entities.Student.filter({ id }).then(r => r[0]);
    },

    async getByUserId(userId) {
        const results = await base44.entities.Student.filter({ created_by: userId });
        return results[0] || null;
    },

    async create(studentData) {
        return base44.entities.Student.create(studentData);
    },

    async update(id, updates) {
        return base44.entities.Student.update(id, updates);
    },

    async delete(id) {
        return base44.entities.Student.delete(id);
    },

    async getStats(studentId) {
        const sessions = await missionSessionService.getByStudent(studentId);
        const completed = sessions.filter(s => s.completed).length;
        const totalHints = sessions.reduce((acc, s) => acc + (s.hints_used || 0), 0);
        return { completed, totalHints };
    },
};

// ============================================
// MISSION SESSIONS SERVICE
// ============================================

export const missionSessionService = {
    async list(limit = 100) {
        return base44.entities.MissionSession.list('-created_date', limit);
    },

    async get(id) {
        const results = await base44.entities.MissionSession.filter({ id });
        return results[0];
    },

    async getByStudent(studentId) {
        return base44.entities.MissionSession.filter({ student_id: studentId }, '-created_date');
    },

    async getCompletedByStudent(studentId) {
        return base44.entities.MissionSession.filter({ student_id: studentId, completed: true }, '-created_date');
    },

    async create(sessionData) {
        return base44.entities.MissionSession.create(sessionData);
    },

    async update(id, updates) {
        return base44.entities.MissionSession.update(id, updates);
    },

    async markCompleted(id, score = null) {
        const updates = { completed: true };
        if (score !== null) updates.score = score;
        return base44.entities.MissionSession.update(id, updates);
    },

    async delete(id) {
        return base44.entities.MissionSession.delete(id);
    },
};

// ============================================
// USER LOGS SERVICE (no-op stub)
// ============================================

export const userLogService = {
    async log(studentId, pageName, action = null, metadata = null) {
        // Logging not required with Base44 — no-op
    },
    async getByStudent() { return []; },
    async getRecentActivity() { return []; },
};

// ============================================
// LEADERBOARD SERVICE
// ============================================

export const leaderboardService = {
    async getTop(limit = 10) {
        const students = await base44.entities.Student.list('-missions_completed', limit);
        return students;
    },
};