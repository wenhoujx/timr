import { ID, formatTime, elapsedTime, isStopped, totalElapsedTime } from "../utils/utils";
import { Button, Stack, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";
import _, { remove } from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, onToggleStatus, removeTask  }) {
    return (
        <div >
            <div className='mb-1'>
                <Stats
                    tasks={tasks} />
            </div>
            {tasks.map((task) => (
                <div className="mb-1" key={task[ID]}>
                    <SingleTask
                        task={task}
                        onToggleStatus={onToggleStatus}
                        removeTask={removeTask}
                    />
                </div>
            ))}
        </div>
    )
}

function Stats({ tasks }) {
    const [totalElapsed, setTotalElapsed] = useState(0)
    useEffect(() => {
        if (_.every(tasks, isStopped)) {
            // all stooped 
            return setTotalElapsed(totalElapsedTime(tasks))
        } else {
            const interval = setInterval(() => {
                setTotalElapsed(totalElapsedTime(tasks))
            }, 1000);
            return () => clearInterval(interval)
        }
    }, [tasks])

    return (<Stack direction="horizontal" gap={1}>
        <div className="bg-success border rounded p-1">{_.size(_.filter(tasks, isStopped))} Done</div>
        <div className="bg-warning border rounded p-1">{_.size(_.filter(tasks, _.negate(isStopped)))} Running: {formatTime(totalElapsed)}</div>
    </Stack>)
}

function SingleTask({ task, onToggleStatus, removeTask }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(task.title)
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
                onClick={() => onToggleStatus(task.id)}>
                {formatTime(elapsed)}
            </Button>
            <Form.Control
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setEditing(!editing)}
                readOnly={!editing}
            />
            <Button className="btn-danger"
            onClick={() => removeTask(task.id)}>x</Button>
        </InputGroup>

    )
}
