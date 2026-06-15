import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { Request } from "../src/models/Request.js";
import { User } from "../src/models/User.js";

async function run() {
  await connectDatabase();
  console.log("Connected to MongoDB");
  
  const requests = await Request.find({}).populate("requester");
  console.log(`Found ${requests.length} requests in the database:`);
  for (const r of requests) {
    console.log({
      id: r._id,
      code: r.code,
      status: r.status,
      requesterUsername: r.requester?.username,
      requesterRole: r.requesterRole,
      createdAt: r.createdAt
    });
  }

  await mongoose.disconnect();
}

run().catch(console.error);
