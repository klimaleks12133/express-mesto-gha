const usersRoutes = require('./routes/users');
const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/mestodb';
const app = express();
// применяем парсер к телу запроса в формате JSON
app.use(bodyParser.json());
// применяем парсер к телу запроса в формате x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url);
app.use('/', usersRoutes);
app.use((req, res, next) => {
  req.user = {
    _id: '659abbe4402df2be2b91b27b'
  };
  next();
});

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}...`);
// });

app.listen(port);