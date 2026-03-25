export interface Team {
  name: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'on-leave' | 'offline';
  team: Team | null;
  avatar: string;
  tags: string[];
  bookmarked: boolean;
}

export interface Activity {
  id: number;
  memberId: number;
  memberName: string;
  action: string;
  timestamp: Date;
  note: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  memberId: number;
  read: boolean;
  createdAt: Date;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

export const members: Member[] = [
  { id: 1, name: 'Aisha Patel', email: 'aisha.patel@teampulse.io', role: 'Engineering Lead', status: 'active', team: { name: 'Payments Core' }, avatar: initials('Aisha Patel'), tags: ['backend', 'infra'], bookmarked: true },
  { id: 2, name: 'Marcus Chen', email: 'marcus.chen@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Payments Core' }, avatar: initials('Marcus Chen'), tags: ['golang', 'microservices'], bookmarked: false },
  { id: 3, name: 'Sofia Rodriguez', email: 'sofia.rodriguez@teampulse.io', role: 'Product Manager', status: 'on-leave', team: { name: 'Risk & Compliance' }, avatar: initials('Sofia Rodriguez'), tags: ['product', 'compliance'], bookmarked: true },
  { id: 4, name: 'James Okafor', email: 'james.okafor@teampulse.io', role: 'Junior Engineer', status: 'active', team: null, avatar: initials('James Okafor'), tags: ['frontend', 'react'], bookmarked: false },
  { id: 5, name: 'Emily Nakamura', email: 'emily.nakamura@teampulse.io', role: 'QA Engineer', status: 'active', team: { name: 'Lending Platform' }, avatar: initials('Emily Nakamura'), tags: ['testing', 'automation'], bookmarked: false },
  { id: 6, name: 'David Kim', email: 'david.kim@teampulse.io', role: 'Senior Engineer', status: 'offline', team: { name: 'Payments Core' }, avatar: initials('David Kim'), tags: ['backend', 'java'], bookmarked: true },
  { id: 7, name: 'Priya Sharma', email: 'priya.sharma@teampulse.io', role: 'Engineering Lead', status: 'active', team: { name: 'Risk & Compliance' }, avatar: initials('Priya Sharma'), tags: ['security', 'architecture'], bookmarked: false },
  { id: 8, name: 'Lucas Ferreira', email: 'lucas.ferreira@teampulse.io', role: 'Designer', status: 'active', team: { name: 'Mobile Banking' }, avatar: initials('Lucas Ferreira'), tags: ['figma', 'ux'], bookmarked: false },
  { id: 9, name: 'Zara Ahmed', email: 'zara.ahmed@teampulse.io', role: 'Junior Engineer', status: 'on-leave', team: { name: 'Lending Platform' }, avatar: initials('Zara Ahmed'), tags: ['frontend', 'typescript'], bookmarked: false },
  { id: 10, name: 'Ryan O\'Brien', email: 'ryan.obrien@teampulse.io', role: 'DevOps Engineer', status: 'active', team: { name: 'Platform Infra' }, avatar: initials('Ryan O\'Brien'), tags: ['kubernetes', 'aws'], bookmarked: true },
  { id: 11, name: 'Mei Lin Wu', email: 'mei.wu@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Mobile Banking' }, avatar: initials('Mei Lin Wu'), tags: ['react-native', 'ios'], bookmarked: false },
  { id: 12, name: 'Carlos Mendez', email: 'carlos.mendez@teampulse.io', role: 'Product Manager', status: 'active', team: { name: 'Payments Core' }, avatar: initials('Carlos Mendez'), tags: ['product', 'strategy'], bookmarked: false },
  { id: 13, name: 'Hannah Wilson', email: 'hannah.wilson@teampulse.io', role: 'Junior Engineer', status: 'offline', team: null, avatar: initials('Hannah Wilson'), tags: ['python', 'data'], bookmarked: false },
  { id: 14, name: 'Tomás Silva', email: 'tomas.silva@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Risk & Compliance' }, avatar: initials('Tomás Silva'), tags: ['backend', 'python'], bookmarked: true },
  { id: 15, name: 'Fatima Al-Hassan', email: 'fatima.alhassan@teampulse.io', role: 'Engineering Lead', status: 'active', team: { name: 'Lending Platform' }, avatar: initials('Fatima Al-Hassan'), tags: ['leadership', 'fintech'], bookmarked: false },
  { id: 16, name: 'Alex Petrov', email: 'alex.petrov@teampulse.io', role: 'QA Engineer', status: 'on-leave', team: { name: 'Platform Infra' }, avatar: initials('Alex Petrov'), tags: ['testing', 'performance'], bookmarked: false },
  { id: 17, name: 'Kenji Tanaka', email: 'kenji.tanaka@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Mobile Banking' }, avatar: initials('Kenji Tanaka'), tags: ['android', 'kotlin'], bookmarked: false },
  { id: 18, name: 'Olivia Brown', email: 'olivia.brown@teampulse.io', role: 'Designer', status: 'active', team: { name: 'Payments Core' }, avatar: initials('Olivia Brown'), tags: ['design-systems', 'figma'], bookmarked: true },
  { id: 19, name: 'Ibrahim Diallo', email: 'ibrahim.diallo@teampulse.io', role: 'Junior Engineer', status: 'active', team: { name: 'Risk & Compliance' }, avatar: initials('Ibrahim Diallo'), tags: ['frontend', 'vue'], bookmarked: false },
  { id: 20, name: 'Nina Kowalski', email: 'nina.kowalski@teampulse.io', role: 'DevOps Engineer', status: 'offline', team: { name: 'Platform Infra' }, avatar: initials('Nina Kowalski'), tags: ['terraform', 'ci-cd'], bookmarked: false },
  { id: 21, name: 'Raj Gupta', email: 'raj.gupta@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Lending Platform' }, avatar: initials('Raj Gupta'), tags: ['java', 'spring'], bookmarked: false },
  { id: 22, name: 'Chloe Martin', email: 'chloe.martin@teampulse.io', role: 'Product Manager', status: 'active', team: { name: 'Mobile Banking' }, avatar: initials('Chloe Martin'), tags: ['product', 'mobile'], bookmarked: true },
  { id: 23, name: 'Andre Williams', email: 'andre.williams@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Platform Infra' }, avatar: initials('Andre Williams'), tags: ['distributed-systems', 'go'], bookmarked: false },
  { id: 24, name: 'Yuki Sato', email: 'yuki.sato@teampulse.io', role: 'QA Engineer', status: 'active', team: { name: 'Risk & Compliance' }, avatar: initials('Yuki Sato'), tags: ['security-testing', 'automation'], bookmarked: false },
  { id: 25, name: 'Liam O\'Connor', email: 'liam.oconnor@teampulse.io', role: 'Junior Engineer', status: 'on-leave', team: null, avatar: initials('Liam O\'Connor'), tags: ['node', 'express'], bookmarked: false },
  { id: 26, name: 'Amara Osei', email: 'amara.osei@teampulse.io', role: 'Engineering Lead', status: 'active', team: { name: 'Platform Infra' }, avatar: initials('Amara Osei'), tags: ['sre', 'leadership'], bookmarked: true },
  { id: 27, name: 'Daniel Lee', email: 'daniel.lee@teampulse.io', role: 'Designer', status: 'active', team: { name: 'Lending Platform' }, avatar: initials('Daniel Lee'), tags: ['ux-research', 'prototyping'], bookmarked: false },
  { id: 28, name: 'Elena Volkov', email: 'elena.volkov@teampulse.io', role: 'Senior Engineer', status: 'offline', team: { name: 'Payments Core' }, avatar: initials('Elena Volkov'), tags: ['rust', 'performance'], bookmarked: false },
  { id: 29, name: 'Miguel Torres', email: 'miguel.torres@teampulse.io', role: 'DevOps Engineer', status: 'active', team: { name: 'Mobile Banking' }, avatar: initials('Miguel Torres'), tags: ['fastlane', 'ci-cd'], bookmarked: false },
  { id: 30, name: 'Sarah Johansson', email: 'sarah.johansson@teampulse.io', role: 'Senior Engineer', status: 'active', team: { name: 'Risk & Compliance' }, avatar: initials('Sarah Johansson'), tags: ['ml', 'fraud-detection'], bookmarked: true },
  { id: 31, name: 'Bartholomew Christophersen-Vandenberg', email: 'bartholomew.christophersen@teampulse.io', role: 'Junior Engineer', status: 'active', team: { name: 'Platform Infra' }, avatar: initials('Bartholomew Christophersen-Vandenberg'), tags: ['frontend', 'react'], bookmarked: false },
];

const actions = [
  'pushed 3 commits to payments-api',
  'opened PR #142: Fix settlement rounding',
  'reviewed PR #138: Add 2FA support',
  'deployed risk-engine v2.4.1 to staging',
  'closed issue #87: Timeout on large batches',
  'merged PR #140: Migrate to new ledger schema',
  'commented on issue #92: Rate limiter config',
  'updated sprint board for Q2 planning',
  'created branch feature/instant-transfers',
  'resolved merge conflict in lending-service',
  'added unit tests for compliance module',
  'updated API documentation for /transactions',
  'ran load test: 10k TPS sustained',
  'fixed flaky CI pipeline for mobile-app',
  'onboarded new team member to codebase',
];

const notes = [
  'All tests passing.',
  'Needs review from security team.',
  'Blocked on upstream dependency.',
  'Performance improvement: 40% faster.',
  'Ready for QA.',
  'Follow-up ticket created.',
  'Discussed in standup.',
  'Minor refactor included.',
  'Edge case handling added.',
  'Documentation updated.',
  '',
  '',
  '',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateActivities(): Activity[] {
  const result: Activity[] = [];
  const now = Date.now();
  for (let i = 1; i <= 50; i++) {
    const member = randomFrom(members);
    result.push({
      id: i,
      memberId: member.id,
      memberName: member.name,
      action: randomFrom(actions),
      timestamp: new Date(now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      note: randomFrom(notes),
    });
  }
  return result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateNotifications(): Notification[] {
  const titles = [
    'Role change requested',
    'New team member joined',
    'Sprint review scheduled',
    'Deployment completed',
    'PR requires attention',
    'Access request pending',
    'Compliance audit reminder',
    'Performance review due',
    'System alert: High CPU',
    'License renewal notice',
  ];
  const messages = [
    'Please review and approve the pending role change.',
    'A new engineer has joined your team — say hello!',
    'Sprint review for Payments Core is tomorrow at 2pm.',
    'risk-engine v2.4.1 has been deployed to production.',
    'PR #142 has been open for 3 days without review.',
    'Ibrahim Diallo requested access to the compliance dashboard.',
    'Annual compliance audit starts next Monday.',
    'Performance reviews for Q1 are due by end of week.',
    'Platform Infra cluster CPU usage exceeded 90%.',
    'Your Datadog license renews in 14 days.',
  ];
  return titles.map((title, i) => ({
    id: i + 1,
    title,
    message: messages[i],
    memberId: randomFrom(members).id,
    read: i < 4,
    createdAt: new Date(Date.now() - i * 3600 * 1000 * (i + 1)),
  }));
}

export const activities: Activity[] = generateActivities();
export const notifications: Notification[] = generateNotifications();
