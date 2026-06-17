import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AuditLog } from "../models/AuditLog.js";

// GET - List all users
export async function getUsers(req, res) {
  try {
    const users = await User.find({})
      .populate("career", "name code")
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
}

// POST - Create user
export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, username, role, code, career, phone } = req.body;

    if (!firstName || !lastName || !email || !username || !role) {
      return res.status(400).json({ message: "Por favor, complete todos los campos obligatorios" });
    }

    const emailLower = email.toLowerCase().trim();
    const usernameLower = username.toLowerCase().trim();

    // Check if user or email exists
    const existing = await User.findOne({
      $or: [
        { email: emailLower },
        { username: usernameLower }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "El usuario o correo electrónico ya está registrado" });
    }

    // Default password is password123
    const passwordHash = await bcrypt.hash("password123", 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email: emailLower,
      username: usernameLower,
      passwordHash,
      role,
      code: code ? code.trim() : undefined,
      career: career || undefined,
      phone
    });

    // Write audit log
    await AuditLog.create({
      actor: req.user?._id,
      action: "crear_usuario",
      entityType: "User",
      entityId: newUser._id,
      metadata: { username: newUser.username, role: newUser.role }
    });

    return res.status(201).json(newUser);

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error al crear usuario" });
  }
}

// PATCH - Update user role
export async function updateUserRole(req, res) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Debe especificar el nuevo rol" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Write audit log
    await AuditLog.create({
      actor: req.user?._id,
      action: "cambiar_rol",
      entityType: "User",
      entityId: user._id,
      metadata: { username: user.username, oldRole, newRole: role }
    });

    return res.json(user);

  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Error al actualizar rol" });
  }
}

// PATCH - Update user active status
export async function updateUserStatus(req, res) {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({ message: "Debe especificar el estado de activación" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = isActive;
    await user.save();

    // Write audit log
    await AuditLog.create({
      actor: req.user?._id,
      action: isActive ? "desbloquear_usuario" : "bloquear_usuario",
      entityType: "User",
      entityId: user._id,
      metadata: { username: user.username }
    });

    return res.json(user);

  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Error al actualizar estado" });
  }
}
