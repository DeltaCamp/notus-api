import { MailJob } from './MailJob'

export class MailJobBuffer {
  private mailJobs: MailJob[] = [];

  add(mailJob: MailJob) {
    this.mailJobs.push(mailJob)
  }

  isEmpty(): boolean {
    return this.mailJobs.length === 0
  }

  flush(): MailJob {
    if (this.isEmpty()) { return null }
    let mailJob = null
    if (this.mailJobs.length == 1) {
      mailJob = this.mailJobs[0]
    } else {
      mailJob = {
        subject: `${this.mailJobs.length} events occurred`,
        text: '',
        html: ''
      }
      this.mailJobs.forEach(mail => {
        mailJob.text +=
          `${mail.subject}:
${mail.text}

`

        mailJob.html +=
`<h3>${mail.subject}</h3>
${mail.html}
<br />
`
      })
    }
    this.mailJobs = []
    return mailJob
  }
}