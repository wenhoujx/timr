import { formatTime, elapsedTime, isStopped, lastUpdated } from "../utils/utils";
import { Button, InputGroup, Form, Badge } from "react-bootstrap";
import { useState } from "react";
import _ from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, allTags, addTaskTag, onToggleStatus, removeTask, updateTaskTitle }) {
    // make sure the last updated one is on top. 
    const sortedTasks = _.sortBy(_.toPairs(tasks), ([id, task]) => isStopped(task) ? lastUpdated(task) : 0)
    return (
        <div>
            {_.map(sortedTasks, ([id, task]) => (
                <div className="mb-1" key={id}>
                    <SingleTask
                        taskId={id}
                        task={task}
                        addTaskTag={addTaskTag}
                        allTags={allTags}
                        onToggleStatus={onToggleStatus}
                        removeTask={removeTask}
                        updateTaskTitle={updateTaskTitle}
                    />
                </div>
            ))}
        </div>
    )
}

function SingleTask({ taskId, task, allTags, addTaskTag, onToggleStatus, removeTask, updateTaskTitle }) {
    const [editing, setEditing] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [addingTag, setAddingTag] = useState(false)

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
                    onClick={() => onToggleStatus(taskId)}>
                    {formatTime(elapsed)}
                </Button>
                <Form.Control
                    value={task.title}
                    onChange={e => updateTaskTitle(taskId, e.target.value)}
                    onClick={() => setEditing(true)}
                    readOnly={!editing}
                />

                <Button onClick={() => setAddingTag(true)}>#</Button>
                <Button variant="danger">x</Button>
            </InputGroup>
            <div className="d-flex">
                {_.map(task.tags, tag => (
                    <Badge>
                        {tag}
                    </Badge>
                ))}
                {
                    addingTag && <AddTaskTag
                        allTags={allTags}
                        addTaskTag={(tag) => addTaskTag(taskId, tag)}
                    />

                }
            </div>

        </div>
    )
}

function AddTaskTag({ allTags, addTaskTag }) {
    return (<Form.Select
        size="sm"
        onChange={e => { addTaskTag(taskId, e.target.value); setAddingTag(false) }}
    >
        {_.map(_.keys(allTags), tag => (
            <option key={tag} value={tag}>{tag}</option>
        ))}
    </Form.Select>)
}
