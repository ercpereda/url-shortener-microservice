# freeCodeCamp URL Shotener Microservice

## Mode of use

Make a get request to `/new/<url>` to generate a new short url.

Example:

```
request:
https://camper-api-project-ercpereda.c9users.io/new/http://www.google.com

response:
{
  "origial_url": "http://www.google.com",
  "short_url": "camper-api-project-ercpereda.c9users.io/7766"
}
```

If you visit the shor url, you will be redirect to the original url.
