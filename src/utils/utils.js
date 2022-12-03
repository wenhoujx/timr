import _ from "lodash"

export const TITLE = 'title'
export const START = 'start'
export const STOPPED = 'stopped'
export const ID = 'id'

export function newTask(task) {
    return {
        [ID]: _.uniqueId(),
        [TITLE]: task,
        [START]: _.now(),
        [STOPPED]: false
    }
}
