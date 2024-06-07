import pool from "../config/db.js";

const addCourse = async ({ title, description }) => {
    const result = await pool.query(
        'INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING id',
        [title, description]
    );
    return { message: 'Course added', courseId: newCourse._id };
};

const getAllCourses = async () => {
    const result = await pool.query('SELECT id, title, description, created_at FROM courses');
    return courses;
};

const updateCourse = async (id, { title, description }) => {
    const result = await pool.query(
        'UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING id',
        [title, description, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Course not found' });
      }
    return { message: 'Course updated' };
};

const deleteCourse = async (id) => {
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return { message: 'Course deleted' };
};

const getCourse = async (id) => {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return course;
};

export default {
    addCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourse 
}