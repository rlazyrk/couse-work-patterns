import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import provider from "./src/repository/index.js";


import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import bouquetRoutes from "./src/routes/bouquet.routes.js";
import flowerRoutes from "./src/routes/flower.routes.js";
import eventTypeRoutes from "./src/routes/eventType.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import clientCardRoutes from "./src/routes/clientCard.routes.js";
import deliveryRoutes from "./src/routes/delivery.routes.js";
import packagingRoutes from "./src/routes/packaging.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = provider.prisma;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bouquets", bouquetRoutes);
app.use("/api/flowers", flowerRoutes);
app.use("/api/event-types", eventTypeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/client-cards", clientCardRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/packaging", packagingRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});

app.listen(PORT, () => {
  console.log(`server run successfuly on http://localhost:${PORT}`);
});
