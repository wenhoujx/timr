import _ from "lodash";
import { Form, Offcanvas, } from "react-bootstrap";

export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag }) {
    return (
        task &&
        <Offcanvas show={show} onHide={() => closeShow()} placement='end'>
            <Offcanvas.Title>Title: {task.title}</Offcanvas.Title>
            <Offcanvas.Body>
                {_.map(allTags, tag => (
                    <Form.Check
                        type='switch'
                        key={tag.tag}
                        label={tag.tag}
                        onChange={e => e.target.checked ? addTaskTag(task.id, tag.tag) : removeTaskTag(task.id, tag.tag)}
                        checked={_.includes(task.tags, tag.tag)}
                    />
                ))}
            </Offcanvas.Body>
        </Offcanvas>
    )
}
