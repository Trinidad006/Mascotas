import jwt from 'jsonwebtoken';
import * as heroRepository from '../repositories/heroRepository.js';

const SECRET = 'supersecreto';

export const login = async (req, res) => {
    const { heroId, password } = req.body;
    if (heroId === 1 && password === 'admin123') {
        // Login admin
        const token = jwt.sign({ heroId: 1, role: 'admin' }, SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    // Login usuario normal
    const heroes = await heroRepository.getHeroes();
    const heroExists = heroes.some(hero => hero.id === heroId);
    if (!heroExists) return res.status(401).json({ error: 'Superhéroe no encontrado' });
    const token = jwt.sign({ heroId, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.json({ token });
}; 