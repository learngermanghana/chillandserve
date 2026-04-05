import GroupedServices from "@/components/grouped-services";
import ServicesGrid from "@/components/services-grid";
import { getHomePageData, groupProductsByCategory } from "@/lib/sedifex";

export default async function ServicesPage() {
  const { products } = await getHomePageData();
  const groupedProducts = groupProductsByCategory(products);

  return (
    <main>
      <ServicesGrid products={products} />
      <GroupedServices groups={groupedProducts} />
    </main>
  );
}
