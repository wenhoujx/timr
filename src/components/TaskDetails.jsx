import _ from "lodash";
import { useState } from "react";
import { Badge, Button, Col, Form, FormControl, InputGroup, Offcanvas, Row, Modal } from "react-bootstrap";
import { formatTime } from "../utils/utils";

export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag, removeTask, updateTaskTitle, updateTaskNotes, updateTaskIntervals }) {
    const [showDelete, setShowDelete] = useState(false)
    return (
        task &&
        <Offcanvas show={show} onHide={() => closeShow()} placement='end'>
            <Offcanvas.Body>
                <strong>Title:</strong>
                <InputGroup size="sm">
                    <Form.Control type="input" value={task.title} onChange={e => updateTaskTitle(task.id, e.target.value)} />
                </InputGroup>
                <div className="intervals bg-light">
                    <Intervals
                        task={task}
                        updateTaskIntervals={updateTaskIntervals}
                    />
                </div>
                <Tags
                    allTags={allTags}
                    selectedTags={task.tags}
                    addTaskTag={tag => addTaskTag(task.id, tag)}
                    removeTaskTag={tag => removeTaskTag(task.id, tag)}
                />
                <div className="notes">
                    <strong>Notes:</strong>
                    <InputGroup
                        size="sm">
                        <Form.Control as="textarea" rows={5} value={task.notes}
                            onChange={e => updateTaskNotes(task.id, e.target.value)}
                        />
                    </InputGroup>
                </div>
                <div className="d-grid mt-2">
                    <Modal show={showDelete} onHide={() => setShowDelete(false)}
                    >
                        <Modal.Body>
                            Delete {task.title}?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="danger"
                                onClick={() => { setShowDelete(false); removeTask() }}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Button
                        size="sm"
                        className="btn-danger bi-trash-fill"
                        onClick={() => setShowDelete(true)}
                    />
                </div>

            </Offcanvas.Body>

        </Offcanvas>
    )
}

function Intervals({ task, updateTaskIntervals }) {
    return (
        <div>
            <strong>Intervals:</strong>
            {_.map(task.intervals, (dur, i) => (
                <Interval
                    key={i}
                    interval={dur}
                    deleteInterval={
                        () => updateTaskIntervals(
                            task.id, _.filter(task.intervals, (interval, j) => j !== i)
                        )
                    }
                    updateInterval={
                        (newInterval) => updateTaskIntervals(
                            task.id, _.map(task.intervals, (dd, j) => {
                                if (i === j) {
                                    return newInterval
                                } else {
                                    return dd
                                }
                            })
                        )
                    }
                />
            ))}
        </div>
    )
}

function secondsToString(seconds) {
    const padTo2 = str => _.padStart(str, 2, '0')
    const d = new Date(seconds * 1000)
    return `${padTo2(d.getHours())}:${padTo2(d.getMinutes())}`
}

function getEpochSeconds(base, timeString) {
    const d = new Date(base * 1000)
    const [hh, mm] = _.map(timeString.split(":"), t => parseInt(t))
    d.setHours(hh)
    d.setMinutes(mm)
    return _.floor(d.getTime() / 1000)
}

function isValidTime(timeString) {
    const [hh, mm] = _.map(timeString.split(':'), t => parseInt(t))
    return (23 >= hh) && (hh >= 0) && (59 >= mm) && (mm >= 0)
}


function Interval({ interval, updateInterval, deleteInterval }) {
    const { start, end, elapsed } = interval
    const [startValue, setStartValue] = useState(secondsToString(start))
    const [endValue, setEndValue] = useState(end ? secondsToString(end) : null)

    const handleEditing = () => {
        if (!isValidTime(startValue)) {
            return
        }
        if (endValue && !isValidTime(endValue)) {
            return
        }
        const startSeconds = getEpochSeconds(start, startValue)
        const endSeconds = end ? getEpochSeconds(end, endValue) : null
        updateInterval({
            start: startSeconds,
            end: endSeconds,
            elapsed: endSeconds ? endSeconds - startSeconds : null
        })
    }
    return <div>
        {
            <div onBlur={() => handleEditing()}>
                <Row className="d-flex align-items-center">
                    <Col sm={1}>
                        <i className="bi-x-circle-fill p-0 me-1"
                            style={{ color: 'red' }}
                            onClick={() => deleteInterval()} />
                    </Col>
                    <Col sm={2} className='p-0 flex-grow-0'>
                        <Form.Control
                            className={isValidTime(startValue) || 'border-danger'}
                            value={startValue}
                            onChange={e => setStartValue(e.target.value)} />
                    </Col>
                    --
                    {endValue ? (
                        <>
                            <Col sm={2} className='p-0 flex-grow-0'>
                                <Form.Control
                                    className={isValidTime(endValue) || 'border-danger'}
                                    value={endValue}
                                    onChange={e => setEndValue(e.target.value)} />
                            </Col>
                            Total: {formatTime(elapsed)}

                        </>
                    ) : ' Running'}
                </Row>
            </div>
        }
    </div>
}

function Tags({ allTags, selectedTags, addTaskTag, removeTaskTag }) {
    return (
        <>
            <strong className="me-1">Tags:</strong>
            {_.map(allTags, tag => {
                const selected = _.includes(selectedTags, tag.tag)
                return <Badge
                    key={tag.tag}
                    style={{
                        backgroundColor: tag.color
                    }}
                    bg={selected || 'secondary'}
                    onClick={() => selected ? removeTaskTag(tag.tag) : addTaskTag(tag.tag)}
                >
                    {tag.tag}</Badge>
            })}


        </>
    )
}
