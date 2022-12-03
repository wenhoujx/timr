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

export function formatTime(elapsed) {
    if (elapsed < 100) {
        return `${elapsed}s`
    } else {
        const hours = _.floor(elapsed / 3600)
        const minutes = _.floor((elapsed % 3600) / 60)
        const seconds = elapsed % 60
        var out = seconds + 's'
        if (minutes !== 0) {
            out = minutes + 'm' + out
        }
        if (hours !== 0) {
            out = hours + 'h' + out
        }
        return out
    }
}
