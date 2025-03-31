import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateSession } from "~/redux/session.slice";
import Error403 from "../error/403";

const CheckAuth = ({ auth, authAdmin, children }) => {
  const [session, loading] = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading) {
      dispatch(updateSession(session));
    }
    return () => {
      dispatch(updateSession(null));
    };
  }, [dispatch, loading, session]);

  if (loading) {
    return null;
  }

  return (
    <>
      {auth && !session ? (
        <Error403 />
      ) : authAdmin &&
        (!session || (!session.user.s.status && !session.user.a)) ? (
        <Error403 />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default CheckAuth;
