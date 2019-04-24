export const JOB_NAME = 'MailJob'

export interface MailJob {
  to: string
  subject: string
  text?: string
  html?: string
  template?: string
  context?: object
}