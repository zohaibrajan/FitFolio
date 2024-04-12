import { useState } from "react";
import { useHistory } from "react-router-dom";

export function useMultistepForm(steps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const history = useHistory();

    function next() {
        setCurrentStepIndex(i => {
            if (i >= steps.length - 1) return i;
            return i + 1;
        })
    }

    function back() {
        setCurrentStepIndex(i => {
            if (i <= 0) return history.replace("/");
            return i - 1;
        })
    }

    function goTo(i) {
        setCurrentStepIndex(i);
    }

    return {
        currentStepIndex,
        step: steps[currentStepIndex],
        steps,
        next,
        back,
        goTo,
        isLastStep: currentStepIndex === steps.length - 1,
        isFirstStep: currentStepIndex === 0,
    }
}
