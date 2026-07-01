import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";


const PORT = process.env.PORT || 8000;

connectDB()
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
        process.exit(1); // Exit the process with an error code
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})