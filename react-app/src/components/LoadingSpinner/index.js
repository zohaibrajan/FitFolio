import { TailSpin } from "react-loader-spinner";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <TailSpin
        visible={true}
        height="80"
        width="80"
        color="rgb(0, 102, 238)"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default LoadingSpinner;
