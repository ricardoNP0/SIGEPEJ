import { Career } from "../models/Career.js";
import { Subject } from "../models/Subject.js";
import { Course } from "../models/Course.js";
import { AuditLog } from "../models/AuditLog.js";

// GET - Careers
export async function getCareers(req, res) {
  try {
    const careers = await Career.find({}).populate("director", "firstName lastName code");
    return res.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return res.status(500).json({ message: "Error al obtener carreras" });
  }
}

// POST - Create Career
export async function createCareer(req, res) {
  try {
    const { code, name, director } = req.body;
    if (!code || !name) {
      return res.status(400).json({ message: "Código y Nombre son obligatorios" });
    }

    const existing = await Career.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Ya existe una carrera con ese código" });
    }

    const career = await Career.create({
      code: code.toUpperCase().trim(),
      name,
      director: director || undefined
    });

    await AuditLog.create({
      actor: req.user?._id,
      action: "crear_carrera",
      entityType: "Career",
      entityId: career._id,
      metadata: { code: career.code, name: career.name }
    });

    return res.status(201).json(career);
  } catch (error) {
    console.error("Error creating career:", error);
    return res.status(500).json({ message: "Error al crear carrera" });
  }
}

// GET - Subjects
export async function getSubjects(req, res) {
  try {
    const subjects = await Subject.find({}).populate("career", "name code");
    return res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return res.status(500).json({ message: "Error al obtener materias" });
  }
}

// POST - Create Subject
export async function createSubject(req, res) {
  try {
    const { code, name, career, semester } = req.body;
    if (!code || !name || !career || !semester) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existing = await Subject.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Ya existe una materia con ese código" });
    }

    const subject = await Subject.create({
      code: code.toUpperCase().trim(),
      name,
      career,
      semester: Number(semester)
    });

    await AuditLog.create({
      actor: req.user?._id,
      action: "crear_materia",
      entityType: "Subject",
      entityId: subject._id,
      metadata: { code: subject.code, name: subject.name }
    });

    return res.status(201).json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    return res.status(500).json({ message: "Error al crear materia" });
  }
}

// GET - Courses
export async function getCourses(req, res) {
  try {
    const courses = await Course.find({})
      .populate("subject", "name code")
      .populate("career", "name code")
      .populate("teacher", "firstName lastName code");
    return res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Error al obtener paralelos/cursos" });
  }
}

// POST - Create Course
export async function createCourse(req, res) {
  try {
    const { code, subject, career, teacher, parallel, period, schedule } = req.body;
    if (!code || !subject || !career || !teacher || !parallel || !period) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const existing = await Course.findOne({ code: code.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "Ya existe un curso/paralelo con ese código" });
    }

    const course = await Course.create({
      code: code.toUpperCase().trim(),
      subject,
      career,
      teacher,
      parallel: parallel.toUpperCase().trim(),
      period,
      schedule: schedule || []
    });

    await AuditLog.create({
      actor: req.user?._id,
      action: "crear_paralelo",
      entityType: "Course",
      entityId: course._id,
      metadata: { code: course.code, parallel: course.parallel }
    });

    return res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({ message: "Error al crear curso/paralelo" });
  }
}
