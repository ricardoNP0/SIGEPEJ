import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { env } from "../config/env.js";

export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Por favor, complete todos los campos" });
    }

    // Buscar por username o email
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase().trim() },
        { email: identifier.toLowerCase().trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Acceso bloqueado por el administrador" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Firmar token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        code: user.code
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error en el servidor al iniciar sesión" });
  }
}

export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    return res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        code: req.user.code
      }
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return res.status(500).json({ message: "Error al obtener perfil" });
  }
}
