import React from "react";

const ItemCard = (itemObject) => {
  return (
    <div className="item-card">
      <span className="item-image"></span>
      <p className="item-name">{itemObject.name}</p>
    </div>
  );
};

export default ItemCard;
