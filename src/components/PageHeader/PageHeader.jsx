import React from "react";
import "./PageHeader.css";
// Assets
import osrsLogo from "../../images/osrs-logo.png";

const PageHeader = () => {
  return (
    <header className="page-header">
      {/* <p className="page-title--supertext">OSRS</p> */}
      <img className="header-img" src={osrsLogo} />
      <h1 className="page-title">Gear Planner</h1>
      <p className="page-description">
        Use this tool to plan your gear upgrade journey
      </p>
    </header>
  );
};

export default PageHeader;
