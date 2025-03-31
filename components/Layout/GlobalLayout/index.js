import dynamic from "next/dynamic";

const ClientLayout = dynamic(() => import("../Client/layout"));
const DashboardLayout = dynamic(() => import("../Dashboard/layout"));

const GlobalLayout = (props) => {
  if (props.error) {
    return <>{props.children}</>;
  }

  return (
    <>
      {props.dashboard ? (
        <DashboardLayout>{props.children}</DashboardLayout>
      ) : (
        <ClientLayout footer={props.footer}>{props.children}</ClientLayout>
      )}
    </>
  );
};

export default GlobalLayout;
