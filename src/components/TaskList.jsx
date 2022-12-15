import { formatTime, elapsedTime, isStopped, lastUpdated } from "../utils/utils";
import { Button, InputGroup, Form, Badge } from "react-bootstrap";
import { useState } from "react";
import _, { remove } from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, showTags, onToggleStatus, removeTask, updateTaskTitle }) {
    // make sure the last updated one is on top. 
    const sortedTasks = _.sortBy(tasks, (task) => isStopped(task) ? lastUpdated(task) : 0)
    return (
        <div>
            {_.map(sortedTasks, (task) => (
                <div className="mb-1" key={task.id}>
                    <SingleTask
                        task={task}
                        showTags={showTags}
                        onToggleStatus={onToggleStatus}
                        removeTask={removeTask}
                        updateTaskTitle={updateTaskTitle}
                    />
                </div>
            ))}
        </div>
    )
}

function SingleTask({ task, showTags, onToggleStatus, removeTask, updateTaskTitle }) {
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
        <div>
            <InputGroup>
                <Button className={`${isStopped(task) ? 'btn-success' : 'btn-warning'}`}
                    onClick={() => onToggleStatus(task.id)}>
                    {formatTime(elapsed)}
                </Button>
                <Form.Control
                    value={task.title}
                    onChange={e => updateTaskTitle(task.id, e.target.value)}
                    onClick={() => setEditing(true)}
                    readOnly={!editing}
                />

                <Button onClick={() => showTags(task.id)}>#</Button>
                <Button variant="danger" onClick={() => removeTask(task.id)}><i className="bi-trash-fill"/></Button>
            </InputGroup>
            <div className="d-flex">
                {_.map(task.tags, tag => (
                    <Badge key={tag}>
                        {tag}
                    </Badge>
                ))}

            </div>

        </div>
    )
}
