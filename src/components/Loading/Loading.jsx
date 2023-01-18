import React from "react";
import { RotatingLines } from "react-loader-spinner";
import "./loading.css";
const Loading = () => {
  return (
    <div className="loader">
      <RotatingLines
        strokeColor="grey"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </div>
  );
};

export default Loading;
