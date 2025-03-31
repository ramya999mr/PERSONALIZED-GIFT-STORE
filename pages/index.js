import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
const Error500 = dynamic(() => import("~/components/error/500"));
const Header = dynamic(() => import("~/components/Header/header"));
const Banner = dynamic(() => import("~/components/Banner/banner"));
const CategoryList = dynamic(() =>
  import("~/components/Categories/categoriesList"),
);
const Collection = dynamic(() => import("~/components/Collection/collection"));
const ProductDetails = dynamic(() =>
  import("~/components/Product/productDetails"),
);
const ProductList = dynamic(() => import("~/components/ProductListView"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

function HomePage({ data, error }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    router.push("/", undefined, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData />
          <Header
            carousel={data.additional && data.additional.homePage.carousel}
          />
          <CategoryList categoryList={data.category} />
          <ProductList item={data.newProduct} title="New Products" />
          <div className="content_spacing" />
          <Banner banner={data.additional && data.additional.homePage.banner} />
          <ProductList item={data.trending} title="Trending Products" />
          <div className="content_spacing" />
          <Collection
            data={data.additional && data.additional.homePage.collection}
          />
          <ProductList item={data.bestSelling} title="Best Selling" />
          <div className="content_spacing" />
        </>
      )}
      <GlobalModal
        small={false}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
      >
        {router.query.slug && (
          <ProductDetails productSlug={router.query.slug} />
        )}
      </GlobalModal>
    </>
  );
}

HomePage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const data = await fetchData(`${origin}/api/home`);
      if (context.res) {
        context.res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59",
        );
      }
      setSettingsData(store, data);
      return {
        data,
        error: false,
      };
    } catch (error) {
      console.log(error);
      return {
        data: null,
        error,
      };
    }
  },
);

export default HomePage;
