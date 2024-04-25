import { useTasksContext } from '../hooks/useTasksContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useState } from 'react'


const TaskDetails = ({ task }) => {
  const { dispatch } = useTasksContext()
  const { user } = useAuthContext()
  const [state,setState] = useState({
    title:task?.title,
    description:task?.description
  })
  const [isVisible,setIsVisible] = useState(false)

  

  const handleClick = async () => {
    if (!user) {
      return
    }
    

    const response = await fetch('/api/tasks/' + task._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_TASK', payload: json})
    }
  }
  const handleChange = (e)=>{
    setState(prev=>{return {...prev,[e.target.name]:e.target.value}});
    console.log(state)
  }
  return (
    <div className="task-details" style={{display: 'flex', justifyContent: "space-between"}}>
      <div>
      {!isVisible && <h4>{state.title}</h4>}
      {!isVisible && <h4>{state.description}</h4>}
      {isVisible && <input type="text" name="title" value={state?.title} onChange={handleChange} />}
      {isVisible && <input type="text" name="description" value={state?.description} onChange={handleChange} />
      }<p>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</p>
      </div>
      <div>
      <div style={{margin: '20px'}} className="material-symbols-outlined" onClick={handleClick}>delete</div>
      <div className="material-symbols-outlined" onClick={()=>setIsVisible(prev => !prev)}>edit</div>
      </div>
    </div>
  )
}

export default TaskDetails