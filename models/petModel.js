import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  superPower: String,
  heroId: Number,
  vida: Object,
  felicidad: Number,
  personalidad: String,
  pereza: Number
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model('Pet', petSchema); 