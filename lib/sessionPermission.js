import { getSession } from "next-auth/client";

export default async function sessionChecker(req, target, user) {
  try {
    const session = await getSession({ req });
    //no session
    if (!session) {
      return false;
    }
    //only user
    if (session && user) {
      return true;
    }
    //admin
    if (session && session.user.a) {
      return true;
    }
    //staff
    if (session && session.user.s.status) {
      if (target === "general") {
        return true;
      } else {
        const {
          view,
          edit,
          delete: _delete,
        } = session.user.s.permissions.find((x) => x.name === target);
        return view || edit || _delete;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}
