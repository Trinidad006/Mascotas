import * as petRepository from '../repositories/petRepository.js';
import Pet from '../models/petModel.js';

export async function getAllPets() {
  return await Pet.find();
}

export async function addPet(petData) {
  // Normaliza los datos para comparar
  const query = {
    name: petData.name?.trim().toLowerCase(),
    type: petData.type?.trim().toLowerCase(),
    superPower: petData.superPower?.trim().toLowerCase(),
    heroId: petData.heroId,
    personalidad: (petData.personalidad || 'normal').trim().toLowerCase()
  };
  const exists = await Pet.findOne({
    name: query.name,
    type: query.type,
    superPower: query.superPower,
    heroId: query.heroId,
    personalidad: query.personalidad
  });
  if (exists) {
    throw new Error('La mascota ya está registrada');
  }
  const newPet = new Pet({
    ...petData,
    name: query.name,
    type: query.type,
    superPower: query.superPower,
    personalidad: query.personalidad
  });
  await newPet.save();
  return newPet.toObject();
}

export async function getPetsByHeroId(heroId) {
  return await Pet.find({ heroId: parseInt(heroId) });
}

export async function deletePet(id) {
  const result = await Pet.deleteOne({ id: parseInt(id) });
  if (result.deletedCount === 0) throw new Error('Mascota no encontrada');
  return { message: 'Mascota eliminada' };
}

export async function updatePet(id, updateData) {
  const pet = await Pet.findOneAndUpdate({ id: parseInt(id) }, updateData, { new: true });
  if (!pet) throw new Error('Mascota no encontrada');
  return pet;
}

// --- FUNCIONES DE ACCIONES SOBRE LA MASCOTA ---
async function modificarVidaPet(id, modificador, accion = '') {
  const pet = await Pet.findOne({ id: parseInt(id) });
  if (!pet) throw new Error('Mascota no encontrada');
  if (!pet.vida) {
    pet.vida = {
      salud: 100,
      hambre: 0,
      sueno: 100,
      limpieza: 100,
      estado: 'vivo'
    };
  }
  if (pet.felicidad === undefined) pet.felicidad = 100;
  if (!pet.personalidad) pet.personalidad = 'normal';
  if (pet.pereza === undefined) pet.pereza = 0;
  if (pet.vida.estado === 'muerto') throw new Error('La mascota ha muerto');
  modificador(pet);
  // Limitar pereza entre 0 y 100
  if (pet.pereza < 0) pet.pereza = 0;
  if (pet.pereza > 100) pet.pereza = 100;
  pet.markModified('vida'); // Asegura que Mongoose guarde los cambios en vida
  await pet.save();
  return pet;
}

export async function banarPet(id) {
  return modificarVidaPet(id, pet => {
    pet.vida.limpieza = 100;
    // Felicidad
    if (pet.personalidad === 'enojona') {
      pet.felicidad -= 10;
    } else {
      pet.felicidad += 10;
    }
    if (pet.felicidad > 100) pet.felicidad = 100;
    if (pet.felicidad < 0) pet.felicidad = 0;
    // Pereza
    if (pet.personalidad === 'perezosa') {
      pet.pereza += 5;
    }
  }, 'banar');
}

export async function alimentarPet(id) {
  return modificarVidaPet(id, pet => {
    if (pet.vida.hambre === 0) {
      pet.vida.salud -= 20; // sobrealimentación
    } else {
      pet.vida.hambre -= 30;
      if (pet.vida.hambre < 0) pet.vida.hambre = 0;
      if (pet.vida.hambre === 0 && pet.vida.salud < 100) pet.vida.salud += 5;
    }
    // Limpieza
    pet.vida.limpieza -= 10;
    if (pet.vida.limpieza < 0) pet.vida.limpieza = 0;
    // Felicidad
    if (pet.personalidad === 'triste') {
      pet.felicidad -= 10;
    } else {
      pet.felicidad += 10;
    }
    if (pet.felicidad > 100) pet.felicidad = 100;
    if (pet.felicidad < 0) pet.felicidad = 0;
    // Pereza
    if (pet.personalidad === 'perezosa') {
      pet.pereza += 10;
    }
  }, 'alimentar');
}

export async function jugarPet(id) {
  return modificarVidaPet(id, pet => {
    // Limpieza
    if (pet.personalidad === 'juguetona') {
      pet.vida.limpieza -= 30;
    } else {
      pet.vida.limpieza -= 10;
    }
    if (pet.vida.limpieza < 0) pet.vida.limpieza = 0;
    // Felicidad
    if (pet.personalidad === 'enojona') {
      pet.felicidad += 5;
    } else if (pet.personalidad === 'triste') {
      pet.felicidad += 20;
    } else {
      pet.felicidad += 15;
    }
    if (pet.felicidad > 100) pet.felicidad = 100;
    // Pereza
    if (pet.personalidad === 'perezosa') {
      pet.pereza += 10;
    } else {
      pet.pereza += 5;
    }
    // Sueño
    pet.vida.sueno -= 20;
    if (pet.vida.sueno < 0) pet.vida.sueno = 0;
  }, 'jugar');
}

export async function curarPet(id) {
  return modificarVidaPet(id, pet => {
    if (pet.vida.salud < 100 && pet.vida.estado !== 'muerto') pet.vida.salud = 100;
  }, 'curar');
}

export async function dormirPet(id) {
  return modificarVidaPet(id, pet => {
    pet.vida.sueno = 100;
    // Felicidad
    pet.felicidad += 5;
    if (pet.felicidad > 100) pet.felicidad = 100;
    // Pereza
    if (pet.personalidad === 'perezosa') {
      pet.pereza -= 20;
    } else {
      pet.pereza -= 10;
    }
  }, 'dormir');
}

export async function acariciarPet(id) {
  return modificarVidaPet(id, pet => {
    if (pet.personalidad === 'triste') {
      pet.felicidad += 30;
    } else {
      pet.felicidad += 10;
    }
    if (pet.felicidad > 100) pet.felicidad = 100;
    // Pereza
    if (pet.personalidad === 'perezosa') {
      pet.pereza += 5;
    }
  }, 'acariciar');
} 