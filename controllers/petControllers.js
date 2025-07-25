import express from 'express'
import * as petService from '../services/petServices.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router()

// Obtener todas las mascotas (solo admin)
router.get('/pets', authenticateJWT, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            const pets = await petService.getAllPets();
            return res.json(pets);
        } else {
            // Usuario normal: solo ve sus mascotas
            const pets = await petService.getPetsByOwnerId(req.user.id);
            return res.json(pets);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear mascota (el ownerId se toma del usuario autenticado)
router.post('/pets', authenticateJWT, async (req, res) => {
    try {
        const petData = { ...req.body, ownerId: req.user.id };
        const newPet = await petService.addPet(petData);
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/heroes/:heroId/pets', authenticateJWT, (req, res) => {
    const requestedHeroId = parseInt(req.params.heroId);
    const user = req.user;
    // Si es admin, puede ver cualquier heroId
    if (user.role === 'admin' || user.heroId === requestedHeroId) {
        petService.getPetsByHeroId(requestedHeroId)
            .then(pets => res.json(pets))
            .catch(error => res.status(500).json({ error: error.message }));
    } else {
        res.status(403).json({ error: 'No tienes permiso para ver estas mascotas' });
    }
});

router.get('/pets/:id/vida', async (req, res) => {
    try {
        const pets = await petService.getAllPets();
        const pet = pets.find(p => p.id === parseInt(req.params.id));
        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }
        res.json(pet.vida);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/pets/:id/banar', async (req, res) => {
    try {
        const vida = await petService.banarPet(parseInt(req.params.id));
        res.json(vida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/alimentar', async (req, res) => {
    try {
        const vida = await petService.alimentarPet(parseInt(req.params.id));
        res.json(vida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/jugar', async (req, res) => {
    try {
        const vida = await petService.jugarPet(parseInt(req.params.id));
        res.json(vida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/curar', async (req, res) => {
    try {
        const vida = await petService.curarPet(parseInt(req.params.id));
        res.json(vida);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/dormir', async (req, res) => {
    try {
        const pet = await petService.dormirPet(parseInt(req.params.id));
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/pets/:id/acariciar', async (req, res) => {
    try {
        const pet = await petService.acariciarPet(parseInt(req.params.id));
        res.json(pet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/pets/:id', async (req, res) => {
    try {
        const result = await petService.deletePet(parseInt(req.params.id));
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar todas las mascotas (solo admin)
router.delete('/pets', authenticateJWT, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Solo el admin puede eliminar todas las mascotas' });
    try {
        await petService.deleteAllPets();
        res.json({ message: 'Todas las mascotas eliminadas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 