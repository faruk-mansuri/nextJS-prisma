"use server";

import { unstable_cache as cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

export const createProduct = async (product: CreateProductInput) => {
  try {
    const newProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: {
          create: product.images?.map((url) => ({ url })),
        },
      },
    });

    return newProduct;
  } catch (error: any) {
    console.log("CREATE_PRODUCT_ERROR", error?.response);
    throw new Error("Error creating product");
  }
};

async function _getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
}

export const getProductById = cache(_getProductById, ["getProductById"], {
  tags: ["Product"],
  revalidate: 60, // Re-fetch the data every 60 seconds
});

export const updateProduct = async (
  id: number,
  product: CreateProductInput
) => {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        images: {
          deleteMany: {},
          create: product.images?.map((url) => ({ url })),
        },
      },
    });

    // Mark the data as stale, and re-fetch it from the database
    revalidateTag("Product");
    return updatedProduct;
  } catch (error) {
    return null;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await prisma.product.delete({
      where: { id },
    });
    // Mark the data as stale, and re-fetch it from the database
    revalidateTag("Product");
    return true;
  } catch (error) {
    return false;
  }
};

export const getAllProducts = async ({
  page = 1,
  name,
  minPrice,
  category,
}: {
  page?: number;
  name?: string;
  minPrice?: string;
  category?: string;
}) => {
  try {
    const resultPerPage = 5;
    const skip = (page - 1) * resultPerPage;

    const where: any = {};
    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }
    if (category && category !== "all") {
      where.category = {
        equals: category,
      };
    }
    if (minPrice) {
      where.price = {
        gte: parseInt(minPrice),
      };
    }

    const allProducts = await prisma.product.findMany({
      where,
      include: {
        images: true,
        reviews: true,
      },
      skip,
      take: resultPerPage,
    });

    const products = allProducts.map((product) => ({
      ...product,
      rating:
        Math.floor(
          product.reviews.reduce((acc, review) => acc + review.rating, 0) /
            product.reviews.length
        ) || 0,
      image: product.images[0]?.url,
    }));

    return products;
  } catch (error: any) {
    console.log("Error Get All Product.", error);
    return [];
  }
};

export const insertRawData = async () => {
  try {
    const products = [
      {
        name: "Laptop",
        price: 1299.99,
        description: "High-performance laptop for professionals",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "David Lee",
              rating: 5,
              content: "Excellent performance and battery life.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
            },
          ],
        },
      },
      {
        name: "Yoga Mat",
        price: 29.99,
        description: "Non-slip yoga mat for all types of exercises",
        category: "Sports",
        reviews: {
          create: [
            {
              name: "Emily Clark",
              rating: 4,
              content: "Good quality, but a bit thin.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
            },
          ],
        },
      },
      {
        name: "Winter Coat",
        price: 149.99,
        description: "Warm and stylish winter coat",
        category: "Clothing",
        reviews: {
          create: [
            {
              name: "Sophia Martinez",
              rating: 5,
              content: "Keeps me warm even in the coldest weather.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/374874/pexels-photo-374874.jpeg",
            },
          ],
        },
      },
      {
        name: "Dining Table",
        price: 499.99,
        description: "Elegant dining table for your home",
        category: "Home",
        reviews: {
          create: [
            {
              name: "Chris Evans",
              rating: 4,
              content: "Beautiful design, but assembly was tricky.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276551/pexels-photo-276551.jpeg",
            },
          ],
        },
      },
      {
        name: "Bluetooth Speaker",
        price: 59.99,
        description: "Portable Bluetooth speaker with excellent sound quality",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "Laura Wilson",
              rating: 5,
              content: "Great sound quality and battery life.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/37347/pexels-photo.jpg",
            },
          ],
        },
      },
      {
        name: "Gaming Chair",
        price: 299.99,
        description: "Ergonomic gaming chair with adjustable features",
        category: "Furniture",
        reviews: {
          create: [
            {
              name: "Kevin Brown",
              rating: 5,
              content: "Very comfortable for long gaming sessions.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
            },
          ],
        },
      },
      {
        name: "Smartwatch",
        price: 199.99,
        description: "Smartwatch with fitness tracking and notifications",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "Olivia Taylor",
              rating: 4,
              content: "Good features, but battery life could be better.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
            },
          ],
        },
      },
      {
        name: "Electric Kettle",
        price: 49.99,
        description: "Fast-boiling electric kettle with auto shut-off",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Daniel Harris",
              rating: 5,
              content: "Boils water quickly and safely.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Wireless Earbuds",
        price: 99.99,
        description: "Wireless earbuds with noise cancellation",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "Emma White",
              rating: 5,
              content: "Excellent sound quality and noise cancellation.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/37347/pexels-photo.jpg",
            },
          ],
        },
      },
      {
        name: "Coffee Maker",
        price: 79.99,
        description: "Programmable coffee maker with multiple brew settings",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "James Green",
              rating: 4,
              content: "Makes great coffee, but a bit noisy.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Electric Toothbrush",
        price: 59.99,
        description: "Electric toothbrush with multiple brushing modes",
        category: "Personal Care",
        reviews: {
          create: [
            {
              name: "Sophia Martinez",
              rating: 5,
              content: "Cleans teeth thoroughly and gently.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/37347/pexels-photo.jpg",
            },
          ],
        },
      },
      {
        name: "Air Purifier",
        price: 149.99,
        description: "Air purifier with HEPA filter for clean air",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Michael Johnson",
              rating: 4,
              content: "Works well, but a bit loud.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Fitness Tracker",
        price: 49.99,
        description: "Fitness tracker with heart rate monitor",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "Emily Clark",
              rating: 4,
              content: "Tracks fitness accurately, but screen is small.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
            },
          ],
        },
      },
      {
        name: "Blender",
        price: 39.99,
        description: "High-speed blender for smoothies and shakes",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Sarah Brown",
              rating: 5,
              content: "Blends everything smoothly and quickly.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Desk Lamp",
        price: 29.99,
        description: "LED desk lamp with adjustable brightness",
        category: "Home",
        reviews: {
          create: [
            {
              name: "John Doe",
              rating: 4,
              content: "Good lighting, but the base is a bit wobbly.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
            },
          ],
        },
      },
      {
        name: "Electric Grill",
        price: 79.99,
        description: "Electric grill for indoor and outdoor use",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Jane Smith",
              rating: 5,
              content: "Grills food evenly and quickly.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Smart Thermostat",
        price: 199.99,
        description: "Smart thermostat with remote control",
        category: "Home",
        reviews: {
          create: [
            {
              name: "Alice Brown",
              rating: 4,
              content: "Easy to use, but installation was tricky.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
            },
          ],
        },
      },
      {
        name: "Electric Shaver",
        price: 49.99,
        description: "Electric shaver with multiple attachments",
        category: "Personal Care",
        reviews: {
          create: [
            {
              name: "Michael Johnson",
              rating: 5,
              content: "Shaves smoothly and comfortably.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
            },
          ],
        },
      },
      {
        name: "Air Fryer",
        price: 99.99,
        description: "Air fryer for healthy cooking",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "David Lee",
              rating: 4,
              content: "Cooks food well, but a bit small.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Robot Vacuum",
        price: 299.99,
        description: "Robot vacuum with smart navigation",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Emily Clark",
              rating: 5,
              content: "Cleans thoroughly and efficiently.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
            },
          ],
        },
      },
      {
        name: "Smart Light Bulb",
        price: 19.99,
        description: "Smart light bulb with color changing",
        category: "Home",
        reviews: {
          create: [
            {
              name: "Sophia Martinez",
              rating: 4,
              content: "Easy to control, but a bit dim.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
            },
          ],
        },
      },
      {
        name: "Electric Toothbrush",
        price: 59.99,
        description: "Electric toothbrush with multiple brushing modes",
        category: "Personal Care",
        reviews: {
          create: [
            {
              name: "Sophia Martinez",
              rating: 5,
              content: "Cleans teeth thoroughly and gently.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/37347/pexels-photo.jpg",
            },
          ],
        },
      },
      {
        name: "Air Purifier",
        price: 149.99,
        description: "Air purifier with HEPA filter for clean air",
        category: "Home Appliances",
        reviews: {
          create: [
            {
              name: "Michael Johnson",
              rating: 4,
              content: "Works well, but a bit loud.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
            },
          ],
        },
      },
      {
        name: "Fitness Tracker",
        price: 49.99,
        description: "Fitness tracker with heart rate monitor",
        category: "Electronics",
        reviews: {
          create: [
            {
              name: "Emily Clark",
              rating: 4,
              content: "Tracks fitness accurately, but screen is small.",
            },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg",
            },
          ],
        },
      },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }
  } catch (error) {
    console.log("ERROR", error);
  }
};
