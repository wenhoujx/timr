import { formatTime, elapsedTime, isStopped, lastUpdated } from "../utils/utils";
import { Button, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";
import _ from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, onToggleStatus, removeTask, updateTaskTitle }) {
    // make sure the last updated one is on top. 
    const sortedTasks = _.sortBy(_.toPairs(tasks), ([id, task]) => isStopped(task) ? lastUpdated(task) : 0)
    return (
        <div>
            {_.map(sortedTasks, ([id, task]) => (
                <div className="mb-1" key={id}>
                    <SingleTask
                        taskId={id}
                        task={task}
                        onToggleStatus={onToggleStatus}
                        removeTask={removeTask}
                        updateTaskTitle={updateTaskTitle}
                    />
                </div>
            ))}
        </div>
    )
}

function SingleTask({ taskId, task, onToggleStatus, removeTask, updateTaskTitle }) {
    const [editing, setEditing] = useState(false)
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (isStopped(task)) {
            setElapsed(elapsedTime(task))
        } else {
            // timer 
            const interval = setInterval(() => {
                setElapsed(elapsedTime(task))
            }, 1000);
            return () => clearInterval(interval)
        }
    }, [task])

    return (
        <InputGroup>
            <Button className={`${isStopped(task) ? 'btn-success' : 'btn-warning'}`}
                onClick={() => onToggleStatus(taskId)}>
                {formatTime(elapsed)}
            </Button>
            <Form.Control
                value={task.title}
                onChange={e => updateTaskTitle(taskId, e.target.value)}
                onClick={() => setEditing(true)}
                // onKeyDown={e => e.key === 'enter' && setEditing(false)}
                readOnly={!editing}
            />
            <Button className="btn-danger"
                onClick={() => removeTask(taskId)}>x</Button>
        </InputGroup>

    )
}
