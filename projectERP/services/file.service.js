import pool from "../config/db.js";

const uploadFile = async (req) => {
    const { filename, filepath } = req.body;
    const result = await pool.query(
        'INSERT INTO files (filename, filepath) VALUES ($1, $2) RETURNING id',
        [filename, filepath]
    );
    return { message: 'File uploaded', fileId: newFile._id };
};

const listFiles = async () => {
    const result = await pool.query('SELECT id, filename, created_at FROM files');
    return result;
};

const deleteFile = async (id) => {
    const result = await pool.query('DELETE FROM files WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return { message: 'File not found' };
    }
    return { message: 'File deleted' };
};

const getFile = async (fileId) => {
    const result = await pool.query('SELECT * FROM files WHERE id = $1', [fileId]);
    if (result.rows.length === 0) {
      return { message: 'File not found' };
    }
    return result;
};

const updateFile = async (id, filename) => {
    const result = await pool.query('UPDATE files SET filename = $1 WHERE id = $2 RETURNING id', [filename, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }
    return { message: 'File updated' };
};

export default {
    uploadFile, 
    listFiles, 
    deleteFile, 
    getFile, 
    updateFile
}