import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { HandCoins, PackageSearch, ShoppingBasket } from "lucide-react";
import Link from "next/link";

const whyus = [
  {icon: ShoppingBasket, description: 'Wide variety of products.'},
  {icon: PackageSearch, description: 'Fast delivery with package tracking.'},
  {icon: HandCoins, description: '15-day Money-back guarantee to all our products.'} 
]

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-5xl">
            Welcome to <span className="text-rose-500">NextJStore</span>. Your Next stop for shopping.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Please have a look on our awesome products.<br /> Every product is licensed and comes with a 2-year full guarantee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* buttonVariants() applies default styles of the button component. With parameters, the styles change */}
            <Link href='/products' className={buttonVariants()}>
              Start shopping now
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        {/* className property of MaxWidthWrapper component lets the addition of custom styles */}
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg-gap-x-8 lg:gap-y-0">
            {whyus.map((feature) => (
              <div key={feature.description} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    {<feature.icon className="w-1/2 h-1/2" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:mt-6">
                  <p className="mt-3 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>

      </section>
    </>
  );
}
