import _ from "lodash";
import { Button } from "react-bootstrap";
import { getTagTime } from "../utils/utils";

function toJson(state) {
    return JSON.stringify({
        tag: _.map(state.tags, t => ({
            ...t,
            elapsed: getTagTime(t.tag)
        })),
        tasks: state.tasks,
    })
}

export function TopControls({ state, reset }) {
    const date = new Date()
    return (
        <div className="d-flex">
            <Button
            size="sm"
                href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    toJson(state)
                )}`}
                download={`tasks-${date.getMonth()}-${date.getDate()}.json`}
            >
                Export JSON
            </Button>

            <Button 
            size="sm"
            className="ms-auto btn-danger" onClick={() => reset()} >Reset</Button>

        </div>
    )
}
