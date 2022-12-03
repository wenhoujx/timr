import _ from "lodash";
import { useState } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

export function NewTask({ addTask }) {
    const [value, setValue] = useState("")
    const handleClick = () => {
        if (_.isEmpty(value)) {
            return 
        } 
        addTask(value)
        setValue("")
    }
    return (<InputGroup className="mb-3">
        <Button 
        className="btn-success"
        onClick={handleClick}>
            Go!
        </Button>
        <Form.Control
            placeholder="what's your plan?"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {e.key === 'Enter' && handleClick()}}
            value={value}
        />
    </InputGroup>)

}
