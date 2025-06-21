// src/hooks/useSocketEvents.js
"use client";
import { useEffect } from "react";
import socket from "../Utils/socket";

export default function useSocketEvent(eventHandlers = {}) {
  useEffect(() => {
    socket.connect();

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.disconnect(); 
    };
  }, []);
}
