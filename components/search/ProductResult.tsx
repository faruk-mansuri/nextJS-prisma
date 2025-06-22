"use client";
import Link from "next/link";

import Stars from "@/components/product/Stars";
import Image from "next/image";
import { useState } from "react";

export default function ProductResult({ product }: { product: any }) {
  const [img, setImg] = useState<string>(product?.images[0]?.url || "");
  return (
    <div className="bg-white border-2 rounded-lg shadow-sm dark:bg-gray-950 overflow-hidden">
      <Link className="block" href={`/product/view/${product.id}`}>
        <div className="relative w-full h-[200px]">
          <Image
            src={img || "/default-image.jpg"}
            fill
            alt="product"
            onError={() => {
              setImg("/default-image.jpg");
            }}
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating} />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              {product.rating}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
