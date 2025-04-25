import { LocalStorageAccessor } from '@/utils/localStorage';

const storage = new LocalStorageAccessor('schedule');

export function saveSelectedGroup(groupId: string) {
  storage.set('selected-group', groupId);
}

export function retrieveSavedSelectedGroup(): string | null {
  return storage.get('selected-group');
}
