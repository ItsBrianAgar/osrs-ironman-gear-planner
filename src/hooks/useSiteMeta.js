import React from "react";
import { setFavicon, setPageTitle } from "../utils/metaUtils.js";
import logo from "../favicon.png";

const useSiteMeta = () => {
  setFavicon(logo);
  setPageTitle("OSRS | Ironman Gear Planner");
};

export default useSiteMeta;
