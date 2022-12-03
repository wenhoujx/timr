import { useState } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { newTask, STOPPED } from './utils/utils'
import _ from 'lodash'
import { TaskList } from './components/TaskList'



function App() {
  const [tasks, setTasks] = useState([])
  const addTask = (taskTitle) => {
    setTasks((state) => (_.concat(tasks, [newTask(taskTitle)])))
  }
  const toggleStatus = (id) => {
    setTasks((state) => (
      _.map(state, t => {
        if (t.id == id) {
          return {
            ...t, 
            [STOPPED] : !t.stopped
          }
        } else {
          return t
        }
      })
    ))
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
