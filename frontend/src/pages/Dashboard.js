import React, { useMemo, useState } from 'react'
import TaskModal from '../components/TaskModal'
import TaskView from '../components/TaskView'
import apiClient from '../services/api'
import { useAuth } from '../services/AuthProvider'

const Dashboard = () => {
    const { loggedIn, loggedInUser, logout } = useAuth()
    const [tasks, setTasks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editId, setEditId] = useState(0)
    const [editState, setEditState] = useState(false)

    const data = useMemo(() => {
        apiClient({
            method: 'get',
            url: `/api/v1/tasks/${loggedInUser.id}`
        }).then(response => {
            setTasks(response.data)
        }).catch(error => {
            console.log(error)
        })

        setEditState(false)
    }, [editState])

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h4>Welcome, {loggedInUser.username}</h4>
                <button type='button' onClick={logout}>Logout</button>
            </div>
            <hr />
            <TaskView tasks={tasks} editState={editState} setEditState={setEditState} setEditId={setEditId} setShowModal={setShowModal} />
            <TaskModal showModal={showModal} setShowModal={setShowModal} editId={editId} setEditState={setEditState} />
        </div>
    )
}

export default Dashboard
