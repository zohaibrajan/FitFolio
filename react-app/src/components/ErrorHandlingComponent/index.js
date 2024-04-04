import React from "react";

function ErrorHandlingComponent({ error }) {
    if (typeof error == "boolean" && error) {
        error = "You will not be able to delete or edit this item once created";
    }

    return <div className="exercise-name-error">{error || ""}</div>;
}

export default ErrorHandlingComponent;
