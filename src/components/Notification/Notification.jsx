import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, message, type]);

  if (!isVisible) return null;

  return <div className={`notification ${type}`}>{message}</div>;
};

export default Notification;
