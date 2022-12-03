import { ID, formatTime, elapsedTime, isStopped, totalElapsedTime } from "../utils/utils";
import { Button, Stack, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";
import _ from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, onToggleStatus }) {
    return (
        <div >
            <div className='mb-1'>
                <Stats
                    tasks={tasks} />
            </div>
            {tasks.map((task) => (
                <div className="mb-1">
                    <SingleTask
                        key={task[ID]}
                        task={task}
                        onToggleStatus={onToggleStatus}
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
        <div className="bg-success border rounded p-2">{_.size(_.filter(tasks, isStopped))} Done</div>
        <div className="bg-warning border rounded p-2">{_.size(_.filter(tasks, _.negate(isStopped)))} Running: {formatTime(totalElapsed)}</div>
    </Stack>)
}

function SingleTask({ task, onToggleStatus }) {
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
        </InputGroup>

    )
}
