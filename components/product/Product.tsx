import type { Image, Product, Review } from "@prisma/client";
import Stars from "@/components/product/Stars";
import ImageDisplay from "@/components/product/ImageDisplay";

export interface ProductViewProps extends Product {
  reviews: Review[];
  images: Image[];
}

export default function ProductView({
  product,
}: {
  product: ProductViewProps;
}) {
  if (!product)
    return (
      <div className="h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-3xl">Product not found.</h1>
      </div>
    );

  // Calculate the average score of the product
  const totalScore = product.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const averageScore = Math.floor(totalScore / product.reviews.length);

  const imageUrls = product.images.map((image) => image.url);
  return (
    <div className="grid gap-6">
      <ImageDisplay imageUrls={imageUrls} />
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">${product.price}</span>
          <div className="flex items-center gap-0.5">
            <Stars rating={averageScore} />
          </div>
        </div>
      </div>
    </div>
  );
}
