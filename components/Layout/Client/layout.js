import ScrollToTop from "~/components/ScrollToTop";
import data from "~/data.json";
import Footer from "./footer";
import NavBar from "./navbar";

const ClientLayout = (props) => {
  const footerVisibility =
    typeof props.footer == "undefined" ? true : props.footer;

  return (
    <>
      <NavBar />
      <main>{props.children}</main>
      <Footer footer={data.footer} visibility={footerVisibility} />
      <ScrollToTop />
    </>
  );
};

export default ClientLayout;
