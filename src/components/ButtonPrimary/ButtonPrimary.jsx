import React from "react";
import "./ButtonPrimary.css";

const ButtonPrimary = ({
  className,
  clickHandler,
  icon = null,
  text = "click",
}) => {
  return (
    <button className={`button--primary ${className}`} onClick={clickHandler}>
      {icon ? <span>{icon}</span> : null}
      {text}
    </button>
  );
};

export default ButtonPrimary;
