const photo = require('../models/Photo'),
  path = require('path'),
  fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1  
  const photoPerPage = 3  
  const totalPhotos = await photo.find().countDocuments(); 

  const photos = await photo.find({}) 
    .sort('-dateCreated') 
    .skip( (page - 1) * photoPerPage )  
    .limit(photoPerPage); 

  res.render('index', { 
    photos: photos,
    currentPage:page,
    totalPage: Math.ceil(totalPhotos  / photoPerPage ),
    totalPhotos: totalPhotos 
   });
};

exports.getPhotoPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('photo', { photo: foundedPhoto });
};

exports.getEditPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('edit', { photo: foundedPhoto });
};

exports.photoUpdate = async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
};

exports.photoUpload = async (req, res) => {
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err); 
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
};

exports.photoDelete = async (req, res) => {
  const foundedPhoto = await photo.findOne({ _id: req.params.photo_id });
  const imagepath = __dirname + '/../public' + foundedPhoto.image
  if (fs.existsSync(imagepath)) fs.unlinkSync(imagepath)
  await photo.findByIdAndDelete(req.params.photo_id);
  res.redirect('/');
};
