import { members as seedMembers, activities, notifications } from './mockData';
import type { Member, Activity, Notification } from './mockData';

export type { Member, Activity, Notification };

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(): number {
  return 200 + Math.floor(Math.random() * 600);
}

let memberStore = seedMembers.map(m => ({ ...m, tags: [...m.tags] }));

export async function fetchMembers(filters?: { status?: string; role?: string }): Promise<Member[]> {
  await delay(randomDelay());
  let result = [...memberStore];
  if (filters?.status) {
    result = result.filter(m => m.status === filters.status);
  }
  if (filters?.role) {
    result = result.filter(m => m.role === filters.role);
  }
  return result;
}

export async function fetchActivities(): Promise<Activity[]> {
  await delay(randomDelay());
  return [...activities];
}

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(200);
  return [...notifications];
}

export async function updateMemberRole(id: number, role: string): Promise<void> {
  await delay(150 + Math.floor(Math.random() * 200));
  if (Math.random() < 0.1) {
    throw new Error(`Failed to update member ${id}: server error`);
  }
  const member = memberStore.find(m => m.id === id);
  if (!member) throw new Error(`Member ${id} not found`);
  member.role = role;
}

export async function saveMember(member: Member): Promise<void> {
  await delay(300);
  const idx = memberStore.findIndex(m => m.id === member.id);
  if (idx !== -1) {
    memberStore[idx] = { ...member, tags: [...member.tags] };
  }
}

export async function searchMembers(query: string): Promise<Member[]> {
  const searchDelay = 50 + Math.floor(Math.random() * 750);
  await delay(searchDelay);
  const lower = query.toLowerCase();
  return memberStore.filter(
    m => m.name.toLowerCase().includes(lower) || m.email.toLowerCase().includes(lower)
  );
}
