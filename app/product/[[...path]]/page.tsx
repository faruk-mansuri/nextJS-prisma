import AddReview from "@/components/product/AddReview";
import Product from "@/components/product/Product";
import Review from "@/components/product/Review";
import AddProduct from "@/components/product/AddProduct";
import DeleteProduct from "@/components/delete/DeleteProduct";
import { getProductById } from "@/lib/actions/product";
import { ScrollArea } from "@/components/ui/scroll-area";

export const revalidate = 1;

export default async function Page({ params }: { params: { path: string[] } }) {
  const method = params.path[0];
  const id = params.path[1];

  if (method === "new") return <AddProduct />;

  const product = await getProductById(parseInt(id));

  if (!product)
    return (
      <div className="h-screen flex justify-center items-center bg-slate-100">
        <h1 className="text-3xl">Product not found.</h1>
      </div>
    );

  if (method === "edit") return <AddProduct edit id={id} product={product} />;

  if (method === "delete") return <DeleteProduct id={id} />;

  return (
    <div className="pt-20 grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4">
      <Product product={product} />
      <div className="flex flex-col gap-y-5">
        <span className="text-2xl font-bold h-fit">Customer Reviews</span>
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="grid gap-5 w-full p-2">
            {product.reviews.map((review) => {
              return <Review key={review.id} review={review} />;
            })}
          </div>
        </ScrollArea>
        {/* <div className="grid gap-5">
          {product.reviews.map((review) => {
            return <Review key={review.id} review={review} />;
          })}
        </div> */}
      </div>
      <div className="md:col-span-2">
        <AddReview id={id} />
      </div>
    </div>
  );
}
