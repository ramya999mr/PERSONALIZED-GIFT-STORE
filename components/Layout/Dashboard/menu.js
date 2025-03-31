import {
  BagCheck,
  BoxSeam,
  CardText,
  Palette,
  PeopleFill,
  UiChecksGrid,
} from "@styled-icons/bootstrap";
import {
  Dashboard,
  Email,
  LocalShipping,
  Settings,
  SettingsSuggest,
} from "@styled-icons/material";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { filterPermission } from "~/lib/clientFunctions";
import classes from "./menu.module.css";

const DashboardMenu = (props) => {
  const { session } = useSelector((state) => state.localSession);

  const isOpen = props.menuState;
  const menuData = [
    {
      name: "Dashboard",
      icon: <Dashboard width={20} height={20} />,
      target: "yes",
      subMenu: [
        {
          name: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      name: "Products",
      icon: <BoxSeam width={20} height={20} />,
      target: "product",
      subMenu: [
        {
          name: "All Products",
          url: "/dashboard/product",
        },
        {
          name: "Add New Product",
          url: "/dashboard/product/create",
          create: true,
        },
      ],
    },
    {
      name: "Orders",
      icon: <BagCheck width={20} height={20} />,
      target: "order",
      subMenu: [
        {
          name: "All Orders",
          url: "/dashboard/orders",
        },
      ],
    },
    {
      name: "Categories",
      icon: <UiChecksGrid width={20} height={20} />,
      target: "category",
      subMenu: [
        {
          name: "Category List",
          url: "/dashboard/categories",
        },
        {
          name: "Add New Category",
          url: "/dashboard/categories/create",
          create: true,
        },
        {
          name: "Subcategory List",
          url: "/dashboard/categories/subcategories",
        },
        {
          name: "Add New Subcategory",
          url: "/dashboard/categories/subcategories/create",
          create: true,
        },
      ],
    },
    {
      name: "Coupons",
      icon: <CardText width={20} height={20} />,
      target: "coupon",
      subMenu: [
        {
          name: "All Coupons",
          url: "/dashboard/coupons",
        },
        {
          name: "Add New Coupon",
          url: "/dashboard/coupons/create",
          create: true,
        },
      ],
    },
    {
      name: "Colors",
      icon: <Palette width={20} height={20} />,
      target: "color",
      subMenu: [
        {
          name: "All Colors",
          url: "/dashboard/colors",
        },
        {
          name: "Add New Color",
          url: "/dashboard/colors/create",
          create: true,
        },
      ],
    },
    {
      name: "Attributes",
      icon: <SettingsSuggest width={20} height={20} />,
      target: "attribute",
      subMenu: [
        {
          name: "All Attributes",
          url: "/dashboard/attributes",
        },
        {
          name: "Add New Attribute",
          url: "/dashboard/attributes/create",
          create: true,
        },
      ],
    },
    {
      name: "Shipping Charges",
      icon: <LocalShipping width={20} height={20} />,
      target: "shippingCharges",
      subMenu: [
        {
          name: "Modify Shipping Charges",
          url: "/dashboard/shipping",
        },
      ],
    },
    {
      name: "Subscribers",
      icon: <Email width={20} height={20} />,
      target: "subscriber",
      subMenu: [
        {
          name: "Subscriber List",
          url: "/dashboard/subscribers",
        },
      ],
    },
    {
      name: "Customers",
      icon: <PeopleFill width={20} height={20} />,
      target: "customers",
      subMenu: [
        {
          name: "Customer List",
          url: "/dashboard/users",
        },
      ],
    },
    {
      name: "Manager",
      icon: <PeopleFill width={20} height={20} />,
      target: "no",
      subMenu: [
        {
          name: "Staff List",
          url: "/dashboard/staffs",
        },
        {
          name: "Create New Staff",
          url: "/dashboard/staffs/create",
        },
      ],
    },
    {
      name: "Settings",
      icon: <Settings width={20} height={20} />,
      target: "settings",
      subMenu: [
        {
          name: "General Settings",
          url: "/dashboard/settings",
        },
        {
          name: "Layout Settings",
          url: "/dashboard/settings/layout",
        },
        {
          name: "Graphics Content",
          url: "/dashboard/settings/graphics",
        },
        {
          name: "Seo",
          url: "/dashboard/settings/seo",
        },
        {
          name: "Script",
          url: "/dashboard/settings/script",
        },
        {
          name: "Payment Gateway",
          url: "/dashboard/settings/gateway",
        },
        {
          name: "Social Media Login",
          url: "/dashboard/settings/login",
        },
        {
          name: "Security",
          url: "/dashboard/settings/security",
        },
      ],
    },
    {
      name: "Page Settings",
      icon: <Settings width={20} height={20} />,
      target: "pageSettings",
      subMenu: [
        {
          name: "Home Page",
          url: "/dashboard/page/home",
        },
        {
          name: "About Us",
          url: "/dashboard/page/about",
        },
        {
          name: "Privacy Policy",
          url: "/dashboard/page/privacy",
        },
        {
          name: "Terms & Conditions",
          url: "/dashboard/page/terms",
        },
        {
          name: "Return Policy",
          url: "/dashboard/page/return",
        },
        {
          name: "FAQ",
          url: "/dashboard/page/faq",
        },
        {
          name: "Shipping & Devliery",
          url: "/dashboard/page/shipping",
        },
        {
          name: "Contact us",
          url: "/dashboard/page/contactus",
        },
      ],
    },
  ];

  const [clicked, setClicked] = useState("0");

  const handleClick = (index) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
  };

  return (
    <div className={`${classes.menu} ${isOpen ? classes.show : classes.hide}`}>
      <div className={classes.sidebar_inner}>
        <div className="flex-shrink-0">
          <ul className={classes.list_auto}>
            {session && session.user.s.status
              ? filterPermission(session, menuData).map((menu, index) => (
                  <Item menu={menu} index={index} key={index} />
                ))
              : menuData.map((menu, index) => (
                  <Item menu={menu} index={index} key={index} />
                ))}
          </ul>
        </div>
      </div>
    </div>
  );

  function Item({ menu, index }) {
    return (
      <li className={classes.menu_list}>
        <button
          className={clicked === index ? classes.button_active : ""}
          onClick={() => handleClick(index)}
        >
          {menu.icon} {menu.name}
        </button>
        <div className={clicked === index ? classes.expand : classes.collapse}>
          <ul className={classes.collapse_item}>
            {menu.subMenu.map((subMenu, i) => (
              <li key={i} className={classes.sublist}>
                <Link href={subMenu.url}>
                  <a className="link-dark category-btn-ind">{subMenu.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }
};

export default React.memo(DashboardMenu);
