import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: String,
  type: String,
  superPower: String,
  ownerId: { type: String, required: true },
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