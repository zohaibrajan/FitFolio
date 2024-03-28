import React from "react";

function ErrorHandlingComponent({ error }) {
    return <div className="exercise-name-error">{error || ""}</div>;
}

export default ErrorHandlingComponent;
