export type ApproveUserAction = 'approve' | 'disapprove';

const PREFIX = 'approveuser-' as const;

type ApproveUserCallbackData = `${typeof PREFIX}${number}-${ApproveUserAction}`;

export function createApproveUserCallback(
  userId: number,
  action: ApproveUserAction
): ApproveUserCallbackData {
  return `${PREFIX}${userId}-${action}`;
}

export function isApproveUserCallbackByPrefix(
  data: string
): data is ApproveUserCallbackData {
  return data.startsWith(PREFIX);
}

export function isApproveUserAction(
  action: string
): action is ApproveUserAction {
  return action === 'approve' || action === 'disapprove';
}

export function parseApproveUserCallback(data: ApproveUserCallbackData) {
  const dashIndex = data.indexOf('-', PREFIX.length);
  const userId = Number.parseInt(data.slice(PREFIX.length, dashIndex));
  const action = data.slice(dashIndex + 1);

  if (!Number.isNaN(userId) && isApproveUserAction(action)) {
    return { userId, action };
  }

  return null;
}
