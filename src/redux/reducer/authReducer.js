export const initialState = {
    userData: {},
    token:'',
    error:'',
    isLoggedIn:false
};

export const authReducer = (state=initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                userData:action.payload.userData,
                isLoggedIn:true
            }
            
        case 'SIGNUP':
            console.log(state);
                return {
                    ...state,
                    userData:action.payload.userData
                }
        case 'LOGIN_ERROR':
                return {
                    ...state,
                    error:action.payload.error
                }
        
        case 'LOGOUT':
            localStorage.removeItem('tasks')
            localStorage.removeItem('token')
            return {
                ...state,
                userData:{},
                token:''
            }    
        default:
            return {
                ...state,
            }
    }
}