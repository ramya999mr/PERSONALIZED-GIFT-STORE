import {
  Facebook,
  Instagram,
  PinterestAlt,
  Twitter,
  Youtube,
} from "@styled-icons/boxicons-logos";
import { DeliveryDining, Security, SupportAgent } from "@styled-icons/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import classes from "./footer.module.css";
import Newsletter from "./newsletter";

const Footer = (props) => {
  // Selecting settings from global state
  const settings = useSelector((state) => state.settings);

  if (props.visibility)
    return (
      <>
        <footer className={classes.footer_container}>
          <div className="custom_container">
            <div className="row m-0">
              <div className="col-md-4 px-2 py-4">
                <div className={classes.icon_container}>
                  <Security className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.security.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.security.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-2 py-4">
                <div className={classes.icon_container}>
                  <SupportAgent className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.support.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.support.description}
                  </p>
                </div>
              </div>
              <div className="col-md-4 px-2 py-4">
                <div className={classes.icon_container}>
                  <DeliveryDining className={classes.icon} />
                </div>
                <div className={classes.content}>
                  <h6>{settings.settingsData.footerBanner.delivery.title}</h6>
                  <p>
                    {settings.settingsData.footerBanner.delivery.description}
                  </p>
                </div>
              </div>
            </div>
            <hr className="mx-2" />
            <Newsletter />
            <div className="row m-0">
              <div className="col-md-3 px-3 py-2">
                <Link href="/">
                  <a>
                    <div className={classes.logo}>
                      {settings.settingsData.logo[0] && (
                        <Image
                          src={settings.settingsData.logo[0].url}
                          width={145}
                          height={45}
                          alt={settings.settingsData.name}
                        />
                      )}
                    </div>
                  </a>
                </Link>
                <div className={classes.address}>
                  <h1>{settings.settingsData.description}</h1>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>CONTACT INFO</h3>
                <div className={classes.address}>
                  <div>
                    <label>Address:</label>
                    <p>{settings.settingsData.address}</p>
                  </div>
                  <div>
                    <label>Email:</label>
                    <a
                      className={classes.address_content}
                      href={`mailto:${settings.settingsData.email}`}
                    >
                      {settings.settingsData.email}
                    </a>
                  </div>
                  <div>
                    <label>Phone:</label>
                    <a
                      className={classes.address_content}
                      href={`tel:${settings.settingsData.phoneFooter}`}
                    >
                      {settings.settingsData.phoneFooter}
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>QUICK LINKS</h3>
                <ul className={classes.list}>
                  {props.footer.link.shop.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3 px-3 py-2">
                <h3 className={classes.footer_heading}>MY ACCOUNT</h3>
                <ul className={classes.list}>
                  {props.footer.link.account.map((link) => (
                    <li className={classes.list_item} key={link.name}>
                      <Link href={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr className="mx-2" />
            <div className="row m-0">
              <div className="col-md-3 p-2">
                <p className={classes.copyright}>
                  {settings.settingsData.copyright}
                </p>
              </div>
              <div className="col-md-6 p-2">
                <div className={classes.gateway}>
                  {settings.settingsData.gatewayImage[0] && (
                    <Image
                      src={settings.settingsData.gatewayImage[0].url}
                      layout="fill"
                      objectFit="contain"
                      alt={settings.settingsData.gatewayImage[0].name}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-3 p-2">
                <div className={classes.social}>
                  <a
                    href={settings.settingsData.social.facebook}
                    className={classes.social_icon}
                  >
                    <Facebook width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.instagram}
                    className={classes.social_icon}
                  >
                    <Instagram width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.twitter}
                    className={classes.social_icon}
                  >
                    <Twitter width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.youtube}
                    className={classes.social_icon}
                  >
                    <Youtube width={30} height={30} />
                  </a>
                  <a
                    href={settings.settingsData.social.pinterest}
                    className={classes.social_icon}
                  >
                    <PinterestAlt width={30} height={30} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </>
    );

  return null;
};

export default React.memo(Footer);
