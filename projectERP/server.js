import app from './app.js';
import dotenv from "dotenv";
import createModels from './models/model.create.js';

createModels()
dotenv.config()

const PORT = process.env.PORT || 5000;
app.listen(PORT, "192.168.77.113", () => console.log(`Server running on port ${PORT}`));