import { useState, useReducer, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { NewTask } from './components/NewTask'
import { toggleTaskStatus, newTask, updateTaskTitle, endTask, addTaskTag, removeTaskTag, getTagTime, newTag, updateTaskNotes, updateTaskIntervals, updateTagColor, isStopped } from './utils/utils'
import _ from 'lodash'
import { TaskList } from './components/TaskList'
import { TagList } from './components/TagList'
import { TaskDetails } from './components/TaskDetails'
import { TopControls } from './components/TopControls'
import { init } from './data/initialData'
import { db } from './fire';
import { setDoc, doc, getDoc } from 'firebase/firestore/lite'

const firebaseDocId = 'test-id'
const TODO_APP = "todo_app"
const TASKS = 'tasks'
const tags = "tags"

const ACTIONS = {
  RESET: 'reset',
  ADD_TASK: 'add_task',
  REMOVE_TASK: 'remove_task',
  UPDATE_TASK_TITLE: 'update_task_title',
  UPDATE_TASK_NOTES: 'update_task_notes',
  UPDATE_TASK_INTERVALS: 'update_task_intervals',
  TOGGLE_TASK_STATUS: 'toggle_task_status',
  ADD_TAG: 'add_tag',
  REMOVE_TAG: 'remove_tag',
  UPDATE_TAG: "update_tag",
  UPDATE_TAG_COLOR: 'update_tag_color',
  ADD_TASK_TAG: 'add_task_tag',
  REMOVE_TASK_TAG: 'remove_task_tag',
  SET_STATE: 'set_state'
}

function reducer(state, action) {
  switch (action.type) {
    case (ACTIONS.SET_STATE):
      return action.payload
    case (ACTIONS.RESET):
      return init
    case (ACTIONS.ADD_TAG):
      if (_.find(state.tags, { tag: action.payload.tag })) {
        // already exists 
        return state
      } else {
        return {
          ...state,
          tasks: _.map(state.tasks, t => (isStopped(t) ? t : addTaskTag(t, action.payload.tag))),
          tags: [...state.tags, newTag(action.payload.tag)]
        }
      }

    case (ACTIONS.REMOVE_TAG):
      return {
        ...state,
        tasks: _.map(state.tasks, t => removeTaskTag(t, action.payload.tag)),
        tags: _.filter(state.tags, t => t.tag !== action.payload.tag)
      }
    case (ACTIONS.UPDATE_TAG):
      return {}
    case (ACTIONS.UPDATE_TAG_COLOR):
      return {
        ...state,
        tags: _.map(state.tags, t => t.tag === action.payload.tag ? updateTagColor(t, action.payload.color) : t)
      }
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
            return endTask(t)
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
    case (ACTIONS.UPDATE_TASK_NOTES):
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return updateTaskNotes(t, action.payload.notes)
          } else {
            return t
          }
        })
      }
    case (ACTIONS.UPDATE_TASK_INTERVALS):
      return {
        ...state,
        tasks: _.map(state.tasks, t => {
          if (t.id === action.payload.id) {
            return updateTaskIntervals(t, action.payload.intervals)
          } else {
            return t
          }
        })
      }
    default: return state
  }
}


function App() {
  const [state, dispatch] = useReducer(reducer, {})
  const [showDetails, setShowDetails] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState(null)

  useEffect(() => {
    (async () => {
      const initialData = (await getDoc(doc(db, 'tasks', firebaseDocId)))
      if (initialData.exists()) {
        console.log(JSON.stringify(initialData.data()))
        dispatch({
          type: ACTIONS.SET_STATE,
          payload: initialData.data()
        })
      } else {
        dispatch({
          type: ACTIONS.SET_STATE,
          payload: init
        })
      }

    })()
  }, [])

  useEffect(() => {
    localStorage.setItem(TODO_APP, JSON.stringify(state));
    (async () => setDoc(doc(db, "tasks", firebaseDocId), state))();
  }, [state])

  return (
    <Container fluid>
      <div className='mt-1'>
        <TopControls state={state}
          reset={() => dispatch({
            type: ACTIONS.RESET
          })} />
      </div>
      <TaskDetails
        allTags={state.tags}
        task={_.find(state.tasks, { id: currentTaskId })}
        show={showDetails}
        closeShow={() => setShowDetails(false)}
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
        removeTask={() => dispatch({
          type: ACTIONS.REMOVE_TASK,
          payload: {
            id: currentTaskId
          }
        })}
        updateTaskTitle={(id, title) => dispatch({
          type: ACTIONS.UPDATE_TASK_TITLE,
          payload: {
            id, title
          }
        })}
        updateTaskNotes={(id, notes) => dispatch({
          type: ACTIONS.UPDATE_TASK_NOTES,
          payload: {
            id, notes
          }
        })}
        updateTaskIntervals={(id, intervals) => dispatch({
          type: ACTIONS.UPDATE_TASK_INTERVALS,
          payload: {
            id, intervals
          }
        })}
      />
      <div className='mt-1 mb-3 shadow'>
        <TagList
          tags={state.tags}
          addTag={tag => dispatch({ type: ACTIONS.ADD_TAG, payload: { tag } })}
          removeTag={tag => dispatch({ type: ACTIONS.REMOVE_TAG, payload: { tag } })}
          getTagTime={tag => getTagTime(state.tasks, tag)}
          updateTagColor={((tag, color) => dispatch({
            type: ACTIONS.UPDATE_TAG_COLOR, payload: {
              tag, color
            }
          }))}
        />
      </div>
      <div className='mb-2'>
        <NewTask addTask={title => dispatch({ type: ACTIONS.ADD_TASK, payload: { title } })} />
      </div>
      <div>
        <TaskList
          tasks={state.tasks}
          allTags={state.tags}
          showDetails={(id) => {
            setCurrentTaskId(id);
            setShowDetails(true)
          }}
          onToggleStatus={id => dispatch({ type: ACTIONS.TOGGLE_TASK_STATUS, payload: { id } })}
        />
      </div>
    </Container>
  )
}

export default App
