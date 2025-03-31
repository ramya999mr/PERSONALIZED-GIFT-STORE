import axios from "axios";
import { toJpeg } from "html-to-image";
import { updateSettings } from "~/redux/settings.slice";

export const fetchData = (url) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

export async function postData(url, data) {
  const response = await axios({
    method: "post",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export async function updateData(url, data) {
  const response = await axios({
    method: "put",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export async function deleteData(url, data) {
  const response = await axios({
    method: "delete",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export function decimalBalance(num) {
  return Math.round(num * 10) / 10;
}

export function getTotalPrice(cartData) {
  const price = cartData.items.reduce(
    (accumulator, item) => accumulator + item.qty * item.price,
    0,
  );
  return Math.round(price * 10) / 10;
}

export function discountPrice(cartData) {
  const price = cartData.items.reduce(
    (accumulator, item) => accumulator + item.qty * item.price,
    0,
  );
  const discountPrice =
    Math.round((price - (cartData.coupon.discount / 100) * price) * 10) / 10;
  return discountPrice;
}

export async function printDocument(reference, name) {
  const { jsPDF } = await import("jspdf");
  await toJpeg(reference, { quality: 1.0, pixelRatio: 1.8 })
    .then(function (dataUrl) {
      const pdf = new jsPDF("p", "pt", "a4", true);
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, "FAST");
      pdf.save(`${name}.pdf`);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function shimmer(w, h) {
  return `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#efefef" offset="20%" />
      <stop stop-color="#bbbbbb" offset="50%" />
      <stop stop-color="#efefef" offset="80%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;
}

export function toBase64(str) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

export function currencyConvert(payAmount, exchangeRate) {
  const amount = Number(payAmount);
  const exchange = Number(exchangeRate);
  let convertedAmount = 0;
  convertedAmount = amount * exchange;
  return Number(convertedAmount.toFixed(2));
}

export function setSettingsData(store, data) {
  const storeData = store.getState();
  const st = !storeData.settings.settingsData._id && data && data.settings;
  if (st) {
    store.dispatch(updateSettings(data.settings));
  }
}

export function appUrl(req) {
  let _a;
  let host =
    (((_a = req) === null || _a === void 0 ? void 0 : _a.headers)
      ? req.headers.host
      : window.location.host) || process.env.NEXT_PUBLIC_URL;
  let protocol =
    process.env.NEXT_PUBLIC_APP_SSL !== "yes" ? "http://" : "https://";
  if (typeof window !== "undefined") {
    protocol = window.location.protocol + "//";
  }
  return {
    protocol: protocol,
    host: host,
    origin: protocol + host,
  };
}

export function dateFormat(d) {
  return new Date(d).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function filterPermission(session, menu) {
  const _menu = [];
  for (const i of menu) {
    if (i.target === "yes") {
      _menu.push(i);
    } else if (i.target !== "no") {
      const p = session.user.s.permissions.find((x) => x.name === i.target);
      if (p.edit) {
        _menu.push(i);
      } else if (p.view && !p.edit) {
        i.subMenu = i.subMenu.filter((x) => !x.create);
        _menu.push(i);
      }
    }
  }
  return _menu;
}

//Component Permission Filter
export function cpf(session, target) {
  const _default = { view: false, edit: false, delete: false };
  if (session && session.user.s.status) {
    const permissions = session.user.s.permissions.find(
      (x) => x.name === target,
    );
    return permissions || _default;
  } else if (session && session.user.a) {
    return { view: true, edit: true, delete: true };
  } else {
    return _default;
  }
}
