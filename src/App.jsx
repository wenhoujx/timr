import { useState, useReducer, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { toggleTask as toggleTaskStatus, newTask, updateTaskTitle, endTask, addTaskTag, removeTaskTag, getTagTime, newTag } from './utils/utils'
import _ from 'lodash'
import { TaskList } from './components/TaskList'
import { TagList } from './components/TagList'
import { TaskTags } from './components/TaskTags'

const TODO_APP = "todo_app"
const TASKS = 'tasks'
const tags = "tags"

const ACTIONS = {
  ADD_TASK: 'add_task',
  REMOVE_TASK: 'remove_task',
  UPDATE_TASK_TITLE: 'update_task_title',
  TOGGLE_TASK_STATUS: 'toggle_task_status',
  ADD_TAG: 'add_tag',
  REMOVE_TAG: 'remove_tag',
  UPDATE_TAG: "udpate_tag",
  ADD_TASK_TAG: 'add_task_tag',
  REMOVE_TASK_TAG: 'remove_task_tag',
}

function reducer(state, action) {
  switch (action.type) {
    case (ACTIONS.ADD_TAG):
      return {
        ...state,
        tags: _.find(state.tags, { tag: action.payload.tag }) ? state.tags : [...state.tags, newTag(action.payload.tag)]
      }
    case (ACTIONS.REMOVE_TAG):
      return {
        ...state,
        tasks: _.map(state.tasks, t => removeTaskTag(t, action.payload.tag)),
        tags: _.filter(state.tags, t => t.tag !== action.payload.tag)
      }
    case (ACTIONS.UPDATE_TAG):
      return {}
    case (ACTIONS.ADD_TASK_TAG):
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return addTaskTag(t, action.payload.tag)
          } else {
            return t
          }
        })
      }
    case (ACTIONS.REMOVE_TASK_TAG):
      const id2 = action.payload.id
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return removeTaskTag(t, action.payload.tag)
          } else {
            return t
          }
        })
      }
    case (ACTIONS.ADD_TASK):
      return {
        ...state,
        tasks: [..._.map(state.tasks, endTask), newTask(action.payload.title)]
      }
    case (ACTIONS.REMOVE_TASK):
      return {
        ...state,
        tasks: _.filter(state.tasks, t => t.id !== action.payload.id)
      }
    case (ACTIONS.TOGGLE_TASK_STATUS):
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return toggleTaskStatus(t)
          } else {
            return t
          }
        })
      }
    case (ACTIONS.UPDATE_TASK_TITLE):
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return updateTaskTitle(t, action.payload.title)
          } else {
            return t
          }
        })
      }
    default: return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem(TODO_APP)) || { tasks: [], tags: [] })
  const [showTags, setShowTags] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null)

  useEffect(() => {
    localStorage.setItem(TODO_APP, JSON.stringify(state))
  }, [state])

  return (
    <Container fluid>
      <TaskTags
        allTags={state.tags}
        task={_.find(state.tasks, { id: currentTaskId })}
        show={showTags}
        closeShow={() => setShowTags(false)}
        addTaskTag={(id, tag) => dispatch({
          type: ACTIONS.ADD_TASK_TAG, payload: {
            id, tag
          }
        })}
        removeTaskTag={(id, tag) => dispatch({
          type: ACTIONS.REMOVE_TASK_TAG, payload: {
            id, tag
          }
        })}
      />
      <div className='mt-1 mb-3 shadow'>
        <TagList
          tags={state.tags}
          addTag={tag => dispatch({ type: ACTIONS.ADD_TAG, payload: { tag } })}
          removeTag={tag => dispatch({ type: ACTIONS.REMOVE_TAG, payload: { tag } })}
          getTagTime={tag => getTagTime(state.tasks, tag)}
        />
      </div>
      <NewTask addTask={title => dispatch({ type: ACTIONS.ADD_TASK, payload: { title } })} />

      <div>
        <TaskList
          tasks={state.tasks}
          allTags={state.tags}
          showTags={(id) => {
            setCurrentTaskId(id);
            setShowTags(true)
          }}
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
