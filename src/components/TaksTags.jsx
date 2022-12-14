import _ from "lodash";
import { Badge, Form } from "react-bootstrap";

export function TaskTags({ tags }) {
    return (
        <div className="d-flex align-items-center">
            {_.map(tags, tag => {
                <Badge>{tag}</Badge>
            })}
            <AddTaskTag></AddTaskTag>
        </div>
    )
}

function AddTaskTag() {
    return (
        <Form.Select>
            <option>Tags</option>
        </Form.Select>
    )
}
