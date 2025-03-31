import { useSelector } from "react-redux";

export default function Appearance(params) {
  const settings = useSelector((state) => state.settings);

  return (
    <style global jsx>
      {`
        :root {
          --main: ${settings.settingsData.color.primary || "#ffc107"};
          --main_contrast: ${settings.settingsData.color.primary_contrast ||
          "#000000"};
          --main_light: ${settings.settingsData.color.primary_hover ||
          "#ffd763"};
          --main_light_contrast: ${settings.settingsData.color
            .primary_hover_contrast || "#000000"};
          --orange: ${settings.settingsData.color.secondary || "#EF4A23"};
          --orange_contrast: ${settings.settingsData.color.secondary_contrast ||
          "#ffffff"};
          --blue_white: #f9fbfd;
          --main_opacity: ${settings.settingsData.color.primary + "57" ||
          "#ffd76357"};
          --black: #393939;
          --deep_black: #000000;
          --light_black: #848484;
          --grey: ${settings.settingsData.color.body_gray || "#d9e0e5"};
          --grey_contrast: ${settings.settingsData.color.body_gray_contrast ||
          "#000000"};
          --light_gray: #fafafa;
          --deep_gray: #dbdbdb;
          --white: #ffffff;
          --danger: #cf4436;
          --success: #198754;
          --success_hover: #157347;
        }
      `}
    </style>
  );
}
