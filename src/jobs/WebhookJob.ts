export const WEBHOOK_JOB_NAME = 'WebhookJob'

export interface WebhookJob {
  headers: Map<String, String>,
  url: string
  body: string
}