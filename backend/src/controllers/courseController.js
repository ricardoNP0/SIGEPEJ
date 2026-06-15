import { ROLES } from "../constants/roles.js";
import { Course } from "../models/Course.js";
import "../models/Career.js";
import "../models/Subject.js";
import "../models/User.js";

function toCourseOption(course) {
  return {
    id: course._id,
    _id: course._id,
    code: course.code,
    subjectName: course.subject?.name || "Materia",
    subjectCode: course.subject?.code || "",
    parallel: course.parallel,
    period: course.period,
    teacherName: course.teacher
      ? `${course.teacher.firstName} ${course.teacher.lastName}`
      : "",
    teacherUsername: course.teacher?.username,
  };
}

export const getMyCourses = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.user.role === ROLES.TEACHER) {
      filter.teacher = req.user._id;
    }

    if ([ROLES.STUDENT, ROLES.SECRETARY, ROLES.DIRECTOR].includes(req.user.role) && req.user.career) {
      filter.career = req.user.career;
    }

    const courses = await Course.find(filter)
      .populate("subject", "name code")
      .populate("teacher", "firstName lastName username")
      .sort({ code: 1 });

    return res.json(courses.map(toCourseOption));
  } catch (error) {
    console.error("Error en getMyCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Error al obtener materias",
      error: error.message,
    });
  }
};
