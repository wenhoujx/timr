import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { toggleTask, newTask } from './utils/utils'
import _ from 'lodash'
import { TaskList } from './components/TaskList'

const TASKS = 'tasks'
function App() {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem(TASKS)) || [])

  useEffect(() => {
    localStorage.setItem(TASKS, JSON.stringify(tasks))
  }, [tasks])
  
  const addTask = (taskTitle) => {
    setTasks((state) => (_.concat(tasks, [newTask(taskTitle)])))
  }

  const toggleStatus = (id) => {
    setTasks((state) => (
      _.map(state, t => (
        t.id == id ? toggleTask(t) : t)
      )))
  }

  return (
    <Container fluid>
      <div>
        <NewTask addTask={addTask} />
      </div>
      <div>
        <TaskList
          tasks={tasks}
          onToggleStatus={toggleStatus}
        />
      </div>
    </Container>
  )
}

export default App
