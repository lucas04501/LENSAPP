const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function testRegistration() {
  const name = "Test User";
  const username = "testuser" + Date.now();
  const email = "test" + Date.now() + "@example.com";
  const password = "password123";

  console.log("Testing registration logic...");

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });
    console.log("Success! Created user:", user.id);
  } catch (error) {
    console.error("Failure during registration logic:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testRegistration();
