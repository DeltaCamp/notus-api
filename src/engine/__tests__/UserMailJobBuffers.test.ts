import { UserMailJobBuffers } from '../UserMailJobBuffers'
import { UserEntity } from '../../entities';

describe('UserMailJobBuffers', () => {

  let buffer

  let mailJobPublisher, user1, user2

  beforeEach(() => {
    user1 = new UserEntity()
    user1.id = 1
    user1.email = 'user1@user1.com'

    user2 = new UserEntity()
    user2.id = 2
    user2.email = 'user2@user2.com'

    mailJobPublisher = {
      sendMail: jest.fn()
    }

    buffer = new UserMailJobBuffers(mailJobPublisher)
  })

  it('should buffer and dump', async () => {

    buffer.add(user1, {
      subject: 'a1',
      text: 'a1text',
      html: '<p>a1html</p>'
    })

    buffer.add(user1, {
      subject: 'a1b',
      text: 'a1btext',
      html: '<p>a1bhtml</p>'
    })

    buffer.add(user2, {
      subject: 'a2',
      text: 'a2text',
      html: '<p>a2html</p>'
    })

    await buffer.flush()
    await buffer.flush() // should do nothing

    expect(mailJobPublisher.sendMail).toHaveBeenCalledTimes(2)
    expect(mailJobPublisher.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'user1@user1.com',
      subject: '2 events occurred',
      text: 
`a1:
a1text

a1b:
a1btext

`,
      html:
`<h3>a1</h3>
<p>a1html</p>
<br />
<h3>a1b</h3>
<p>a1bhtml</p>
<br />
`
    }))
  })
})