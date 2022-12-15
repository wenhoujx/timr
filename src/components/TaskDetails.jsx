import _ from "lodash";
import { Form, Offcanvas, } from "react-bootstrap";

export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag, removeTask }) {
    return (
        task &&
        <Offcanvas show={show} onHide={() => closeShow()} placement='end'>
            <Offcanvas.Body>
                <Tags
                    allTags={allTags}
                    selectedTags={task.tags}
                    addTaskTag={tag => addTaskTag(task.id, tag)}
                    removeTaskTag={tag => removeTaskTag(task.id, tag)}
                />
            </Offcanvas.Body>
        </Offcanvas>
    )
}

function Tags({ allTags, selectedTags, addTaskTag, removeTaskTag }) {
    return (
        <>
            {_.map(allTags, tag => (
                <Form.Check
                    type='switch'
                    style={{
                        backgroundColor: tag.color
                    }}
                    key={tag.tag}
                    label={tag.tag}
                    onChange={e => e.target.checked ? addTaskTag(tag.tag) : removeTaskTag(tag.tag)}
                    checked={_.includes(selectedTags, tag.tag)}
                />
            ))}

        </>
    )
}
