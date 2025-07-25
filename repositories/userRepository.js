import User from '../models/heroModel.js';

export async function getUsers() {
  return await User.find();
}

export async function addUser(data) {
  const newUser = new User(data);
  return await newUser.save();
}

export async function deleteAllUsers() {
  return await User.deleteMany({});
}