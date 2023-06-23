import React from 'react'
import { useDispatch,useSelector } from 'react-redux';
import {increment,decrement} from '../../redux/actions'
function Counter() {
  // const [count,setCount] =useState(0)

  const counter =useSelector((state)=>state.counterReducer.count);
  const dispatch=useDispatch();
  const handleIncrement = () =>{
    dispatch(increment(1))
  }
  const handleDecrement = () =>{
    dispatch(decrement(1))
  }
  return (
    <div>
        <h2 onClick={handleIncrement}>+</h2>
        <h1>{counter}</h1>
        <h2 onClick={handleDecrement}>-</h2>
    </div>
  )
}

export default Counter;