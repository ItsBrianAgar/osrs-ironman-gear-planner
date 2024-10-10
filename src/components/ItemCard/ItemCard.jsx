import React from "react";
import "./ItemCard.css";

const ItemCard = ({ item, order, onRemove }) => {
  return (
    <div className="item-card">
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.name} className="item-image" />
      )}
      <p className="item-order">{order + 1}</p>
      <button className="remove-item-button" onClick={() => onRemove(item)}>
        <span>Remove Item</span> &times;
      </button>
      <h3 className="item-name">{item.name}</h3>
      {/* <p className="item-description">{item.description}</p>
      <p className="item-value">Value: {item.value.toLocaleString()} coins</p>
      <p className="item-weight">Weight: {item.weight} kg</p>
      <p className="item-members">
        {item.membersOnly ? "Members Only" : "Free to Play"}
      </p>
      {item.equipmentSlot && (
        <p className="item-slot">Slot: {item.equipmentSlot}</p>
      )}
      {item.rangeAttackBonus && (
        <p className="item-range-bonus">
          Range Attack Bonus: +{item.rangeAttackBonus}
        </p>
      )}
      {item.rangedStrengthBonus && (
        <p className="item-range-strength">
          Ranged Strength Bonus: +{item.rangedStrengthBonus}
        </p>
      )} */}
    </div>
  );
};

export default ItemCard;
