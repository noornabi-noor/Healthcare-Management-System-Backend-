import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedAdmin";
// import { prisma } from "./lib/prisma";
const port = envVars.PORT || 5000;

const bootstrap = async() => {
  try {
    await seedSuperAdmin();
    // await prisma.$connect();
    console.log("Connected to the database successfully!");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("An error occured", error);
    // await prisma.$disconnect();
    process.exit(1);
  }
};

bootstrap();
