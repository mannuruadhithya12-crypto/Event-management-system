
export const mockStudentEvents = [
    {
        id: "evt-001",
        title: "AI Workshop 2024",
        description: "Deep dive into generative AI models and applications.",
        bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        mode: "OFFLINE",
        location: "Auditorium A",
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 90000000).toISOString(),
        status: "REGISTRATION_OPEN",
        registrationStatus: "REGISTERED",
        certificateIssued: false,
        organizerName: "AI Club",
        collegeName: "Tech University",
        registeredCount: 45,
        capacity: 100
    },
    {
        id: "evt-002",
        title: "Web Dev Bootcamp",
        description: "Full stack development with React and Node.js.",
        bannerImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        mode: "ONLINE",
        location: "Zoom",
        startDate: new Date(Date.now() - 604800000).toISOString(), // Last week
        endDate: new Date(Date.now() - 601200000).toISOString(),
        status: "COMPLETED",
        registrationStatus: "ATTENDED",
        certificateIssued: true,
        organizerName: "Dev Guild",
        collegeName: "Tech University",
        registeredCount: 120,
        capacity: 200
    },
    {
        id: "evt-003",
        title: "Cybersecurity Summit",
        description: "Learn about the latest threats and defenses.",
        bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        mode: "OFFLINE",
        location: "Conference Hall B",
        startDate: new Date(Date.now() + 604800000).toISOString(), // Next week
        endDate: new Date(Date.now() + 608400000).toISOString(),
        status: "REGISTRATION_OPEN",
        registrationStatus: "REGISTERED",
        certificateIssued: false,
        organizerName: "Cyber Alliance",
        collegeName: "Tech University",
        registeredCount: 88,
        capacity: 150
    }
];

// Faculty Mock Data
export const mockFacultyData = {
    dashboardStats: {
        myEventsCount: 5,
        myHackathonsCount: 2,
        activeRegistrationsCount: 45,
        pendingApprovalsCount: 3,
        resourcesUploadedCount: 12,
        certificatesIssuedCount: 28,
        studentParticipationCount: 45,
        eventRegistrationGrowth: 24.5,
        contentDownloadGrowth: 18.2,
        hackathonTeamGrowth: 42.0,
        recentEventRegistrations: 8,
        recentSubmissions: 5,
        recentFeedback: 12
    },

    events: {
        content: [
            {
                id: '1',
                title: 'Tech Talk: AI in Education',
                description: 'An insightful session on AI applications in modern education',
                organizerId: 'faculty-1',
                status: 'UPCOMING',
                eventType: 'WORKSHOP',
                mode: 'ONLINE',
                startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
                capacity: 100,
                registrationEnabled: true,
                registeredCount: 45
            },
            {
                id: '2',
                title: 'Web Development Bootcamp',
                description: 'Intensive 3-day bootcamp on modern web development',
                organizerId: 'faculty-1',
                status: 'ONGOING',
                eventType: 'WORKSHOP',
                mode: 'HYBRID',
                startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                capacity: 50,
                registrationEnabled: true,
                registeredCount: 48
            },
            {
                id: '3',
                title: 'Cybersecurity Awareness',
                description: 'Learn about latest cybersecurity threats and prevention',
                organizerId: 'faculty-1',
                status: 'COMPLETED',
                eventType: 'SEMINAR',
                mode: 'OFFLINE',
                startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
                capacity: 80,
                registrationEnabled: false,
                registeredCount: 75
            }
        ],
        totalElements: 5,
        totalPages: 1,
        number: 0,
        size: 10
    },

    hackathons: {
        content: [
            {
                id: '1',
                title: 'CodeBlaze 2024',
                description: 'Annual coding hackathon with exciting prizes',
                organizerId: 'faculty-1',
                status: 'ONGOING',
                theme: 'Innovation in EdTech',
                startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                submissionDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
                minTeamSize: 2,
                maxTeamSize: 4,
                maxTeams: 50,
                prizePool: 50000,
                registeredTeams: 32
            },
            {
                id: '2',
                title: 'AI Challenge 2024',
                description: 'Build innovative AI solutions',
                organizerId: 'faculty-1',
                status: 'UPCOMING',
                theme: 'Artificial Intelligence',
                startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
                submissionDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
                minTeamSize: 1,
                maxTeamSize: 3,
                maxTeams: 30,
                prizePool: 75000,
                registeredTeams: 18
            }
        ],
        totalElements: 2,
        totalPages: 1,
        number: 0,
        size: 10
    },

    students: [
        {
            id: '1',
            name: 'Rahul Sharma',
            email: 'rahul.sharma@college.edu',
            department: 'Computer Science',
            college: 'IIT Delhi',
            eventsAttended: 8,
            hackathonsParticipated: 3,
            certificatesEarned: 6,
            attendanceRate: 92.5
        },
        {
            id: '2',
            name: 'Priya Patel',
            email: 'priya.patel@college.edu',
            department: 'Information Technology',
            college: 'IIT Delhi',
            eventsAttended: 12,
            hackathonsParticipated: 5,
            certificatesEarned: 10,
            attendanceRate: 95.0
        },
        {
            id: '3',
            name: 'Amit Kumar',
            email: 'amit.kumar@college.edu',
            department: 'Computer Science',
            college: 'IIT Delhi',
            eventsAttended: 6,
            hackathonsParticipated: 2,
            certificatesEarned: 4,
            attendanceRate: 87.5
        },
        {
            id: '4',
            name: 'Sneha Reddy',
            email: 'sneha.reddy@college.edu',
            department: 'Electronics',
            college: 'IIT Delhi',
            eventsAttended: 10,
            hackathonsParticipated: 4,
            certificatesEarned: 8,
            attendanceRate: 91.0
        }
    ],

    recentActivity: [
        {
            type: 'registration',
            message: 'New registration for Tech Talk: AI in Education',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            eventId: '1'
        },
        {
            type: 'submission',
            message: 'New submission for CodeBlaze 2024',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            eventId: '1'
        },
        {
            type: 'registration',
            message: 'New registration for Web Development Bootcamp',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            eventId: '2'
        }
    ],

    analytics: {
        totalEvents: 5,
        totalHackathons: 2,
        totalParticipants: 45,
        avgAttendance: 89.5,
        eventTrend: [],
        participationByDepartment: [],
        eventTypeDistribution: [],
        monthlyEngagement: [],
        eventSuccessRate: 85.0,
        hackathonCompletionRate: 78.0,
        studentEngagementScore: 89.5
    }
};
