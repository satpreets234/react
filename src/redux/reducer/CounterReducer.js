export const initialState = {
    tasks:JSON.parse(localStorage.getItem('tasks')) || [{taskName:'walk',isCompleted:false,id:0}],
    count: 0,
    error:{message:''}
  };

export const counterReducer =(state=initialState,action) =>{
    switch (action.type){
        case 'INCREMENT':
            return {
                ...state,
                count:state.count + action.payload
            }
        case 'DECREMENT':
            return {
                ...state,
                count:state.count - action.payload
            }
        case 'ADD_TO_DO':
                return {
                    ...state,
                   tasks: [...state.tasks,{taskName:action.payload.task,isCompleted:false,id:action.payload.id}]
            }
        case 'SET_ERROR':
                return {
                    ...state,
                   error:{message:action.payload}
            }
        case 'REMOVE_TO_DO':
                return {
                        ...state,
                        tasks: [...state.tasks,action.payload.task]

            }
            case 'DELETE_TO_DO':
                return {
                        ...state,
                        tasks: state.tasks.filter((task)=> task.id !== action.payload.id )

            }
            case 'COMPLETE_TASK':
                console.log(3);
                return {
                        ...state,
                        tasks: state.tasks.map((task)=> {
                            if(task.id == action.payload.id){
                                return {...task,isCompleted:true}
                            }else {
                                return task;
                              }
                        } )

            }
         default:
            return {
                ...state,
            }
    }
}