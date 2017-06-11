# freeCodeCamp URL Shotener Microservice

## Mode of use

Make a get request to `/new/<url>` to generate a new short url.

Example:

```
request:
https://freecodecamp-url-shortener.herokuapp.com/new/http://www.google.com

response:
{
  "origial_url": "http://www.google.com",
  "short_url": "freecodecamp-url-shortener.herokuapp.com/9323"
}
```

If you visit the shor url, you will be redirect to the original url.
