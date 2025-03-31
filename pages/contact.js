import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import { appUrl, fetchData, setSettingsData } from "~/lib/clientFunctions";
import { wrapper } from "~/redux/store";
import classes from "~/styles/pages.module.css";

const ContactPage = ({ data, error }) => {
  return (
    <>
      {error ? (
        <Error500 />
      ) : (
        <>
          <HeadData title="Contact us" />
          <div className="layout_top">
            <h1 className={classes.heading}>Contact Us</h1>
            {data && (
              <div
                className={classes.content}
                dangerouslySetInnerHTML={{
                  __html: data.page && data.page.content,
                }}
              ></div>
            )}
          </div>
        </>
      )}
    </>
  );
};

ContactPage.getInitialProps = wrapper.getInitialPageProps(
  (store) => async (context) => {
    try {
      const { origin } = appUrl(context.req);
      const url = `${origin}/api/home/pages?scope=contact`;
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

export default ContactPage;
