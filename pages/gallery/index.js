import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "~/styles/gallery.module.css";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const SidebarList = dynamic(() => import("~/components/Sidebar/sidebarList"));
const ProductList = dynamic(() => import("~/components/Product/productList"));
const ProductDetails = dynamic(() =>
  import("~/components/Product/productDetails"),
);

function GalleryPage() {
  const router = useRouter();
  const { category } = router.query;
  const query = category ? decodeURI(category) : "";
  const url = `/api/gallery?category=${query}`;
  const { data, error } = useSWR(url, fetchData);
  const [productItemList, setProductItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productLength, setProductLength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (data && data.product && data.category) {
      setProductItemList(data.product);
      setProductLength(data.product_length);
    }
  }, [data]);

  const updateQuery = async (name) => {
    setLoading(true);
    try {
      const query = encodeURI(name);
      // router.push(`/gallery?category=${query}`,null, { shallow: true });
      const response = await fetchData(`/api/gallery?category=${query}`);
      setProductItemList(response.product);
      setProductLength(response.product_length);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleCloseModal = () => {
    router.push("/gallery", undefined, { shallow: true });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  return (
    <>
      <HeadData />
      <div style={{ height: "100vh" }}>
        {error ? (
          <div className="text-center text-danger">failed to load</div>
        ) : !data ? (
          <Spinner />
        ) : (
          <div className="row">
            <SidebarList
              category={data.category}
              update={updateQuery}
              query={query}
            />
            <div className={classes.gallery_container}>
              {!loading && productItemList.length === 0 ? (
                <div className="m-5 p-5">
                  <p className="text-center">No Product Found :(</p>
                </div>
              ) : !loading ? (
                <ProductList
                  productList={productItemList}
                  data_length={productLength}
                />
              ) : (
                <div style={{ height: "80vh" }}>
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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

GalleryPage.footer = false;

GalleryPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const url = `${origin}/api/home/settings`;
      const data = await fetchData(url);
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

export default GalleryPage;
