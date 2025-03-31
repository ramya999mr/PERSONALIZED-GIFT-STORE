import Link from "next/link";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "~/styles/categoryPage.module.css";

const CategoriesPage = ({ data, error }) => {
  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="All Categories" />
          <div className="layout_top">
            <h1 className={classes.heading}>All Categories</h1>
            <div className="custom_container">
              <div className={classes.spc}>
                <div className={classes.card}>
                  <div className="card-body">
                    <div className={classes.category}>
                      <div className="row">
                        {data &&
                          data.category.map((cat) => (
                            <div
                              className="col-lg-4 col-6 text-left"
                              key={cat.categoryId}
                            >
                              <h5>
                                <Link href={`/gallery?category=${cat.slug}`}>
                                  {cat.name}
                                </Link>
                              </h5>
                              <div className={classes.sub}>
                                {cat &&
                                  cat.subCategories.map((sub, idx) => (
                                    <div key={sub.slug + idx}>
                                      <h6>
                                        <Link
                                          href={`/gallery?category=${sub.slug}`}
                                        >
                                          {sub.name}
                                        </Link>
                                      </h6>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

CategoriesPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const url = `${origin}/api/home/categories`;
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

export default CategoriesPage;
