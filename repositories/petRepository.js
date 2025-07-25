import Pet from '../models/petModel.js';

export async function getAllPets() {
  return await Pet.find();
}

export async function addPet(data) {
  const newPet = new Pet(data);
  return await newPet.save();
}

export async function deleteAllPets() {
  return await Pet.deleteMany({});
} 