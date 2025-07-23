import * as heroRepository from '../repositories/heroRepository.js';
import Hero from '../models/heroModel.js';

export async function getAllHeroes() {
  // Devuelve todos los campos de todos los héroes
  return await Hero.find();
}

export async function addHero(heroData) {
  // Normaliza los datos para comparar
  const query = {
    name: heroData.name?.trim().toLowerCase(),
    alias: heroData.alias?.trim().toLowerCase(),
    city: heroData.city?.trim().toLowerCase(),
    team: heroData.team?.trim().toLowerCase()
  };

  // Busca duplicados por nombre o alias
  const exists = await Hero.findOne({
    $or: [
      { name: query.name },
      { alias: query.alias }
    ]
  });

  if (exists) {
    throw new Error('El héroe ya existe');
  }

  // Guarda los datos normalizados
  const newHero = new Hero({
    ...heroData,
    name: query.name,
    alias: query.alias,
    city: query.city,
    team: query.team
  });

  await newHero.save();
  return newHero.toObject();
}

export async function updateHero(id, updatedHero) {
  const hero = await Hero.findOneAndUpdate({ id: parseInt(id) }, updatedHero, { new: true });
  if (!hero) throw new Error('Héroe no encontrado');
  return hero;
}

export async function deleteHero(id) {
  const result = await Hero.deleteOne({ id: parseInt(id) });
  if (result.deletedCount === 0) throw new Error('Héroe no encontrado');
  return { message: 'Héroe eliminado' };
}

export async function findHeroesByCity(city) {
  return await Hero.find({ city: { $regex: new RegExp(city, 'i') } });
}
  