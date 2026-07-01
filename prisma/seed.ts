import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.product.deleteMany();

    await prisma.product.createMany({
        data: [
            {
                name: "Wireless Keyboard",
                category: "Electronics",
                price: 49.99,
                inStock:  true,
            },
            {
                name: "Charger",
                category: "Electronics",
                price: 15.99, 
                inStock: true,
            },
            {
                name: "Notebook",
                category: "Office",
                price: 12.50, 
                inStock: true,        
            },
            {
                name: "Water Bottle",
                category: "Lifestyle",
                price: 18.99, 
                inStock: false, 
            },
            {
                name: "Desk Lamp",
                category: "Office",
                price: 35.99, 
                inStock: true, 
            },
            {
                name: "Backpack",
                category: "Lifestyle",
                price: 45.99, 
                inStock: true, 
            },
             {
                name: "Frying Pan",
                category: "Cooking",
                price: 29.99, 
                inStock: false, 
            },
        ]
    });
    console.log("Seeded products");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });