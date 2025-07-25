import * as userRepository from '../repositories/userRepository.js';
import User from '../models/heroModel.js';

export async function getAllUsers() {
  return await User.find();
}

export async function addUser(userData) {
  // Normaliza el id para comparar
  const query = {
    id: userData.id?.trim()
  };

  // Busca duplicados por id
  const exists = await User.findOne({ id: query.id });
  if (exists) {
    throw new Error('El usuario ya existe');
  }

  // Guarda el usuario
  const newUser = new User({
    ...userData,
    id: query.id
  });

  await newUser.save();
  return newUser.toObject();
}

export async function deleteAllUsers() {
  return await User.deleteMany({});
}
  