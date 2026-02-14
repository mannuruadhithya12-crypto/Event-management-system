
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
