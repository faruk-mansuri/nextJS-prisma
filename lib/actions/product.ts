"use server";

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
        Image: {
          create: product.images.map((url) => ({ url })),
        },
      },
    });

    return newProduct;
  } catch (error: any) {
    console.log("CREATE_PRODUCT_ERROR", error?.response);
    throw new Error("Error creating product");
  }
};

export const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Image: true,
        Review: true,
      },
    });
    return product;
  } catch (error) {
    return null;
  }
};
