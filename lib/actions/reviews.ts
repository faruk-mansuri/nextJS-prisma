"use server";

import { revalidateTag } from "next/cache";
import prisma from "../prisma";

interface CreateReviewInput {
  name: string;
  content: string;
  rating: number;
  productId: number;
}

export const createReview = async (input: CreateReviewInput) => {
  try {
    const newReview = await prisma.review.create({
      data: {
        name: input.name,
        content: input.content,
        rating: input.rating,
        product: {
          connect: {
            id: input.productId,
          },
        },
      },
    });
    // simply revalidate our product cache, and
    // we'll refetch the product with the new review
    revalidateTag("Product");
    return newReview;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Error creating product");
  }
};
