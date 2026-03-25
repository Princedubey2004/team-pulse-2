export async function batchAssignRole(
  memberIds: number[],
  role: string,
  updateFn: (id: number, role: string) => Promise<void>,
  onSuccess: () => void,
  onError: (msg: string) => void
): Promise<void> {
  try {
    for (const id of memberIds) {
      await updateFn(id, role);
    }
    onSuccess();
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Batch operation failed');
  }
}

export async function batchToggleBookmark(
  memberIds: number[],
  bookmarked: boolean,
  updateFn: (id: number, bookmarked: boolean) => Promise<void>,
  onComplete: (succeeded: number, failed: number) => void
): Promise<void> {
  let succeeded = 0;
  let failed = 0;

  for (const id of memberIds) {
    try {
      await updateFn(id, bookmarked);
      succeeded++;
    } catch {
      failed++;
    }
  }

  onComplete(succeeded, failed);
}
