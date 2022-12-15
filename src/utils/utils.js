import _, { random, sum } from "lodash"

export const TITLE = 'title'
export const ID = 'id'
export const DURATIONS = 'durations'
export const ELAPSED = 'elapsed'
export const START = 'start'
export const END = 'end'


function startDuration() {
    return {
        // hack so that new task are sorted at the top :(
        start: now_in_seconds(),
        end: null,
        elapsed: null
    }
}

export function lastUpdated(task) {
    const lastDuration = _.last(task.durations)
    return lastDuration.end ? lastDuration.end : now_in_seconds()
}

export function isStopped(task) {
    return _.every(task.durations, dur => !_.isNull(dur.end))
}

export function updateTaskTitle(task, newTitle) {
    return {
        ...task,
        title: newTitle,
    }
}


export function toggleTask(task) {
    if (isStopped(task)) {
        return {
            ...task,
            durations: [...task.durations, startDuration()],
        }
    } else {
        return endTask(task)
    }
}

export function removeTag(task, tag) {
    return {
        ...task,
        tags: _.omit(task.tags, [tag])
    }
}

export function endTask(task) {
    const now = now_in_seconds()
    return {
        ...task,
        durations: _.map(task.durations, dur => {
            if (dur.end) {
                return dur
            } else {
                return {
                    ...dur,
                    // so that the newly added are added to the top. 
                    end: now,
                    elapsed: now - dur.start
                }
            }
        })
    }
}

export function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export function getTagTime(taskList, tag) {
    return _.sum(
        _.map(
            _.filter(taskList, task => _.includes(task.tags, tag)),
            task => elapsedTime(task)))
}

export function removeTaskTag(task, tag) {
    return {
        ...task,
        tags: _.without(task.tags, tag)
    }
}

export function addTaskTag(task, tag) {
    return {
        ...task,
        tags: _.uniq([...task.tags, tag])
    }
}

export function newTag(tag) {
    return {
        tag,
        color: randomColor()
    }
}

function randomId() {
    return Math.floor(Math.random() * 10000)
}
export function newTask(task) {
    return {
        id: randomId(),
        title: task,
        durations: [
            startDuration()
        ],
        tags: []
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
