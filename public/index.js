FILE PATH: public/index.js
CONTENT: 
```javascript
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/proxy', (req, res) => {
  const { url, method, headers, body } = req.body;

  const requestOptions = {
    url,
    method,
    headers,
    body,
  };

  request(requestOptions, function (error, response, body) {
    if (error) {
      res.status(500).send('Error fetching the URL');
    } else {
      res.status(response.statusCode).send(response.body);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```