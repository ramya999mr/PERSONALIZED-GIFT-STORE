import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { fetchData } from "~/lib/clientFunctions";
import Product from "./product";
import classes from "./productList.module.css";

function ProductList(props) {
  const [product, setProduct] = useState(props.productList);

  const notify = (message) =>
    toast.error(message, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  useEffect(() => {
    setProduct(props.productList);
  }, [props.productList]);

  const moreProduct = async () => {
    await fetchData(
      `/api/gallery/more-product?product_length=${product.length}`,
    )
      .then((data) => {
        setProduct([...product, ...data]);
      })
      .catch((err) => {
        console.error(err);
        notify("Something went wrong...");
      });
  };

  return (
    <div className={classes.list}>
      <InfiniteScroll
        dataLength={product.length}
        next={moreProduct}
        hasMore={product.length >= props.data_length ? false : true}
        loader={<h6 className={classes.endMessage}> Loading...</h6>}
        endMessage={
          <h6 className={classes.endMessage}>Nothing more to show</h6>
        }
      >
        {product.map((data, index) => (
          <Product key={data._id} product={data} button={true} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ProductList;
