# notus-api
The Notus API Server in Node/Express.

# REST API

POST /dapps dappName,email - create a new Dapp
POST /dapp-users/notification - create a new notification
{
  name,
  address,
  topics,
  subject,
  body
}

# Development

## Creating DB Migrations

```sh
y migration:create NameOfNewMigration
```

```sh
curl http://localhost:4000/dapps -X POST -H 'Authorization: Bearer dG9rOjIwMDU4MmRkXzMzZDFfNDkyZl85NDViX2Q0ZjZhNDc2OWM0ZDoxOjA=' -H 'Accept: application/json' -H 'Content-Type: application/json' -d '
{
  "email": "wash@serenity.io",
  "name": "Hoban Dudes"
}'
```

```sql
psql postgres -U chuckbergeron;

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
