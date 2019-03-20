import { resolveProtocolHostAndPort } from '../utils/resolveProtocolHostAndPort';

// https://api.notus.network
export const sendApiKeyEmail = (sendMail, dappInstance): void => {
  sendMail({
    to: dappInstance.email,
    // from: 'noreply@nestjs.com',
    subject: 'Welcome - Your Notus API Key ✔',
    // text: 'welcome',
    // html: '<b>welcome</b>',
    template: 'test', // The `.pug` or `.hbs` extension is appended automatically.
    text: 'This is the text version of the email',
    context: {
      protocolHostAndPort: resolveProtocolHostAndPort(),
      email: dappInstance.email,
      apiKey: dappInstance.apiKey,
      dappName: dappInstance.dappName,
      confirmationCode: dappInstance.confirmationCode
    }
  })
  .then((val) => {console.log(val)})
  .catch((err) => { console.warn(err)});
}
