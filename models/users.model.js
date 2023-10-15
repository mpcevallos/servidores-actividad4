const mongoose = require("mongoose");
const validatorPackage = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Se requiere correo electrónico."],
      validate: {
        validator: validatorPackage.isEmail,
        message:
          "Por favor, introduce una dirección de correo electrónico válida.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "La contraseña debe tener al menos 8 caracteres."],
    },
    bio: {
      type: String,
      maxlength: [60, "La biografía no puede tener más de 60 caracteres."],
    },
    confirmation: {
      type: String,
      unique: true,
      required: [true, "Se requiere confirmación."],
    },
    confirmationToken: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
