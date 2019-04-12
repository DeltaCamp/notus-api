# notus-api

The Notus API Server in Node/Express.

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
$ curl http://localhost:4000/apps -X POST -H 'Authorization: Bearer dG9rOjIwMDU4MmRkXzMzZDFfNDkyZl85NDViX2Q0ZjZhNDc2OWM0ZDoxOjA=' -H 'Accept: application/json' -H 'Content-Type: application/json' -d '
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
createdAt
updatedAt

DAPPS_USERS
user_id
app_id
app_owner bool

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
createdAt
updatedAt

WEBHOOKS
id
name (ie. 'alert users whenever X is above 1000' or 'alert me whenever Y drops below 40')
data (blob)
createdAt
updatedAt
