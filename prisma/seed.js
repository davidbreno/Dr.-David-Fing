import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  for (let i = 0; i < months.length; i++) {
    await prisma.metric.upsert({
      where: { monthIndex: i },
      create: {
        month: months[i],
        monthIndex: i,
        value2022: 3 + Math.floor(Math.random() * 7),
        value2023: 4 + Math.floor(Math.random() * 7),
        value2024: 5 + Math.floor(Math.random() * 7)
      },
      update: {}
    });
  }
  console.log("Seeded.");
}

main().finally(async () => await prisma.$disconnect());
