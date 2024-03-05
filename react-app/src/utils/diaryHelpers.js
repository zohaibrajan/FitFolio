import { useDispatch } from 'react-redux';
import { deleteCardioLogThunk } from '../store/cardioLogs';
import { deleteWeightLogThunk } from '../store/weightLogs';

function useRemoveCardioLog() {
    const dispatch = useDispatch();
    return (e, cardioLogId) => {
        e.preventDefault();
        dispatch(deleteCardioLogThunk(cardioLogId));
    }
}

function useRemoveStrengthLog() {
    const dispatch = useDispatch();
    return (e, strengthLogId) => {
        e.preventDefault();
        dispatch(deleteWeightLogThunk(strengthLogId));
    }
}


export { useRemoveCardioLog, useRemoveStrengthLog };
