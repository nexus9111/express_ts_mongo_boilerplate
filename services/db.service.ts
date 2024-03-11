import mongoose, { ConnectOptions } from "mongoose";
import { Service } from "typedi";
import { logger } from "../config/logger";
import { MONGO_URL } from "../config/variables";

@Service()
class DBService {
  public async connect(): Promise<void> {
    mongoose.Promise = global.Promise;
    mongoose.set("strictQuery", false);

    if (!MONGO_URL) {
      logger.error("❌ Mongo variables missing");
      throw new Error("❌ Mongo variables missing");
    }

    const URL = MONGO_URL;

    try {
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
    } catch (error) {
      throw new Error("❌ MongoDB connection error: " + error);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info("✅ MongoDB disconnected");
    } catch (error) {
      logger.error("❌ MongoDB disconnection error: " + error);
      throw new Error("❌ MongoDB disconnection error: " + error);
    }
  }
}

const dbService = new DBService();

export { dbService };
