import pool from "../config/db.js";

const setUserCourse = async ({ userId, courseId }) => {
  const result = await pool.query(
    'INSERT INTO user_courses (user_id, course_id) VALUES ($1, $2) RETURNING id',
    [userId, courseId]
  );
  return { message: 'Course set for user' };
};

const getUserCourses = async (userId) => {
  const result = await pool.query(
    'SELECT courses.id, courses.title, courses.description, courses.created_at FROM user_courses JOIN courses ON user_courses.course_id = courses.id WHERE user_courses.user_id = $1',
    [req.user.id]
  );
  return result.rows
  // return userCourses.map(uc => ({
  //   id: uc.courseId._id,
  //   title: uc.courseId.title,
  //   description: uc.courseId.description,
  //   createdAt: uc.courseId.createdAt
  // }));
};

const deleteUserCourse = async (userId, courseId) => {
  const result = await pool.query(
    'DELETE FROM user_courses WHERE user_id = $1 AND course_id = $2 RETURNING id',
    [userId, courseId]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'User course not found' });
  }
  return { message: 'User course deleted' };
};

export default {
    setUserCourse, 
    getUserCourses, 
    deleteUserCourse
}