# Chainlink NUSIC chartmetric adaptor for spotify

Responsible for fetching chartmetric ids for provided spotify id and return spotify monthly listeners for the Artist.

## Input Params

- `id`: The spotify artist id

## Output

```json
{
  "jobRunID": "",
  "data": {
    "listeners": 1000
  },
  "result": 1000,
  "statusCode": 200
}
```
