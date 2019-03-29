# notus-api
The Notus API Server in Node/Express.

# REST API

Developer Flow:

1. Developer signs up and is emailed a magic link:
POST /user
2. Developer signs in with magic link and creates a new dapp:
POST /dapps
2. The dapp can be configured:
PATCH /dapps/:dappId

User Flow:

1. User signs up and is emailed a magic link:
POST /user
2. User signs in with magic link.  They browse dapps and access the dapp notification panel.
When they want to configure the dapp notifications, they click on a dapp.  Clicking on a dapp will create a
dapp user and immediately return a link to the dapp page along with a dapp user access code.  The code can be
used by the dapp to setup notifications on behalf of the user.
POST /dapp-user

Dapp User Flow:

1. Anyone can create a new user.  The user will be emailed a magic link that will first go to the api server and confirm their account, then redirect to the dapp with an access token.
(POST /dapp-user)
2. The user receives a confirmation email with the magic link, and the link takes them to the dapp notification config page.
(POST /dapp-user/confirm)
3. An authenticated dapp or the user themselves can create new notifications for the user:
(POST /notifications)

What is shared:

When the user updates their notifications within a dapp, the notifications it can update are scoped to that dapp.

How to combine both?

On Notus, have a page that lists dapps.  A user can click on a dapp to see it's notifications, and subscribe to it.

The dapp notification pages may be local *or linked through the email*

# Development

Start the Notus API:

```sh
$ yarn start
```

Start the Notus Worker:

```sh
$ yarn worker
```

## Creating DB Migrations

```sh
$ yarn migration:create NameOfNewMigration
```

```sh
$ curl http://localhost:4000/dapps -X POST -H 'Authorization: Bearer dG9rOjIwMDU4MmRkXzMzZDFfNDkyZl85NDViX2Q0ZjZhNDc2OWM0ZDoxOjA=' -H 'Accept: application/json' -H 'Content-Type: application/json' -d '
{
  "email": "wash@serenity.io",
  "name": "Hoban Dudes"
}'
```

```sql
$ psql postgres -U chuckbergeron;

CREATE DATABASE notusapi;

GRANT ALL PRIVILEGES ON DATABASE notusapi TO chuckbergeron;
```

## DB SCHEMA

DAPPS
id
name
api_key
created_at
updated_at

DAPPS_USERS
user_id
dapp_id
dapp_owner bool

USERS_WEBHOOKS
user_id
webhook_id
active bool

USERS
id
name
email
phone_number
confirmation_code
confirmed
created_at
updated_at

WEBHOOKS
id
name (ie. 'alert users whenever X is above 1000' or 'alert me whenever Y drops below 40')
data (blob)
created_at
updated_at
