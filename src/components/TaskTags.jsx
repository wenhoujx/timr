import _ from "lodash";
import { Form, Offcanvas, } from "react-bootstrap";

export function TaskTags({ allTags, task, taskId, show, closeShow, addTaskTag, removeTaskTag }) {
    return (
        task &&
        <Offcanvas show={show} onHide={() => closeShow()} placement='end'>
            <Offcanvas.Title>Title: {task.title}</Offcanvas.Title>
            <Offcanvas.Body>
                {_.map(_.keys(allTags), tag => (
                    <Form.Check
                        type='switch'
                        key={tag}
                        label={tag}
                        onChange={e => e.target.checked ? addTaskTag(taskId, tag) : removeTaskTag(taskId, tag)}
                        checked={_.includes(task.tags, tag)}
                    />
                ))}
            </Offcanvas.Body>
        </Offcanvas>
    )
}
