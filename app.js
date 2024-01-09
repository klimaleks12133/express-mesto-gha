const express = require('express');
const mongoose = require('mongoose');

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/mestodb';

mongoose.connect(url);
// , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('Connected to MongoDB');
//   app.listen(port, () => {
//     console.log(`Server is listening on port ${port}...`);
//   });
// }).catch((err) => {
//   console.error('Failed to connect to MongoDB:', err);
// });

const app = express();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});