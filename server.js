const express = require('express');
const app = express();
const sql = require('./sqlConfig');
const { createPost } = require('./services/posts')
const bodyParser = require('body-parser');

sql.sync()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/posts/create', async (req, res) => {
    console.log(req.body)
    const { title, email, description } = req.body;

    const item = await createPost({
        title, email, description
    })
    res.status(200).send(item)
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
