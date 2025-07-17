import Hero from '../models/heroModel.js';

export async function getHeroes() {
  return await Hero.find();
}

export async function addHero(data) {
  const newHero = new Hero(data);
  return await newHero.save();
}