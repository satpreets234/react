import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToDo, completeTask, deleteToDo, setError, setLoader, setUsers } from '../../redux/actions';
import { Button } from 'react-bootstrap';
import { TiTick } from 'react-icons/ti';
import { RxCross2 } from 'react-icons/rx';
import { logout } from '../../redux/actions';
import BackDrop from '../Backdrop/BackDrop';

function Welcome() {
    const navigate = useNavigate();

    const tasks = useSelector((state) => state.counterReducer.tasks) || [];
    const loading = useSelector((state) => state.userManagementReducer.loading);

    const taskLength = useSelector((state) => state.counterReducer.tasks.length);
    const lastTask = useSelector((state) => state.counterReducer.tasks[taskLength - 1]);
    const newTaskId = lastTask ? lastTask.id + 1 : 0;
    const error = useSelector((state) => state.counterReducer.error.message);
    const [task, setTask] = useState('')
    const getProfileData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token === undefined || token === '') {
                console.log(333);
                navigate('/login');
            }
            const getData = await axios.get('http://localhost:8070/api/user/profile-data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (getData.status === 200) {
                toast.success('Authorized user!')
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error?.response.data || error);
        }
    }
    const getUsersData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token === undefined || token === '') {
                console.log(333999);
                navigate('/login');
            }
            dispatch(setLoader(true))
            const getUsers = await axios.post('http://localhost:8070/api/user/users-data', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            dispatch(setLoader(false))
            if (getUsers.status === 200) {
                dispatch(setUsers(getUsers.data))
            }
        } catch (error) {
            toast.error(error?.response.data || error);
        }
    }
    const validateTask = (task) => {
        if (!task) {
            return 'please enter a valid task!'
        } else {
            return '';
        }
    }
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }
    useEffect(() => {
        const taskList = JSON.stringify(tasks);
        localStorage.setItem('tasks', taskList);
        getUsersData()
    }, [tasks]);
    const dispatch = useDispatch();
    const handleTaskAdd = () => {
        const error = validateTask(task);
        if (error) {
            dispatch(setError(error))
            return toast.error(error)
        } else {
            dispatch(setError(''))
            dispatch(addToDo(task, newTaskId));
            toast.success('task added succesfully')
        }
    }
    const completeTaskStatus = (id) => {
        dispatch(completeTask(id))
    }
    const deleteTaskFromList = (id) => {
        dispatch(deleteToDo(id))
    }
    return (
        <div>
            <h1>Welcome</h1>
            <h3>You are now logged in .</h3>
            <button className='profile' type='button' onClick={getProfileData}>Profile</button>
            <button className='logout' type='button' onClick={handleLogout}>Logout</button>
            <input type='text' placeholder='add task here...' onChange={(e) => { setTask(e.target.value) }} />
            <h3>{error.error && error.error}</h3>
            <Button className='good' onClick={() => handleTaskAdd()}>add task</Button>
            <table style={{ marginLeft: '357px', marginTop: '50px' }}>
                <thead>
                    <tr>
                        <th>Sr No.</th>
                        <th>Task Name</th>
                        <th>Status</th>
                        <th>Mark Completed</th>
                        <th>Delete Task</th>
                    </tr>
                </thead>
                {tasks.length ? tasks.map((task) => {
                    return (
                        <tbody>
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.taskName}</td>
                                <td style={{ backgroundColor: task.isCompleted ? 'green' : 'red' }}>
                                    {task.isCompleted ? 'Completed' : 'Pending'}
                                </td>
                                <td onClick={() => { completeTaskStatus(task.id) }} style={{ color: "green" }}><TiTick /></td>
                                <td onClick={() => { deleteTaskFromList(task.id) }} style={{ color: "red" }}><RxCross2 /></td>
                            </tr>
                        </tbody>

                    )
                }) : <tbody>No Tasks to show</tbody>
                }
            </table>
            <Button className='good' onClick={() => navigate('/user-management')}>User Management</Button>
            <BackDrop open={loading} />
        </div>
    )
}

export default Welcome;