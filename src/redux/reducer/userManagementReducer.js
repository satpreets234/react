
export const initialState = {
    users: [],
    query: { verified: null, active: null, email: '', sort: "" },
    page: 1,
    totalCount: 0,
    loading: false
};

export const userManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_USERS":
            return {
                ...state,
                users: action.payload.users.users,
                totalCount: action.payload.users?.totalCount
            }
        case 'DECREMENT':
            return {
                ...state,
                count: state.count - action.payload
            }
        case "DEACTIVATE_USER":
            const userInde = state.users.findIndex(user => user._id === action.payload.userId);
            if (userInde < 0) {
                return state;
            }
            const updatedUsersDe = [...state.users];
            updatedUsersDe[userInde] = { ...updatedUsersDe[userInde], isActive: false };
            return {
                ...state,
                users: updatedUsersDe
            };
        case "ACTIVATE_USER":
            const userIndex = state.users.findIndex(user => user._id === action.payload.userId);
            if (userIndex < 0) {
                return state;
            }
            const updatedUsers = [...state.users];
            updatedUsers[userIndex] = { ...updatedUsers[userIndex], isActive: true };
            return {
                ...state,
                users: updatedUsers
            };
        case "SET_USER_QUERY":
            return {
                ...state,
                query: { ...action.payload.query }
            }
        case "SET_LOADER":
            return {
                ...state,
                loading: action.payload
            }
        case "SET_PAGE_NO":
            return {
                ...state,
                page: action.payload.pageNo
            }
        default:
            return state
    }
}