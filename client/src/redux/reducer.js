import { GET_DOGS } from "./action-types";

const initialState = {
    dogs: [],
    dogDetail: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DOGS:
            return { 
                ...state,
                characters: action.payload
            }

        default:
            return {...state};
    }
};

export default reducer;