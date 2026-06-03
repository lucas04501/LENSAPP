import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUserSizes() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      bio: true,
      avatarUrl: true,
    }
  });

  console.log("--- User Data Size Check ---");
  users.forEach(user => {
    const bioSize = user.bio ? Buffer.byteLength(user.bio, 'utf8') : 0;
    const avatarSize = user.avatarUrl ? Buffer.byteLength(user.avatarUrl, 'utf8') : 0;
    
    console.log(`User: ${user.email}`);
    console.log(` - Bio size: ${bioSize} bytes`);
    console.log(` - AvatarUrl size: ${avatarSize} bytes`);
    
    if (bioSize > 2000 || avatarSize > 2000) {
      console.log(` !!! WARNING: Large data detected for ${user.email}`);
    }
  });
}

checkUserSizes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
