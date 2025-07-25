import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

const SECRET = 'supersecreto';

export const login = async (req, res) => {
    let { id, password } = req.body;
    // Admin
    if (id === 'admin123' && password === 'admin123') {
        const role = 'admin';
        const token = jwt.sign({ id: 'admin123', role }, SECRET, { expiresIn: '1h' });
        return res.json({ token, role });
    }
    // Usuario normal
    const users = await userRepository.getUsers();
    const user = users.find(u => u.id === id && u.password === password);
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    const role = 'user';
    const token = jwt.sign({ id, role }, SECRET, { expiresIn: '1h' });
    res.json({ token, role });
}; 