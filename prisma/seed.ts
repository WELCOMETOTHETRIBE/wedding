import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
    },
  })

  console.log("Created admin user:", admin.email)

  // Create events
  const ceremony = await prisma.event.upsert({
    where: { icsUid: "ceremony-001" },
    update: {},
    create: {
      title: "Ceremony",
      description: "Join us as we exchange vows and begin our journey together.",
      start: new Date("2024-06-15T16:00:00Z"),
      end: new Date("2024-06-15T17:00:00Z"),
      locationName: "Garden Venue",
      address: "123 Wedding Lane, City, State 12345",
      mapUrl: "https://maps.google.com/?q=123+Wedding+Lane",
      icsUid: "ceremony-001",
    },
  })

  const reception = await prisma.event.upsert({
    where: { icsUid: "reception-001" },
    update: {},
    create: {
      title: "Reception",
      description: "Celebrate with dinner, dancing, and cake!",
      start: new Date("2024-06-15T18:00:00Z"),
      end: new Date("2024-06-16T00:00:00Z"),
      locationName: "Reception Hall",
      address: "123 Wedding Lane, City, State 12345",
      mapUrl: "https://maps.google.com/?q=123+Wedding+Lane",
      icsUid: "reception-001",
    },
  })

  console.log("Created events:", ceremony.title, reception.title)

  // Create gallery
  const gallery = await prisma.gallery.upsert({
    where: { id: "gallery-001" },
    update: {},
    create: {
      id: "gallery-001",
      title: "Engagement Photos",
      description: "Our favorite moments from our engagement",
      isPublic: true,
    },
  })

  console.log("Created gallery:", gallery.title)

  // Create registry items
  const registry1 = await prisma.registryItem.upsert({
    where: { id: "registry-001" },
    update: {},
    create: {
      id: "registry-001",
      title: "Amazon",
      description: "Our Amazon wedding registry",
      externalUrl: "https://www.amazon.com/wedding-registry",
      type: "EXTERNAL",
      sort: 1,
    },
  })

  const registry2 = await prisma.registryItem.upsert({
    where: { id: "registry-002" },
    update: {},
    create: {
      id: "registry-002",
      title: "Crate & Barrel",
      description: "Home essentials from Crate & Barrel",
      externalUrl: "https://www.crateandbarrel.com/wedding-registry",
      type: "EXTERNAL",
      sort: 2,
    },
  })

  const cashGift = await prisma.registryItem.upsert({
    where: { id: "registry-cash" },
    update: {},
    create: {
      id: "registry-cash",
      title: "Cash Gift",
      description: "If you prefer to give a cash gift, you can contribute any amount.",
      type: "CASH",
      sort: 3,
    },
  })

  console.log("Created registry items")

  // Create sample RSVP
  const sampleRSVP = await prisma.rSVP.create({
    data: {
      name: "Sample Guest",
      email: "guest@example.com",
      partySize: 2,
      attending: true,
      mealPreference: "Beef",
      notes: "Looking forward to celebrating!",
    },
  })

  console.log("Created sample RSVP")

  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

