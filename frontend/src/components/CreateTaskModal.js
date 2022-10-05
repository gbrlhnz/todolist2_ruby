import React, { useState } from 'react'
import apiClient from '../services/api'
import { useAuth } from '../services/AuthProvider'
import useDatetime from '../hooks/useDatetime'
import moment from 'moment'
import { FaTimes } from 'react-icons/fa'

const CreateTaskModal = ({ showModal, setShowModal, editId, setEditState }) => {
    const { loggedInUser } = useAuth()
    const [timezone, setTimezone] = useState('')
    const [task, setTask] = useState({
        name: '',
        description: '',
        schedule: moment().format()
    })
    const getTimezone = useDatetime(setTimezone)

    const handleOnChange = (e) => {
        if (e.target.id === 'schedule') {
            setTask({
                ...task,
                schedule: e.target.value.toString() + ':00.000' + timezone
            })
            return
        }

        setTask({
            ...task,
            [e.target.id]: e.target.value.toString()
        })
    }

    const saveTask = (e) => {
        e.preventDefault()

        if (window.confirm('Are you sure you want to save this task?')) {
            apiClient({
                method: 'post',
                url: '/api/v1/tasks/',
                data: {
                    task: {
                        name: task.name,
                        description: task.description,
                        schedule: task.schedule + ':00.000',
                        user_id: loggedInUser.id
                    }
                }
            }).then(response => {
                window.alert('Succesfully saved task!')
                setEditState(true)
                setShowModal(false)
            }).catch(error => {
                window.alert('There was an error processing your request!')
            })
        }
    }

    return (
        <div style={{ display: `${showModal ? 'block' : 'none'}`, background: '#9797978a', width: '100vw', height: '100vh', position: 'absolute', top: '0', left: '0', zIndex: '10', backdropFilter: 'blur(3px)' }}>
            <div className='bg-white absolute p-10 rounded' style={{ width: '50vw', maxWidth: '600px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className='flex justify-end mb-4'>
                    <button type='button' className='text-red-600' onClick={() => setShowModal(false)}>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={saveTask}>
                    <div className='mb-2'>
                        <label className='font-bold'>Title</label>
                        <input
                            type='text'
                            id='name'
                            className='w-full py-2 px-5 outline-0 border border-slate-200'
                            onChange={handleOnChange}
                            value={task.name} />
                    </div>
                    <div className='mb-2'>
                        <label className='font-bold'>Description</label>
                        <input
                            type='text'
                            id='description'
                            className='w-full py-2 px-5 outline-0 border border-slate-200'
                            onChange={handleOnChange}
                            value={task.description} />
                    </div>
                    <div className='mb-2'>
                        <label className='font-bold'>Schedule</label>
                        <input
                            type='datetime-local'
                            id='schedule'
                            className='w-full py-2 px-5 outline-0 border border-slate-200'
                            onChange={handleOnChange}
                            value={
                                moment(
                                    task.schedule.replace(/.000/g, '').substring(0, (task.schedule.replace(/.000/g, '')).lastIndexOf(':00')))
                                    .format('YYYY-MM-DDTHH:mm')

                            } />
                    </div>
                    <div className='form-group mt-4 text-right'>
                        <button
                            type='submit'
                            className='bg-primary hover:bg-transparent text-white hover:text-primary border border-primary'
                            style={{ width: '200px', minWidth: '200px', padding: '6px 15px' }}>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateTaskModal
