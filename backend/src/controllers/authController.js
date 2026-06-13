import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

function buildUserPayload(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    code: user.code,
    career: user.career,
  };
}

export const login = async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.username || req.body.email;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario/correo y contraseña son obligatorios",
      });
    }

    const user = await User.findOne({
      $or: [
        { username: String(identifier).toLowerCase() },
        { email: String(identifier).toLowerCase() },
      ],
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign({ userId: user._id }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    return res.json({
      success: true,
      token,
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};
