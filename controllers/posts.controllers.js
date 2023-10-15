const Post = require("../models/posts.model");

// Crear un post con campos definidos: Title, Text y Author.
module.exports.create = (req, res) => {
  Post.create(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: "Error creando post" });
    });
};

// Obtener listado JSON de posts almacenados en la db en memoria
module.exports.list = (req, res) => {
  Post.find().then((posts) => {
    res.json(posts);
  });
};

// Obtener detalle de un post por su id
module.exports.detail = (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.json(post);
    } else {
      res.status(400).json({ message: "Post no encontrado" });
    }
  });
};

// Actualizar un post por su id
module.exports.update = (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((post) => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ message: "Post no existe en la base de datos" });
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Error actualizando post" });
    });
};

// Eliminar un post por su id
module.exports.delete = (req, res) => {
  Post.findByIdAndRemove(req.params.id).then((post) => {
    if (post) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Post no existe en la base de datos" });
    }
  });
};
