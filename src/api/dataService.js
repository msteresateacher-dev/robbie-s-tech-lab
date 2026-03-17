import { base44 } from '@/api/base44Client';

const Students = base44.entities.Student;
const MissionSessions = base44.entities.MissionSession;

// ============================================
// STUDENTS SERVICE
// ============================================

export const studentService = {
    async list() {
        return Students.list('-created_date');
    },

    async get(id) {
        return Students.get(id);
    },

    async getByUserId(userId) {
        const results = await Students.filter({ created_by: userId });
        return results[0] || null;
    },

    async create(studentData) {
        return Students.create(studentData);
    },

    async update(id, updates) {
        return Students.update(id, updates);
    },

    async delete(id) {
        return Students.delete(id);
    },

    async getStats(studentId) {
        const student = await Students.get(studentId);
        return {
            missions_completed: student?.missions_completed || 0,
            total_hints_used: student?.total_hints_used || 0,
        };
    },
};

// ============================================
// MISSION SESSIONS SERVICE
// ============================================

export const missionSessionService = {
    async list(limit = 100) {
        return MissionSessions.list('-created_date', limit);
    },

    async get(id) {
        return MissionSessions.get(id);
    },

    async getByStudent(studentId) {
        return MissionSessions.filter({ student_id: studentId }, '-created_date');
    },

    async getCompletedByStudent(studentId) {
        return MissionSessions.filter({ student_id: studentId, completed: true }, '-created_date');
    },

    async create(sessionData) {
        return MissionSessions.create(sessionData);
    },

    async update(id, updates) {
        return MissionSessions.update(id, updates);
    },

    async markCompleted(id, score = null) {
        const updates = { completed: true };
        if (score !== null) updates.score = score;
        return MissionSessions.update(id, updates);
    },

    async delete(id) {
        return MissionSessions.delete(id);
    },
};

// ============================================
// USER LOGS SERVICE (silent no-op — Base44 tracks analytics natively)
// ============================================

export const userLogService = {
    async log(studentId, pageName, action = null, metadata = null) {
        // No-op: use base44.analytics.track() for event tracking if needed
    },

    async getByStudent(studentId, limit = 100) {
        return [];
    },

    async getRecentActivity(limit = 50) {
        return [];
    },
};

// ============================================
// LEADERBOARD SERVICE
// ============================================

export const leaderboardService = {
    async getTop(limit = 10) {
        const students = await Students.list('-missions_completed', limit);
        return students.map(s => ({
            id: s.id,
            name: s.name,
            missions_completed: s.missions_completed || 0,
            total_hints_used: s.total_hints_used || 0,
        }));
    },
};