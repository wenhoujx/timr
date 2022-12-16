import _ from "lodash";
import { useState } from "react";
import { Badge, Button, Form, FormControl, InputGroup, Offcanvas, } from "react-bootstrap";
import { formatTime } from "../utils/utils";


function formatTimeInSeconds(seconds) {
    const padTo2 = str => _.padStart(str, 2, '0')
    const endD = new Date(seconds * 1000)
    return `${padTo2(endD.getHours())}:${padTo2(endD.getMinutes())}`
}

function formatInterval(interval) {
    const { start, end, elapsed } = interval
    const padTo2 = str => _.padStart(str, 2, '0')
    let formatString = ""
    const startD = new Date(start * 1000)
    formatString = `${padTo2(startD.getHours())}:${padTo2(startD.getMinutes())}`
    if (end) {
        const endD = new Date(end * 1000)
        formatString += ` - ${padTo2(endD.getHours())}:${padTo2(endD.getMinutes())}`
    } else {
        formatString += ' - running'
    }
    if (elapsed) {
        formatString += ` total: ${formatTime(elapsed)}`
    }
    return formatString
}



export function TaskDetails({ allTags, task, show, closeShow, addTaskTag, removeTaskTag, removeTask, updateTaskTitle, updateTaskNotes, updateTaskIntervals }) {
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
                    <Button
                        size="sm"
                        className="btn-danger bi-trash-fill"
                        onClick={() => removeTask()}
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

function getEpochSeconds(base, hh, mm) {
    const d = new Date(base * 1000)
    d.setHours(hh)
    d.setMinutes(mm)
    return _.floor(d.getTime() / 1000)

}
function Interval({ interval, updateInterval, deleteInterval }) {
    const { start, end, elapsed } = interval
    const [editing, setEditing] = useState(false)
    const [startValue, setStartValue] = useState(formatTimeInSeconds(start))
    const [endValue, setEndValue] = useState(end ? formatTimeInSeconds(end) : null)

    const handleEditing = () => {
        setEditing(false)
        const startSeconds = getEpochSeconds(start, ...startValue.split(':'))
        const endSeconds = end ? getEpochSeconds(end, ...endValue.split(':')) : null
        updateInterval({
            start: startSeconds,
            end: endSeconds,
            elapsed: endSeconds ? endSeconds - startSeconds : null
        })
    }
    return <div>
        {
            !editing ? (
                <>
                    <i className="bi-x-circle-fill p-0 me-1"
                        style={{ color: 'red' }}
                        onClick={() => deleteInterval()} />
                    <div className="d-inline" onDoubleClick={() => setEditing(true)}>
                        {formatInterval(interval)}
                    </div>
                </>

            ) : (
                <InputGroup onKeyDown={e => e.key === 'Enter' && handleEditing()}>
                    <InputGroup.Text>Start</InputGroup.Text>
                    <Form.Control
                        size="sm"
                        value={startValue} onChange={e => setStartValue(e.target.value)} />
                    {end && (
                        <>
                            <InputGroup.Text>End</InputGroup.Text>
                            <Form.Control
                                size="sm"
                                placeholder={formatTimeInSeconds(end)}
                                value={endValue} onChange={e => setEndValue(e.target.value)} />
                        </>

                    )}
                </InputGroup>
            )
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
