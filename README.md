# notus-api
The Notus API Server in Node/Express.

# REST API

// Who is the target audience for this project?

Users?
Developers?

// We should allow developers to send notifications to users

Developer Ideal:

1. Developer signs up and confirms email with magic link
(POST /user)
2. Developer creates a new dapp.
(POST /dapps)
2. The confirmation email can be configured for the dapp, as well as different notification templates.
(PATCH /dapps/:dappId)
3. In the dapp a user can sign up for notifications by clicking a magic link.
(POST /dapp-user)
4. The user receives a confirmation email with the magic link, and the link takes them to the dapp notification config page.
(POST /dapp-user/confirm)
5. The user configures their notifications, and moves on.
(POST /notifications)

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
