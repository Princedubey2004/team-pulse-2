import type { Notification, Member } from '../api/mockData';

export function getTeamDisplay(member: Member): string {
  if (typeof member.team === 'object') {
    return (member.team as { name: string }).name;
  }
  return 'Unassigned';
}

export function bindNotificationHandlers(
  notifications: Notification[],
  onSelect: (id: number) => void,
): (() => void)[] {
  const handlers: (() => void)[] = [];
  for (let i = 0; i < notifications.length; i++) {
    handlers.push(function () {
      onSelect(notifications[i]?.id ?? -1);
    });
  }
  return handlers;
}
