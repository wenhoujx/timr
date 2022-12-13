import { useState, useEffect, useReducer } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { toggleTask as toggleTaskStatus, newTask, updateTaskTitle, endTask } from './utils/utils'
import _ from 'lodash'
import { TaskList } from './components/TaskList'

const TODO_APP = "todo_app"
const TASKS = 'tasks'
const tags = "tags"

const ACTIONS = {
  ADD_TASK: 'add_task',
  REMOVE_TASK: 'remove_task',
  UPDATE_TASK_TITLE: 'update_task_title',
  TOGGLE_TASK_STATUS: 'toggle_task_status'
}

function reducer(state, action) {
  switch (action.type) {
    case (ACTIONS.ADD_TASK):
      return {
        ...state,
        tasks: {
          ..._.mapValues(state.tasks, endTask),
          [_.uniqueId()]: newTask(action.payload.title),
        }
      }
    case (ACTIONS.REMOVE_TASK):
      return {
        ...state,
        tasks: _.omit(state.tasks, [action.payload.id])
      }
    case (ACTIONS.TOGGLE_TASK_STATUS):
      const toggleId = action.payload.id
      return {
        ...state,
        tasks: {
          ..._.mapValues(state.tasks, endTask),
          [toggleId]: toggleTaskStatus(state.tasks[toggleId])
        }
      }
    case (ACTIONS.UPDATE_TASK_TITLE):
      const updateTitleId = action.payload.id
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [updateTitleId]: updateTaskTitle(state.tasks[updateTitleId], action.payload.title)
        }
      }
    default: return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem(TASKS)) || { tasks: {}, tags: [] })

  // useEffect(() => {
  //   localStorage.setItem(TASKS, JSON.stringify(state))
  // }, [state])

  return (
    <Container fluid>
      <div className='mt-1'>
        <NewTask addTask={title => dispatch({ type: ACTIONS.ADD_TASK, payload: { title } })} />
      </div>
      <div>
        <TaskList
          tasks={state.tasks}
          onToggleStatus={id => dispatch({ type: ACTIONS.TOGGLE_TASK_STATUS, payload: { id } })}
          removeTask={id => dispatch({ type: ACTIONS.REMOVE_TASK, payload: { id } })}
          updateTaskTitle={(id, title) => dispatch({
            type: ACTIONS.UPDATE_TASK_TITLE, payload: { id, title }
          })}
        />
      </div>
    </Container>
  )
}

export default App
