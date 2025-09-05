import app from './app.js';
import { connectDB } from './config/db.js';
import 'dotenv/config';

const port = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(port, () => console.log(`http://localhost:${port}/api-docs`));
});
