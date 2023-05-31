const express = require('express');
const http = require('http');

const app = express();

const options = {
  headers: {
    'user-agent': 'Android Vinebre Software'
  },
  rejectUnauthorized: false
};

app.get('/akotv', (req, res) => {
  const s = req.query.s || 'default value';
  https.get('http://config.e-droid.net/srv/config.php?v=149&vname=1.7&idapp=2336559&idusu=0&cod_g=&gp=0&am=0&idl=ar&pa_env=1&pa=AE&pn=com.arabstar.tvconnect&fus=010100000000&aid=9ae7f3cc2d5f848a', options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const delimiter = '[s23358112_url=';
      const first_step = data.includes(delimiter) ? data.split(delimiter) : [];
      const second_step = first_step.length > 1 ? first_step[1].split('][') : [];
      const user = second_step.length > 0 ? second_step[0] : '';
      const a = user.replace('/3', s);

      // Set the response header to the URL
      res.location(a);
      res.sendStatus(302); // Send redirect response
    });
  }).on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' }); // Send error response
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
