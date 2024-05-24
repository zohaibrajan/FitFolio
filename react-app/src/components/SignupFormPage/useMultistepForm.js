import { useState } from "react";

export function useMultistepForm(steps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    function next() {
        setCurrentStepIndex(index => {
            if (index >= steps.length - 1) return index;
            return index + 1;
        })
    }

    function back() {
        setCurrentStepIndex(index => {
            if (index <= 0) return index;
            return index - 1;
        })
    }

    function goTo(index) {
        setCurrentStepIndex(index);
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
