import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { deleteData, fetchData } from "~/lib/clientFunctions";
import classes from "../../components/Product/product.module.css";
import ProductDetails from "../../components/Product/productDetails";
import GlobalModal from "../../components/Ui/Modal/modal";
import Spinner from "../../components/Ui/Spinner";
import { shimmer, toBase64 } from "../../lib/clientFunctions";

const ManageWishList = (props) => {
  const url = `/api/profile?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [wishlist, setWishlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const settings = useSelector((state) => state.settings);
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();

  useEffect(() => {
    if (data && data.user) {
      setWishlist(data.user.favorite);
    }
  }, [data]);

  const handleCloseModal = () => {
    router.push("/profile", undefined, { shallow: true });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  const removeFromWishlist = async (pid) => {
    try {
      const data = {
        pid,
        id: session.user.id,
      };
      const response = await deleteData(`/api/wishlist`, data);
      response.success
        ? (toast.success("Item has been removed from your wishlist"), mutate())
        : toast.error("Something went wrong (500)");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className="row">
          {wishlist.length === 0 && (
            <p className="text-center p-3">
              You have no items on your wishlist
            </p>
          )}
          {wishlist.map((item, idx) => {
            const discountInPercent =
              Math.round((100 - (item.discount * 100) / item.price) * 10) / 10;
            return (
              <div
                key={item._id}
                className={`${classes.item} col-lg-4 col-md-6 col-sm-6 col-12`}
              >
                <div className={classes.card}>
                  <Link href={`/product/${item.slug}`}>
                    <a>
                      <div className={classes.container}>
                        <Image
                          className={classes.image}
                          src={item.image[0].url}
                          alt={item.name}
                          width={300}
                          height={300}
                          layout="responsive"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(300, 300),
                          )}`}
                        />
                      </div>
                      {item.discount < item.price && (
                        <div className={classes.discount}>
                          -{discountInPercent}%
                        </div>
                      )}
                      <div className={classes.nameContainer}>
                        <div className={classes.name}>
                          <p>{item.name}</p>
                        </div>
                        <p
                          className={classes.unit}
                        >{`Stock : ${item.quantity}`}</p>
                        <div>
                          <p
                            className={
                              item.discount < item.price
                                ? classes.price_ori
                                : classes.price
                            }
                          >
                            {settings.settingsData.currency.symbol}&nbsp;
                            {item.price}
                          </p>
                          {item.discount < item.price && (
                            <p className={classes.price}>
                              {settings.settingsData.currency.symbol}&nbsp;
                              {item.discount}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  </Link>
                  <div className={classes.buttonContainer}>
                    <Link
                      href={`/profile?slug=${item.slug}`}
                      as={`/product/${item.slug}`}
                      scroll={false}
                      shallow={true}
                    >
                      <a className={classes.button}>ADD TO CART</a>
                    </Link>
                    <button onClick={() => removeFromWishlist(item._id)}>
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
};

export default ManageWishList;
