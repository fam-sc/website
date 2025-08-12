export function validateCampaignRequest(requestId: string) {
  return fetch(`/api/campaign?id=${requestId}`, { method: 'POST' });
}
