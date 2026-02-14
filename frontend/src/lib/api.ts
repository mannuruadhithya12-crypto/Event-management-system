import type { Webinar, WebinarRegistration } from '@/types';

const BASE_URL = '/api'; // Relative path to use proxy

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Get token from localStorage
    let token = null;
    try {
        const storageItem = localStorage.getItem('auth-storage');
        if (storageItem) {
            const parsed = JSON.parse(storageItem);
            token = parsed.state?.token;
        }
    } catch (e) {
        console.error('Error parsing auth token:', e);
    }

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMessage = `API Error: ${response.status}`;

        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorText || errorMessage;
        } catch (e) {
            errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: 'DELETE' }),
    getBlob: async (endpoint: string): Promise<Blob> => {
        let token = null;
        try {
            const storageItem = localStorage.getItem('auth-storage');
            if (storageItem) {
                const parsed = JSON.parse(storageItem);
                token = parsed.state?.token;
            }
        } catch (e) {
            console.error('Error parsing auth token:', e);
        }

        const headers: any = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return response.blob();
    },
};

export const clubApi = {
    getAll: () => api.get<any[]>('/clubs'),
    getById: (id: string) => api.get<any>(`/clubs/${id}`),
    create: (data: any) => api.post<any>('/clubs', data),
    getAnnouncements: (id: string) => api.get<any[]>(`/clubs/${id}/announcements`),
    createAnnouncement: (id: string, authorId: string, title: string, content: string) =>
        api.post<any>(`/clubs/${id}/announcements?authorId=${authorId}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`, {}),
    getMembers: (id: string) => api.get<any[]>(`/clubs/${id}/members`),
    getRecruitments: (id: string) => api.get<any[]>(`/clubs/${id}/recruitments`),
    getAllOpenRecruitments: () => api.get<any[]>('/clubs/recruitments/open'),
    createRecruitment: (id: string, data: { title: string; description: string; role: string; requirements: string; deadline: string }) =>
        api.post<any>(`/clubs/${id}/recruitments?title=${encodeURIComponent(data.title)}&description=${encodeURIComponent(data.description)}&role=${encodeURIComponent(data.role)}&requirements=${encodeURIComponent(data.requirements)}&deadline=${data.deadline}`, {}),
    submitJoinRequest: (id: string, userId: string, message: string) =>
        api.post<any>(`/clubs/${id}/join-requests?userId=${userId}`, message),
    getJoinRequests: (id: string) => api.get<any[]>(`/clubs/${id}/join-requests`),
    updateJoinRequestStatus: (requestId: string, status: string) =>
        api.put<any>(`/clubs/join-requests/${requestId}/status?status=${status}`, {}),
    getEvents: (id: string) => api.get<any[]>(`/clubs/${id}/events`),
    getHackathons: (id: string) => api.get<any[]>(`/clubs/${id}/hackathons`),
    getResources: (id: string) => api.get<any[]>(`/clubs/${id}/resources`),
    getDiscussions: (id: string) => api.get<any[]>(`/clubs/${id}/discussions`),
    createDiscussion: (clubId: string, data: { authorId: string; title: string; content: string }) => api.post<any>(`/clubs/${clubId}/discussions`, data),
    getAnalytics: (id: string) => api.get<any>(`/clubs/${id}/analytics`),
};

export const eventTeamApi = {
    getAll: (eventId: string) => api.get<any[]>(`/events/${eventId}/team`),
    addMember: (eventId: string, data: { userId: string; role: string }) => api.post<any>(`/events/${eventId}/team`, data),
    removeMember: (eventId: string, userId: string) => api.delete<any>(`/events/${eventId}/team/${userId}`),
};
export const webinarApi = {
    getAll: (userId?: string) => api.get<Webinar[]>(`/webinars${userId ? `?userId=${userId}` : ''}`),
    getById: (id: string, userId?: string) => api.get<Webinar>(`/webinars/${id}${userId ? `?userId=${userId}` : ''}`),
    create: (userId: string, data: any) => api.post<Webinar>(`/webinars/create?userId=${userId}`, data),
    update: (id: string, data: any) => api.put<Webinar>(`/webinars/${id}/update`, data),
    cancel: (id: string) => api.post<void>(`/webinars/${id}/cancel`, {}),
    delete: (id: string) => api.delete<void>(`/webinars/${id}/delete`),
    register: (id: string, userId: string) => api.post<void>(`/webinars/${id}/register?userId=${userId}`, {}),
    join: (id: string, userId: string) => api.post<{ url: string }>(`/webinars/${id}/join?userId=${userId}`, {}),
    getMyRegistrations: (userId: string) => api.get<WebinarRegistration[]>(`/webinars/student/my?userId=${userId}`),
    submitFeedback: (id: string, userId: string, data: { rating: number; comment: string }) =>
        api.post<void>(`/webinars/${id}/feedback?userId=${userId}`, data),
    generateCertificate: (id: string, userId: string) => api.post<{ url: string }>(`/webinars/${id}/certificate?userId=${userId}`, {}),
    getAnalytics: () => api.get<any>('/webinars/analytics'),
    seed: () => api.post<any>('/webinars/seed', {}),
};

export const analyticsApi = {
    getStudentStats: (userId: string) => api.get<any>(`/analytics/student/${userId}`),
    getCollegeRankings: () => api.get<any[]>('/analytics/rankings/colleges'),
};

export const submissionApi = {
    submit: (data: any) => api.post<any>('/submissions', data),
    getById: (id: string) => api.get<any>(`/submissions/${id}`),
    getByHackathon: (id: string) => api.get<any[]>(`/submissions/hackathon/${id}`),
    update: (id: string, data: any) => api.put<any>(`/submissions/${id}`, data),
};

export const hackathonApi = {
    getAll: () => api.get<any[]>('/hackathons'),
    getById: (id: string) => api.get<any>(`/hackathons/${id}`),
    create: (data: any) => api.post<any>('/hackathons', data),
    getProblemStatements: (id: string) => api.get<any[]>(`/hackathons/${id}/problem-statements`),
    addProblemStatement: (id: string, data: any) => api.post<any>(`/hackathons/${id}/problem-statements`, data),
    createTeam: (id: string, name: string, leaderId: string) => api.post<any>(`/hackathons/${id}/teams`, { name, leaderId }),
    joinTeam: (id: string, userId: string, joinCode: string) => api.post<any>(`/hackathons/${id}/teams/join`, { userId, joinCode }),
    getMyTeam: (id: string, userId: string) => api.get<any>(`/hackathons/${id}/my-team?userId=${userId}`),
    getTeamMembers: (teamId: string) => api.get<any[]>(`/hackathons/teams/${teamId}/members`),
    getResults: (id: string) => api.get<any[]>(`/hackathons/${id}/results`),
    getRegistered: (userId: string) => api.get<any[]>(`/hackathons/student/${userId}/registered`),
    getCompleted: (userId: string) => api.get<any[]>(`/hackathons/student/${userId}/completed`),
    getRecommendations: (userId: string) => api.get<any[]>(`/hackathons/recommendations/${userId}`),

    // New Endpoints
    filter: (params: any) => {
        const query = new URLSearchParams(params).toString();
        return api.get<any[]>(`/hackathons/filter?${query}`);
    },
    bookmark: (id: string, userId: string) => api.post<any>(`/hackathons/${id}/bookmark?userId=${userId}`, {}),
    getBookmarks: (userId: string) => api.get<any[]>(`/hackathons/bookmarks?userId=${userId}`),
    seed: () => api.post<any>('/hackathons/seed', {}),
};

export const certificateApi = {
    getUserCertificates: (userId: string) => api.get<any[]>(`/certificates/user/${userId}`),
    download: (id: string) => api.getBlob(`/certificates/${id}/download`),
    verify: (number: string) => api.get<{ verified: boolean }>(`/certificates/verify/${number}`),
};

export const notificationApi = {
    getByUser: (userId: string) => api.get<any[]>(`/notifications/user/${userId}`),
    getUnreadCount: (userId: string) => api.get<number>(`/notifications/user/${userId}/unread-count`),
    markAsRead: (id: string) => api.put<void>(`/notifications/${id}/read`, {}),
    markAllAsRead: (userId: string) => api.put<void>(`/notifications/user/${userId}/read-all`, {}),
};

export const chatApi = {
    getRoom: (type: string, targetId: string, name: string) => api.get<any>(`/chat/rooms/${type}/${targetId}?name=${encodeURIComponent(name)}`),
    getMessages: (roomId: string) => api.get<any[]>(`/chat/messages/${roomId}`),
};

export const forumApi = {
    getPosts: () => api.get<any[]>('/forum/posts'),
    getPost: (id: string) => api.get<any>(`/forum/posts/${id}`),
    createPost: (authorId: string, title: string, content: string, category: string) => api.post<any>('/forum/posts', { authorId, title, content, category }),
    upvotePost: (id: string) => api.post<any>(`/forum/posts/${id}/upvote`, {}),
    downvotePost: (id: string) => api.post<any>(`/forum/posts/${id}/downvote`, {}),
    addComment: (id: string, authorId: string, content: string) => api.post<any>(`/forum/posts/${id}/comments`, { authorId, content }),
    getComments: (id: string) => api.get<any[]>(`/forum/posts/${id}/comments`),
};

export const activityApi = {
    getByUser: (userId: string) => api.get<any[]>(`/activities/user/${userId}`),
    getAll: () => Promise.resolve([]),
};

export const complaintApi = {
    submit: (data: { userId: string; type: string; subject: string; description: string }) => api.post<any>('/complaints', data),
    getByUser: (userId: string) => api.get<any[]>(`/complaints/user/${userId}`),
    getAll: () => api.get<any[]>('/complaints'),
    updateStatus: (id: string, data: { status: string; adminAction: string }) => api.patch<any>(`/complaints/${id}/status`, data),
};

export const feedbackApi = {
    submit: (data: { eventId: string; userId: string; rating: number; comment: string; suggestions?: string }) => api.post<any>('/feedback/event', data),
    getByEvent: (eventId: string) => api.get<any[]>(`/feedback/event/${eventId}`),
};

export const studentTeamApi = {
    getMyTeams: (userId: string) => api.get<any[]>(`/student/teams?userId=${userId}`),
    getTeam: (id: string) => api.get<any>(`/student/team/${id}`),
    createTeam: (userId: string, data: any) => api.post<any>(`/student/team/create?userId=${userId}`, data),
    getInvites: (userId: string) => api.get<any[]>(`/student/team/invites?userId=${userId}`),
    inviteMember: (id: string, email: string) => api.post<any>(`/student/team/${id}/invite`, { email }),
    acceptInvite: (id: string, userId: string) => api.post<any>(`/student/team/${id}/accept?userId=${userId}`, {}),
    leaveTeam: (id: string, userId: string) => api.post<any>(`/student/team/${id}/leave?userId=${userId}`, {}),
    submitProject: (id: string, data: any) => api.post<any>(`/student/team/${id}/submit`, data),
    chat: (id: string, userId: string, content: string, type: string = 'TEXT') =>
        api.post<any>(`/student/team/${id}/chat?userId=${userId}`, { content, type }),
};
