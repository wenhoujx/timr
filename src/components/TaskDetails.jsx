import _ from "lodash";
import { Button, Form, Offcanvas, } from "react-bootstrap";

export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag, removeTask, updateTaskTitle, updateTaskNotes }) {
    return (
        task &&
        <Offcanvas show={show} onHide={() => closeShow()} placement='end'>
            <Offcanvas.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="input" value={task.title} onChange={e => updateTaskTitle(task.id, e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control as="textarea" rows={3} value={task.notes}
                            onChange={e => updateTaskNotes(task.id, e.target.value)}
                        />
                    </Form.Group>

                </Form>
                <Tags
                    allTags={allTags}
                    selectedTags={task.tags}
                    addTaskTag={tag => addTaskTag(task.id, tag)}
                    removeTaskTag={tag => removeTaskTag(task.id, tag)}
                />
                <div className="text-end">
                    <Button className="btn-danger bi-trash-fill"
                        onClick={() => removeTask()}
                    />
                </div>

            </Offcanvas.Body>

        </Offcanvas>
    )
}

function Tags({ allTags, selectedTags, addTaskTag, removeTaskTag }) {
    return (
        <>
            <div>Tags:</div>
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
