ERC20 Contract events:

1. Transfer
2. Account activity
3. Price of ether

User {
}

Dapp {
  eventTypes: EventType[]
}

Variable {
  eventType: EventType
  source: 'transaction.from'
  type: 'address'
  description 'Who sent the transaction'
  public: boolean
}

Matcher {
  variable: Variable
  type: 'gt | eq | lt | gte | lte',
  operand: '0x1234'
}

EventTypeMatcher {
  eventType: EventType
  matcher: Matcher
}

EventType {
  dapp: Dapp
  name: 'ERC20 transfer event'
  matchers: EventTypeMatcher[]
  variables: Variable[]
  subject: text,
  body: text
}

EventMatcher {
  event: Event
  matcher: Matcher
}

Event {
  user: User
  eventType: EventType
  matchers: EventMatcher[]
}
