import { DynamicModule } from '@nestjs/common'
import { PugAdapter, MailerModule } from '@nest-modules/mailer'

export const mailerModule: DynamicModule = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: `smtps://${process.env.SEND_IN_BLUE_EMAIL}:${process.env.SEND_IN_BLUE_APIV2}@smtp-relay.sendinblue.com`,
    defaults: {
      from: '"Notus" <noreply@notus.events>'
    },
    template: {
      dir: __dirname + '/../templates',
      adapter: new PugAdapter(),
      options: {
        strict: true
      }
    }
  })
})
