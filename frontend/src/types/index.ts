// User Roles
export type UserRole = 'super_admin' | 'college_admin' | 'faculty' | 'student' | 'judge' | 'sponsor';

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  collegeId?: string;
  collegeName?: string;
  department?: string;
  year?: number;
  points: number;
  streak: number;
  createdAt: Date;
  isEmailVerified: boolean;
}

// College Interface
export interface College {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  location: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  studentCount: number;
  facultyCount: number;
  isActive: boolean;
  createdAt: Date;
  stats: CollegeStats;
}

export interface CollegeStats {
  totalEvents: number;
  totalHackathons: number;
  totalStudents: number;
  totalContent: number;
  engagementScore: number;
}

// Hackathon Interface
export interface Hackathon {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  bannerImage?: string;
  collegeId: string;
  collegeName: string;
  organizerId: string;
  organizerName: string;
  mode: 'online' | 'offline' | 'hybrid';
  location?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  maxTeamSize: number;
  minTeamSize: number;
  prizePool: number;
  currency: string;
  status: 'draft' | 'published' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  techStack: string[];
  problemStatements: ProblemStatement[];
  sponsors: Sponsor[];
  faqs: FAQ[];
  rules: string[];
  judgingCriteria: JudgingCriterion[];
  registeredTeams: number;
  totalParticipants: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProblemStatement {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  website?: string;
  description?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface JudgingCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

// Event Interface
export interface Event {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  collegeId: string;
  collegeName: string;
  organizerId: string;
  organizerName: string;
  eventType: 'workshop' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'tech_talk' | 'networking' | 'other';
  mode: 'online' | 'offline' | 'hybrid';
  location?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline?: Date;
  capacity?: number;
  registeredCount: number;
  attendeesCount: number;
  status: 'draft' | 'published' | 'registration_open' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  requirements?: string;
  agenda?: AgendaItem[];
  speakers?: Speaker[];
  isPublic: boolean;
  requiresApproval: boolean;
  certificateTemplate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface Speaker {
  id: string;
  name: string;
  designation: string;
  company?: string;
  avatar?: string;
  bio?: string;
}

// Team Interface
export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  leaderId: string;
  leaderName: string;
  members: TeamMember[];
  projectName?: string;
  projectDescription?: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  pptUrl?: string;
  submissionStatus: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'evaluated';
  submittedAt?: Date;
  score?: number;
  rank?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'leader' | 'member';
  skills: string[];
  joinedAt: Date;
}

// Content/Resource Interface
export interface Content {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  collegeId: string;
  collegeName: string;
  uploaderId: string;
  uploaderName: string;
  department?: string;
  category: 'study_material' | 'lab_manual' | 'project_report' | 'research_paper' | 'club_document' | 'placement_prep' | 'other';
  tags: string[];
  accessLevel: 'public' | 'college_only' | 'department_only' | 'private';
  status: 'pending' | 'approved' | 'rejected';
  downloadCount: number;
  viewCount: number;
  version: number;
  previousVersions?: ContentVersion[];
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentVersion {
  version: number;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  type: 'event_reminder' | 'hackathon_update' | 'team_invite' | 'content_approved' | 'content_rejected' | 'registration_confirmed' | 'certificate_ready' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  collegeName: string;
  points: number;
  eventsAttended: number;
  hackathonsParticipated: number;
  certificatesEarned: number;
  streakDays: number;
}

// Analytics Interface
export interface Analytics {
  totalUsers: number;
  totalColleges: number;
  totalEvents: number;
  totalHackathons: number;
  totalContent: number;
  activeUsers: number;
  newUsersThisMonth: number;
  eventsThisMonth: number;
  hackathonsThisMonth: number;
  userGrowth: ChartData[];
  eventParticipation: ChartData[];
  hackathonStats: HackathonStats;
  topColleges: CollegeRanking[];
  topStudents: LeaderboardEntry[];
}

export interface ChartData {
  label: string;
  value: number;
  date?: Date;
}

export interface HackathonStats {
  total: number;
  ongoing: number;
  completed: number;
  averageParticipants: number;
  totalPrizePool: number;
}

export interface CollegeRanking {
  rank: number;
  collegeId: string;
  collegeName: string;
  score: number;
  eventsHosted: number;
  hackathonsHosted: number;
  studentParticipation: number;
}

// Certificate Interface
export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  eventId?: string;
  eventName?: string;
  hackathonId?: string;
  hackathonName?: string;
  type: 'participation' | 'winner' | 'runner_up' | 'organizer' | 'judge';
  position?: string;
  issueDate: Date;
  certificateUrl: string;
  certificateNumber: string;
  verified: boolean;
}

// Judge Evaluation
export interface Evaluation {
  id: string;
  hackathonId: string;
  teamId: string;
  teamName: string;
  judgeId: string;
  judgeName: string;
  scores: CriterionScore[];
  totalScore: number;
  feedback: string;
  evaluatedAt: Date;
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comment?: string;
}

// Search Filters
export interface HackathonFilters {
  search?: string;
  mode?: ('online' | 'offline' | 'hybrid')[];
  status?: string;
  techStack?: string[];
  prizeMin?: number;
  prizeMax?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  college?: string;
}

export interface EventFilters {
  search?: string;
  eventType?: string[];
  mode?: ('online' | 'offline' | 'hybrid')[];
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  college?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Theme Type
export interface Club {
  id: string;
  name: string;
  description: string;
  collegeId: string;
  collegeName: string;
  facultyAdvisorId?: string;
  facultyAdvisorName?: string;
  presidentId?: string;
  presidentName?: string;
  bannerUrl?: string;
  logoUrl?: string;
  category?: string;
  tags?: string;
  achievements?: string;
  isActive: boolean;
  createdAt: string;
}

export type TeamRole = 'ORGANIZER' | 'COORDINATOR' | 'VOLUNTEER' | 'JUDGE';

export interface EventTeamMember {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamRole;
  assignedById?: string;
  assignedByName?: string;
  assignedAt: string;
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  speaker: string;
  startTime: string;
  endTime: string;
  meetingUrl?: string;
  bannerUrl?: string;
  category?: string;
  collegeId?: string;
  collegeName?: string;
  createdAt: string;
}

export type Theme = 'light' | 'dark' | 'system';
