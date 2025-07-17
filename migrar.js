import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

import Pet from './models/petModel.js';
import Hero from './models/heroModel.js';

const pets = JSON.parse(fs.readFileSync('./data/pets.json'));
const heroes = JSON.parse(fs.readFileSync('./data/superheroes.json'));

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Pet.deleteMany();  // Limpia la colección de mascotas
    await Hero.deleteMany(); // Limpia la colección de héroes

    await Pet.insertMany(pets);
    await Hero.insertMany(heroes);

    console.log('✅ Datos migrados correctamente');
    process.exit();
  } catch (err) {
    console.error('❌ Error en migración:', err.message);
    process.exit(1);
  }
};

migrate(); 