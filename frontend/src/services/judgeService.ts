import { api } from '@/lib/api';

export interface JudgeStats {
    assignedEvents: number;
    pendingEvaluations: number;
    completedEvaluations: number;
}

export interface EvaluationPayload {
    criteriaScores: string; // JSON string
    totalScore: number;
    feedback: string;
    isDraft: boolean;
}

export const judgeService = {
    getDashboardStats: async () => {
        return await api.get<JudgeStats>('/judge/dashboard/stats');
    },

    getAssignedEvents: async () => {
        return await api.get<any[]>('/judge/events');
    },

    getEventSubmissions: async (eventId: string) => {
        return await api.get<any[]>(`/submissions/event/${eventId}`);
    },

    submitEvaluation: async (submissionId: string, payload: EvaluationPayload) => {
        return await api.post<any>(`/evaluation/submit/${submissionId}`, payload);
    },

    getSubmissionScore: async (submissionId: string) => {
        return await api.get<any>(`/evaluation/submission/${submissionId}`);
    },

    lockEventScores: async (eventId: string) => {
        return await api.put<any>(`/evaluation/lock/${eventId}`, {});
    },

    getLockStatus: async (eventId: string) => {
        return await api.get<boolean>(`/evaluation/lock/${eventId}/status`);
    },

    getRubric: async (eventId: string) => {
        return await api.get<any[]>(`/evaluation/rubric/${eventId}`);
    },

    getPendingEvaluations: async (eventId: string) => {
        return await api.get<any[]>(`/evaluation/pending/${eventId}`);
    },

    getPendingSummary: async () => {
        return await api.get<any[]>('/evaluation/pending-summary');
    },

    getAvailableJudges: async () => {
        return await api.get<any[]>('/evaluation/judges');
    },

    assignJudgeToEvent: async (eventId: string, judgeId: string) => {
        return await api.post<any>(`/evaluation/assign/${eventId}?judgeId=${judgeId}`, {});
    },

    getLeaderboard: async (eventId: string) => {
        return await api.get<any[]>(`/evaluation/leaderboard/${eventId}`);
    }
};
