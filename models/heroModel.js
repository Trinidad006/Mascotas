import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: String,
  email: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.password; // No exponer la contraseña
      return ret;
    }
  }
});

export default mongoose.model('User', userSchema); 