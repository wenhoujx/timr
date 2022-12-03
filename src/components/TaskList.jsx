import { TITLE, ID, formatTime } from "../utils/utils";
import { Button, Stack, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";
import { useElapsedTime } from "use-elapsed-time";
import _ from 'lodash'

export function TaskList({ tasks, onToggleStatus }) {
    return (
        <div>
            {tasks.map(task => (
                <SingleTask
                    key={task[ID]}
                    task={task}
                    onToggleStatus={onToggleStatus}
                />
            ))}
        </div>
    )
}

export function SingleTask({ task, onToggleStatus }) {
    const { id, title, start, stopped } = task
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(title)
    const { elapsedTime } = useElapsedTime({
        isPlaying: !stopped,
        startAt: _.now() - start,
    })


    return (
        <InputGroup className="mb-3">
            <Button className={`${stopped ? 'btn-success' : 'btn-danger'}`}
                onClick={() => onToggleStatus(id)}>
                {formatTime(elapsedTime.toFixed(0))}
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
