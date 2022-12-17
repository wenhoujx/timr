import _, { min } from "lodash";
import { useState } from "react";
import { Badge, Button, Col, Form, FormControl, InputGroup, Offcanvas, Row, Modal, OverlayTrigger, Popover } from "react-bootstrap";
import { formatTime } from "../utils/utils";

export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag, removeTask, updateTaskTitle, updateTaskNotes, updateTaskIntervals }) {
    const [showDelete, setShowDelete] = useState(false)
    return (
        task &&
        <Offcanvas
            // for input popover to work 
            enforceFocus={false}
            show={show}
            onHide={() => closeShow()} placement='end'>
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
                    <Modal
                        show={showDelete}
                        onHide={() => setShowDelete(false)} >
                        <Modal.Body className="d-flex align-items-center">
                            <span>
                                Delete <strong>{task.title}</strong>?
                            </span>
                            <Button
                                className="ms-auto bi-trash-fill"
                                size="sm"
                                variant="danger"
                                onClick={() => { setShowDelete(false); removeTask() }} />
                        </Modal.Body>
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

function parseSeconds(seconds) {
    const d = new Date(seconds * 1000)
    return {
        hour: d.getHours(),
        minute: d.getMinutes()
    }
}

function getEpochSeconds(base, hour, minute) {
    const d = new Date(base * 1000)
    d.setHours(hour)
    d.setMinutes(minute)
    return _.floor(d.getTime() / 1000)
}

function Interval({ interval, updateInterval, deleteInterval }) {
    const { start, end, elapsed } = interval
    const startValue = parseSeconds(start)
    const endValue = end && parseSeconds(end)

    const handleUpdate = (s, e) => {
        const new_start = getEpochSeconds(start, s.hour, s.minute)
        const new_end = end ? getEpochSeconds(end, e.hour, e.minute) : null
        updateInterval(
            {
                start: new_start,
                end: new_end,
                elapsed: new_end ? new_end - new_start : null
            }
        )
    }
    return <div>
        {
            <div>
                <i className="bi-x-circle-fill p-0 me-1"
                    style={{ color: 'red' }}
                    onClick={() => deleteInterval()} />
                <TimeEditor
                    {...startValue}
                    updateValue={val => handleUpdate(val, endValue)}
                />
                --
                {endValue ? (
                    <>
                        <div className="d-inline me-2">
                            <TimeEditor
                                {...endValue}
                                updateValue={val => handleUpdate(startValue, val)}
                            />
                        </div>
                        Total: {formatTime(elapsed)}
                    </>

                ) : ' Running'}
            </div>
        }
    </div>
}

function TimeEditor({ hour, minute, updateValue }) {
    const pad2 = i => String(i).padStart(2, '0')
    const isValid = ts => {
        const [h, m] = _.map(ts.split(":"), t => parseInt(t))
        return (h >= 0) && (h <= 23) && (m >= 0) && (m <= 59)
    }
    const parseString = (ts) => {
        const [h, m] = _.map(ts.split(":"), t => parseInt(t))
        return {
            hour: h,
            minute: m
        }
    }
    const timeAsString = pad2(hour) + ":" + pad2(minute)
    const [value, setValue] = useState(timeAsString)

    return (
        <>
            <OverlayTrigger
                trigger="click"
                placement='bottom'
                rootClose
                onExit={e => isValid(value) ? updateValue(parseString(value)) : setValue(timeAsString)}
                overlay={
                    <Popover>
                        <Popover.Body
                        className="p-1">
                            <Form.Control 
                            size="sm"
                                className={isValid(value) ? "" : "border-danger"}
                                type='text'
                                value={value}
                                onChange={e => setValue(e.target.value)}
                            />
                        </Popover.Body>
                    </Popover>
                }
            >
                <span>{value}</span>
            </OverlayTrigger>
        </>
    )
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
