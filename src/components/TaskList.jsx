import { formatTime, elapsedTime, isStopped, lastUpdated } from "../utils/utils";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useState } from "react";
import _ from 'lodash'
import { useEffect } from "react";

export function TaskList({ tasks, allTags, showDetails, onToggleStatus }) {
    // make sure the last updated one is on top. 
    const sortedTasks = _.sortBy(tasks, (task) => isStopped(task) ? lastUpdated(task) : 0)
    return (
        <ListGroup
        >
            {_.map(sortedTasks, (task) => (
                <div key={task.id}>
                    <SingleTask
                        task={task}
                        allTags={allTags}
                        showDetails={showDetails}
                        onToggleStatus={onToggleStatus}
                    />
                </div>
            ))}
        </ListGroup>
    )
}

function SingleTask({ task, allTags, showDetails, onToggleStatus }) {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        if (isStopped(task)) {
            setElapsed(elapsedTime(task))
        } else {
            // timer 
            const interval = setInterval(() => {
                setElapsed(elapsedTime(task))
            }, 1000);
            return () => clearInterval(interval)
        }
    }, [task])

    return (
        <ListGroupItem
            action
            onClick={() => showDetails(task.id)}
            className="p-0 border-0"
        >
            <div
                className="d-flex align-items-center"
            >
                <div
                    className={`${isStopped(task) ? 'bg-success' : 'bg-warning bi-stopwatch-fill'} px-1`}
                    onClick={(e) => { e.preventDefault(); onToggleStatus(task.id) }}>
                    {formatTime(elapsed)}
                </div>
                <div

                    className="px-1 me-auto"
                >
                    {task.title}
                </div>
            </div>
            <div className="border-bottom">
                {_.map(_.map(task.tags, t => _.find(allTags, { tag: t })), tag => (
                    <div className="d-inline rounded px-1"
                        key={tag.tag}
                        style={{
                            backgroundColor: tag.color
                        }}>
                        {tag.tag}
                    </div>
                ))}

            </div>
        </ListGroupItem >
    )
}
