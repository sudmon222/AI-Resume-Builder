import mongoose from "mongoose";

const buildMongoUri = (rawUri, dbName) => {
  if (!rawUri) {
    throw new Error("MONGODB_URI environment variable not set");
  }

  const trimmedUri = rawUri.trim();
  const queryIndex = trimmedUri.indexOf("?");
  const baseUri = queryIndex === -1 ? trimmedUri : trimmedUri.slice(0, queryIndex);
  const queryString = queryIndex === -1 ? "" : trimmedUri.slice(queryIndex);
  const cleanBaseUri = baseUri.endsWith("/") ? baseUri.slice(0, -1) : baseUri;

  return `${cleanBaseUri}/${dbName}${queryString}`;
};

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    const projectName = "Resume-Builder";
    const mongodbURI = buildMongoUri(process.env.MONGODB_URI, projectName);

    await mongoose.connect(mongodbURI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDb;
