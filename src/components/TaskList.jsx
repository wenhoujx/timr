import { TITLE, ID } from "../utils/utils";
import { Button, Stack, InputGroup, Form } from "react-bootstrap";
import { useState } from "react";
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


    return (
        <InputGroup className="mb-3">
            <Button className={`${stopped ? 'btn-success' : 'btn-danger'}`}
            style={{width: '40px'}}
                onClick={() => onToggleStatus(id)}>
                {stopped ? '\u{2713}' : '⤾'}
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
