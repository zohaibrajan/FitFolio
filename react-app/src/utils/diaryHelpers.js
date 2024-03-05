import { useDispatch } from 'react-redux';
import { deleteCardioLogThunk } from '../store/cardioLogs';

function useRemoveCardioLog() {
    const dispatch = useDispatch();
    return (e, cardioLogId) => {
        e.preventDefault();
        dispatch(deleteCardioLogThunk(cardioLogId));
    }
}


export { useRemoveCardioLog };
