"use client";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function ReactToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={8000}
      hideProgressBar={false}
      rtl={false}
      newestOnTop={false}
      draggable={false}
      pauseOnVisibilityChange
      closeOnClick
      pauseOnHover
    />
  );
}
