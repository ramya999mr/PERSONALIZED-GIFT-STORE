import Link from "next/link";
import classes from "./collection.module.css";

const Collection = ({ data }) => {
  if (!data || data.banner) return null;

  return (
    <div className="custom_container">
      <div className="row m-0">
        <div className="col-sm-6 p-0">
          {data.scopeA.image[0] && (
            <div
              className={classes.content_lg}
              style={{ backgroundImage: `url(${data.scopeA.image[0].url})` }}
            >
              <div className={`${classes.content} ${classes.content_center}`}>
                <h3 className={classes.heading}>{data.scopeA.title}</h3>
                <Link href={data.scopeA.url}>
                  <a className={classes.link}>SHOP NOW</a>
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-6 p-0">
          <div className="col-sm-12 p-0">
            {data.scopeB.image[0] && (
              <div
                className={classes.content_md}
                style={{
                  backgroundImage: `url(${data.scopeB.image[0].url})`,
                }}
              >
                <div className={`${classes.content} ${classes.content_center}`}>
                  <h3 className={classes.heading}>{data.scopeB.title}</h3>
                  <Link href={data.scopeB.url}>
                    <a className={classes.link}>SHOP NOW</a>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="col-sm-12 p-0">
            <div className="row m-0">
              <div className="col-sm-6 p-0">
                {data.scopeC.image[0] && (
                  <div
                    className={classes.content_sm}
                    style={{
                      backgroundImage: `url(${data.scopeC.image[0].url})`,
                    }}
                  >
                    <div className={classes.content}>
                      <h3 className={classes.heading}>{data.scopeC.title}</h3>
                      <Link href={data.scopeC.url}>
                        <a className={classes.link}>SHOP NOW</a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-sm-6 p-0">
                {data.scopeD.image[0] && (
                  <div
                    className={classes.content_sm}
                    style={{
                      backgroundImage: `url(${data.scopeD.image[0].url})`,
                    }}
                  >
                    <div className={classes.content}>
                      <h3 className={classes.heading}>{data.scopeD.title}</h3>
                      <Link href={data.scopeD.url}>
                        <a className={classes.link}>SHOP NOW</a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
