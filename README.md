# notus-api
The Notus API Server in Node/Express.

```sh
curl http://localhost:3000/dapps -X POST -H 'Authorization: Bearer dG9rOjIwMDU4MmRkXzMzZDFfNDkyZl85NDViX2Q0ZjZhNDc2OWM0ZDoxOjA=' -H 'Accept: application/json' -H 'Content-Type: application/json' -d '
{
  "email": "wash@serenity.io",
  "dappName": "Hoban Dudes"
}'
```


```sql
psql postgres -U chuckbergeron;

CREATE DATABASE notusapi;

GRANT ALL PRIVILEGES ON DATABASE notusapi TO chuckbergeron;
```


replace creds with env vars