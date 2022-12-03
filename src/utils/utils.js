import _ from "lodash"

export const TITLE = 'title'
export const ID = 'id'
export const DURATIONS = 'durations'
export const ELAPSED = 'elapsed'
export const START = 'start'
export const END = 'end'


function startDuration() {
    return {
        start: now_in_seconds(),
        end: null,
        elapsed: null
    }
}

export function isStopped(task) {
    return _.every(task.durations, dur => !_.isNull(dur.end))
}
export function toggleTask(task) {
    if (isStopped(task)) {
        return {
            ...task, 
            durations: [...task.durations, startDuration()]
        }
    } else {
        return endTask(task)
    }
}
function endTask(task) {
    const now = now_in_seconds()
    return {
        ...task,
        durations: _.map(task.durations, dur => {
            if (dur.end) {
                return dur
            } else {
                return {
                    ...dur,
                    end: now,
                    elapsed: now - dur.start
                }
            }
        })

    }
}

export function newTask(task) {
    return {
        id: _.uniqueId(),
        title: task,
        durations: [
            startDuration()
        ]
    }
}

export function elapsedTime(task) {
    return _.sum(_.map(task.durations, dur => {
        if (dur.elapsed) {
            return dur.elapsed
        } else {
            return (_.defaultTo(dur.end, now_in_seconds()) - dur.start)
        }
    }))
}

export function totalElapsedTime(tasks) {
    return _.sum(_.map(tasks, elapsedTime))
}

function now_in_seconds() {
    return _.floor(_.now() / 1000)
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