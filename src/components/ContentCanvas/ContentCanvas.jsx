import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./ContentCanvas.css";
import ItemSelector from "../ItemSelector/ItemSelector";
import ButtonPrimary from "../ButtonPrimary/ButtonPrimary";
import ItemCard from "../ItemCard/ItemCard";
import Notification from "../Notification/Notification";
import ProgressionArrow from "../ProgressionArrow/ProgressionArrow";

const ContentCanvas = () => {
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setNotificationKey((prevKey) => prevKey + 1);
  };

  const handleButtonClick = () => {
    setShowItemSelector(true);
  };

  const handleCloseItemSelector = () => {
    setShowItemSelector(false);
  };

  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
    setShowItemSelector(false);
    showNotification("Item added successfully", "success");
  };

  const handleRemoveItem = (indexToRemove) => {
    setSelectedItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
    showNotification("Item removed successfully", "info");
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) {
      return;
    }

    const items = Array.from(selectedItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedItems(items);
    showNotification("Items reordered", "info");
  };

  return (
    <section
      className={`content-canvas ${selectedItems.length === 0 ? "empty" : ""}`}
    >
      {notification && (
        <Notification
          key={notificationKey}
          message={notification.message}
          type={notification.type}
        />
      )}
      <ButtonPrimary
        className="primary-function-button"
        text="Add item"
        clickHandler={handleButtonClick}
      />
      {selectedItems.length === 0 ? (
        <p className="content-canvas__empty-text">
          Add an item to start your gear plan.
        </p>
      ) : (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable droppableId="list" direction="horizontal">
            {(provided) => (
              <div
                className="item-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {selectedItems.map((item, index) => (
                  <React.Fragment key={`fragment-${index}`}>
                    <Draggable
                      key={index}
                      draggableId={`item-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ItemCard
                            item={item}
                            order={index}
                            onRemove={() => handleRemoveItem(index)}
                          />
                        </div>
                      )}
                    </Draggable>
                    {index < selectedItems.length - 1 && (
                      <ProgressionArrow isDragging={isDragging} />
                    )}
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {showItemSelector && (
        <ItemSelector
          onClose={handleCloseItemSelector}
          onAddItem={handleAddItem}
        />
      )}
    </section>
  );
};

export default ContentCanvas;
