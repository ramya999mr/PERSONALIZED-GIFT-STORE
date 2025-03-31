import {
  ArrowRepeat,
  BoxArrowInRight,
  CartFill,
  GeoAlt,
  List,
  Person,
  PersonPlus,
  Search,
  Telephone,
  XCircle,
} from "@styled-icons/bootstrap";
import { signOut } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchData } from "~/lib/clientFunctions";
import classes from "./navbar.module.css";

const NavBar = () => {
  const [show, setShow] = useState(false);
  const [searchBarShow, setSearchBarShow] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [hideTopBar, setHideTopBar] = useState(false);
  const [searching, setSearching] = useState(false);
  const search = useRef("");
  // Selecting session from global state
  const { session } = useSelector((state) => state.localSession);
  // Selecting cart from global state
  const cart = useSelector((state) => state.cart);
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const position = window.pageYOffset;
    if (position > 100) {
      setHideTopBar(true);
    } else {
      setHideTopBar(false);
    }
  };

  const toggleSidebar = () => setShow(!show);
  const showSearchBar = () => setSearchBarShow(true);
  const hideSearchBar = () => {
    setSearchBarShow(false);
    setSearchData([]);
  };
  const navItem = [
    {
      id: 1,
      name: "Home",
      to: "/",
    },
    {
      id: 2,
      name: "Shop",
      to: "/gallery",
    },
    {
      id: 3,
      name: "All Categories",
      to: "/categories",
    },
    {
      id: 4,
      name: "Faq",
      to: "/faq",
    },
    {
      id: 5,
      name: "About",
      to: "/about",
    },
  ];

  // Getting the count of items
  const getItemsCount = () => {
    return cart.items.reduce((accumulator, item) => accumulator + item.qty, 0);
  };
  // Getting the total price of all items
  const getTotalPrice = () => {
    return cart.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0,
    );
  };

  const searchItem = async () => {
    setSearching(true);
    try {
      const options = {
        threshold: 0.3,
        keys: ["name"],
      };
      const product = await fetchData(`/api/home/product_search`);
      const Fuse = (await import("fuse.js")).default;
      const fuse = new Fuse(product.product, options);
      setSearchData(fuse.search(search.current.value));
    } catch (err) {
      console.log(err);
    }
    setSearching(false);
  };

  return (
    <>
      {nav()}
      {sidebar()}
      {searchBarShow && searchBar()}
    </>
  );

  function nav() {
    return (
      <nav
        className={classes.nav}
        style={
          hideTopBar
            ? { transform: "translateY(-38px)" }
            : { transform: "translateY(0px)" }
        }
      >
        <div className={classes.top_bar}>
          <div className={classes.top_bar_left}>
            <div
              className={`${classes.top_bar_content} ${classes.top_bar_content_p_left}`}
            >
              
              <GeoAlt width={15} height={15} />{settings.settingsData.shortAddress}
            </div>
            <div
              className={`${classes.top_bar_content} ${classes.top_bar_content_p_left}`}
            >
              <Telephone width={15} height={15} />
              {settings.settingsData.phoneHeader}
            </div>
          </div>
          <div className={classes.top_bar_right}>
            {!session && (
              <Link href="/signup">
                <a>
                  <div
                    className={`${classes.top_bar_content} ${classes.top_bar_content_p_right}`}
                  >
                    <PersonPlus width={16} height={16} />
                    Register
                  </div>
                </a>
              </Link>
            )}
            <div
              className={`${classes.top_bar_content} ${classes.top_bar_content_p_right}`}
            >
              <Person width={16} height={16} />
              {!session && (
                <Link href="/signin">
                  <a>
                    <span>Sign in</span>
                  </a>
                </Link>
              )}
              {session && (
                <Link href="/profile">
                  <a>
                    <span>{session.user.name}</span>
                  </a>
                </Link>
              )}
            </div>
            {session && (
              <div
                className={`${classes.top_bar_content} ${classes.top_bar_content_p_right}`}
              >
                <BoxArrowInRight width={16} height={16} />
                <span onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </span>
              </div>
            )}
          </div>
        </div>
        <div className={classes.container}>
          <div className={classes.start}>
            <button
              className={classes.sidebar_button}
              onClick={() => toggleSidebar()}
            >
              <List width={51} height={35} />
            </button>
            <div className={classes.brand}>
              <Link href="/">
                <a>
                  {settings.settingsData.logo[0] && (
                    <Image
                      src={settings.settingsData.logo[0].url}
                      width={140}
                      height={40}
                      alt={settings.settingsData.name}
                    />
                  )}
                </a>
              </Link>
            </div>
          </div>
          <div className={classes.center}>
            <div className={classes.nav_link}>
              <ul className={classes.ul}>
                {navItem.map((item, index) => (
                  <li className={classes.list} key={index}>
                    <div className={classes.item}>
                      <Link href={item.to}>
                        <a>{item.name}</a>
                      </Link>
                    </div>
                  </li>
                ))}
                {session && (session.user.a || session.user.s.status) && (
                  <li className={classes.list}>
                    <div className={classes.item}>
                      <Link href="/dashboard">
                        <a>Dashboard</a>
                      </Link>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className={classes.end}>
            <div className={classes.search} onClick={() => showSearchBar()}>
              <Search width={25} height={25} />
            </div>
            <div className={classes.right_item}>
              <div className={classes.cart}>
                <Link href="/cart">
                  <a>
                    <CartFill width={30} height={30} />
                    <span className={classes.count}>{getItemsCount()}</span>
                    <p>Shopping cart</p>
                    <div className={classes.price}>
                      {settings.settingsData.currency.symbol}&nbsp;
                      {getTotalPrice().toFixed(2)}
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  function searchBar() {
    return (
      <div>
        <div
          className={classes.searchBar}
          style={
            hideTopBar
              ? { transform: "translateY(-38px)" }
              : { transform: "translateY(0px)" }
          }
        >
          <input
            type="search"
            ref={search}
            className={classes.searchInput}
            onInput={searchItem}
            placeholder="Search your product"
          />
          {searching && (
            <span className={classes.spinner}>
              <ArrowRepeat width={22} height={22} />
            </span>
          )}
          <button
            className={classes.searchButton}
            onClick={() => hideSearchBar()}
          >
            <XCircle width={35} height={35} />
          </button>
        </div>
        <ul className={classes.searchData}>
          {searchData.length > 0 &&
            searchData.map((product, index) => (
              <li key={index}>
                <Link href={`/product/${product.item.slug}`}>
                  <a onClick={() => hideSearchBar()}>{product.item.name}</a>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  function sidebar() {
    return (
      <div
        className={
          show
            ? `${classes.sidebar} ${classes.show}`
            : `${classes.sidebar} ${classes.hide}`
        }
        style={
          hideTopBar
            ? { transform: "translateY(-38px)" }
            : { transform: "translateY(0px)" }
        }
      >
        <div className={classes.sidebar_link}>
          <ul className={classes.sidebar_ul}>
            {navItem.map((item, index) => (
              <li className={classes.sidebar_list} key={index}>
                <div className={classes.sidebar_item}>
                  <Link href={item.to}>
                    <a>{item.name}</a>
                  </Link>
                </div>
              </li>
            ))}
            {!session && (
              <>
                <li className={classes.sidebar_list}>
                  <div className={classes.sidebar_item}>
                    <Link href="/signup">
                      <a>Register</a>
                    </Link>
                  </div>
                </li>
                <li className={classes.sidebar_list}>
                  <div className={classes.sidebar_item}>
                    <Link href="/signin">
                      <a>Sign in</a>
                    </Link>
                  </div>
                </li>
              </>
            )}
            {session && (
              <>
                <li className={classes.sidebar_list}>
                  <div className={classes.sidebar_item}>
                    <Link href="/">
                      <a>{session.user.name}</a>
                    </Link>
                  </div>
                </li>
                <li className={classes.sidebar_list}>
                  <div className={classes.sidebar_item}>
                    <span onClick={() => signOut({ callbackUrl: "/" })}>
                      Logout
                    </span>
                  </div>
                </li>
              </>
            )}
            {session && (session.user.a || session.user.s.status) && (
              <li className={classes.sidebar_list}>
                <div className={classes.sidebar_item}>
                  <Link href="/dashboard">
                    <a>Dashboard</a>
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
};

export default memo(NavBar);
