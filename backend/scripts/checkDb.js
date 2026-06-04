import { connectDatabase } from "../src/config/database.js";
import { User } from "../src/models/User.js";

try {
  await connectDatabase();
  await User.exists({});
  console.log("MongoDB connection OK");
  process.exit(0);
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
