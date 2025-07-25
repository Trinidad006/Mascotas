import express from "express";
import { check, validationResult } from 'express-validator';
import * as userService from "../services/userServices.js";
import User from "../models/heroModel.js";

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get("/users", async (req, res) => {
    // Aquí luego se puede agregar lógica para que solo el admin vea todos
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear usuario
router.post("/users",
    [
        check('id').not().isEmpty().withMessage('El id es requerido'),
        check('password').not().isEmpty().withMessage('La contraseña es requerida')
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.array() })
        }
        try {
            const { id, password, name, email } = req.body;
            const newUser = { id, password, name, email };
            const addedUser = await userService.addUser(newUser);
            res.status(201).json(addedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// ... otros endpoints de usuario ...

export default router;
  