import { DynamicModule } from '@nestjs/common'
import { PugAdapter, MailerModule } from '@nest-modules/mailer'

export const mailModule: DynamicModule = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: `smtps://${process.env.SEND_IN_BLUE_EMAIL}:${process.env.SEND_IN_BLUE_APIV2}@smtp-relay.sendinblue.com`,
    defaults: {
      from: '"Notus Network" <noreply@notus.network>'
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
