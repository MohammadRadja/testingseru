import express from "express";
import dotenv from "dotenv";
import authRoute from "./prisma/routes/authRoutes/authRoute.js";
import brandsRoute from "./prisma/routes/dataRoutes/brandsRoute.js";
import typesRoute from "./prisma/routes/dataRoutes/typesRoute.js";
import modelsRoute from "./prisma/routes/dataRoutes/modelsRoute.js";
import yearsRoute from "./prisma/routes/dataRoutes/yearsRoute.js";
import priceRoute from "./prisma/routes/dataRoutes/priceRoute.js";
import categoryRoute from "./prisma/routes/dataRoutes/categoryRoute.js";
import featureRoute from "./prisma/routes/dataRoutes/featureRoute.js";
import spekRoute from "./prisma/routes/dataRoutes/spekRoute.js";
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT; // Menentukan port default jika tidak ada di .env

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware logging
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

// Use routes
app.use("/", authRoute);
app.use("/", brandsRoute);
app.use("/", typesRoute);
app.use("/", modelsRoute);
app.use("/", yearsRoute);
app.use("/", priceRoute);
app.use("/", categoryRoute);
app.use("/", featureRoute);
app.use("/", spekRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
