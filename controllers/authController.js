import jwt from 'jsonwebtoken';
import * as heroRepository from '../repositories/heroRepository.js';

const SECRET = 'supersecreto';

export const login = async (req, res) => {
    let { heroId, password } = req.body;
    // Si el heroId es '1a' (string alfanumérico) y el password es correcto, es admin
    if (heroId === '1a' && password === 'admin123') {
        const role = 'admin';
        const token = jwt.sign({ heroId: '1a', role }, SECRET, { expiresIn: '1h' });
        return res.json({ token, role });
    }
    // Login usuario normal
    const heroes = await heroRepository.getHeroes();
    const heroExists = heroes.some(hero => hero.id == heroId); // == para permitir string o número
    if (!heroExists) return res.status(401).json({ error: 'Superhéroe no encontrado' });
    const role = 'user';
    const token = jwt.sign({ heroId, role }, SECRET, { expiresIn: '1h' });
    res.json({ token, role });
}; 