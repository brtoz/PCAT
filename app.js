const ejs = require('ejs'),
      express = require('express'),
      mongoose = require('mongoose'),
      fileUpload = require('express-fileupload'),
      methodOverride = require('method-override');

const photo = require('./models/Photo'), 
      photoController = require('./controllers/photoController'),
      pageController = require('./controllers/pageController');

const app = express();

//Database connect
mongoose.connect('mongodb://localhost/pcat-test-db');

//View Engine
app.set('view engine', 'ejs');

//Middlewares
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photo/:photo_id', photoController.getPhotoPage);
app.get('/photo/edit/:photo_id', photoController.getEditPage);
app.put('/photo/:photo_id', photoController.photoUpdate);
app.post('/photos', photoController.photoUpload);
app.delete('/photo/:photo_id', photoController.photoDelete);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);

const port = 3000;
app.listen(port, () => {
  console.log(`Server ${port} portunda dinleniyor`);
});
