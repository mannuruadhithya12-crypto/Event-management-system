
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
    getAll: () => api.get<any[]>('/webinars'),
    getById: (id: string) => api.get<any>(`/webinars/${id}`),
    create: (data: any) => api.post<any>('/webinars', data),
    getByCollege: (collegeId: string) => api.get<any[]>(`/webinars/college/${collegeId}`),
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
    getRegistered: (userId: string) => api.get<any[]>(`/student/hackathons/registered?userId=${userId}`),
    getCompleted: (userId: string) => api.get<any[]>(`/student/hackathons/completed?userId=${userId}`),
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
    submit: (eventId: string, data: { userId: string; rating: number; comment: string; suggestions?: string }) => api.post<any>(`/feedback/events/${eventId}`, data),
    getByEvent: (eventId: string) => api.get<any[]>(`/feedback/events/${eventId}`),
    getAverage: (eventId: string) => api.get<number>(`/feedback/events/${eventId}/average`),
};
