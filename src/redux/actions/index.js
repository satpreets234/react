import axios from "axios";
import { INCREMENT,DECREMENT ,LOGIN ,SIGNUP,
     ADD_TO_DO, REMOVE_TO_DO, SET_ERROR, 
     DELETE_TO_DO, COMPLETE_TASK, LOGOUT, GET_USERS, DEACTIVATE_USER, ACTIVATE_USER, SET_USER_QUERY, SET_PAGE_NO, SET_LOADER, LOGIN_ERROR} from "./actionTypes";

export const increment =(number) =>{
        return {
            type:INCREMENT,
            payload:number
        }
}

export const decrement =(number) =>{
    return {
        type:DECREMENT,
        payload:number
    }
}

export const loginSuccess = (userData) => {
    localStorage.setItem('isAuthenticated', true);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('token', String(userData.loginToken)); // Convert to string
    return {
      type: LOGIN,
      payload: { userData }
    };
  };

export const loginError = (error) =>{
    return {
        type:LOGIN_ERROR,
        payload:{error}
    }
}
export const login = (loginData) => {
    return async (dispatch) => {
      try {
        const loginResponse = await axios.post('http://localhost:8070/api/user/login', loginData);
        dispatch(loginSuccess(loginResponse.data));
        return loginResponse; // Return the response explicitly
      } catch (error) {
        dispatch(loginError(error?.response?.data));
        throw error; // Throw the error to be caught in the catch block
      }
    };
  };

export const signup = (userData) => {
    localStorage.setItem("email", userData.email);
    return {
        type:SIGNUP,
        payload:{userData}
    }
}

export const addToDo = (task,id) => {
    console.log(task,id);
    return {
        type:ADD_TO_DO,
        payload:{task,id}
    }
}

export const removeTaskFromToDo = (task,id) => {
    return {
        type:REMOVE_TO_DO,
        payload:{task,id}
    }
}
export const setError = (error) => {
    return {
        type:SET_ERROR,
        payload:{error}
    }
}

export const deleteToDo = (id) => {
    return {
        type:DELETE_TO_DO,
        payload:{id}
    }
}
export const completeTask = (id) => {
    return {
        type:COMPLETE_TASK,
        payload:{id}
    }
}

export const logout = () => {
    
    return {
        type:LOGOUT,
        payload:{}
    }
}

export const setUsers = (users) =>{
    return {
        type:GET_USERS,
        payload:{users}
    }
}

export const activateUser = (userId) =>{
    return {
        type:ACTIVATE_USER,
        payload:{userId}
    }
}

export const deActivateUser = (userId) =>{
    return {
        type:DEACTIVATE_USER,
        payload:{userId}
    }
}
export const setLoader = (value) =>{
    return {
        type:SET_LOADER,
        payload:value
    }
}

export const setUserFindQuery = (query) =>{
    console.log(query);
    return {
        type:SET_USER_QUERY,
        payload:{query}
    }
}

export const setPageNo = (pageNo) =>{
    console.log(pageNo);
    return {
        type:SET_PAGE_NO,
        payload:{pageNo}
    }
}