import { useState, useReducer, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { toggleTask as toggleTaskStatus, newTask, updateTaskTitle, endTask, addTaskTag, removeTaskTag, getTagTime } from './utils/utils'
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
      const newTag = action.payload.tag
      return {
        ...state,
        tags: _.includes(_.keys(state.tags), newTag) ? state.tags : { ...state.tags, [newTag]: {} }
      }
    case (ACTIONS.REMOVE_TAG):
      return {
        ...state,
        tasks: {
          ..._.mapValues(state.tasks, task => removeTaskTag(task, action.payload.tag))
        },
        tags: _.omit(state.tags, [action.payload.tag])
      }
    case (ACTIONS.UPDATE_TAG):
      return {}
    case (ACTIONS.ADD_TASK_TAG):
      const id1 = action.payload.id
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id1]: addTaskTag(state.tasks[id1], action.payload.tag)
        }
      }
    case (ACTIONS.REMOVE_TASK_TAG):
      const id2 = action.payload.id
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [id2]: removeTaskTag(state.tasks[id2], action.payload.tag)
        }
      }
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
  const [state, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem(TODO_APP)) || { tasks: {}, tags: {} })
  const [showTags, setShowTags] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null)

  useEffect(() => {
    localStorage.setItem(TODO_APP, JSON.stringify(state))
  }, [state])

  return (
    <Container fluid>
      <TaskTags
        allTags={state.tags}
        taskId={currentTaskId}
        task={state.tasks[currentTaskId]}
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
