import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/heroModel.js';
import Pet from './models/petModel.js';

async function limpiarDB() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.deleteMany({});
  await Pet.deleteMany({});
  console.log('✅ Todos los usuarios y mascotas han sido eliminados.');
  await mongoose.disconnect();
}

limpiarDB(); 