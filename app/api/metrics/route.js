import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.metric.findMany({
    orderBy: { monthIndex: "asc" }
  });
  return new Response(JSON.stringify(items), { headers: { "content-type": "application/json" } });
}

export async function POST(req) {
  const data = await req.json();
  // why: simple upsert to demo writes
  const item = await prisma.metric.upsert({
    where: { monthIndex: data.monthIndex },
    update: { value2022: data.value2022, value2023: data.value2023, value2024: data.value2024 },
    create: data
  });
  return new Response(JSON.stringify(item), { headers: { "content-type": "application/json" } });
}
