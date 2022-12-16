import _, { random, sample, sum } from "lodash"

export const TITLE = 'title'
export const ID = 'id'
export const ELAPSED = 'elapsed'
export const START = 'start'
export const END = 'end'


function startInterval() {
    return {
        // hack so that new task are sorted at the top :(
        start: now_in_seconds(),
        end: null,
        elapsed: null
    }
}

export function lastUpdated(task) {
    if (_.isEmpty(task.intervals)) {
        return now_in_seconds()
    }
    const lastInterval = _.last(task.intervals)
    return lastInterval.end ? lastInterval.end : now_in_seconds()
}

export function isStopped(task) {
    return _.every(task.intervals, dur => !_.isNull(dur.end))
}

export function updateTaskIntervals(task, intervals) {
    return {
        ...task,
        intervals: intervals
    }
}

export function updateTaskNotes(task, notes) {
    return {
        ...task,
        notes
    }
}
export function updateTaskTitle(task, title) {
    return {
        ...task,
        title
    }
}


export function toggleTaskStatus(task) {
    if (isStopped(task)) {
        return {
            ...task,
            intervals: [...task.intervals, startInterval()],
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
        intervals: _.map(task.intervals, dur => {
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
    return _.sample(COLORS)
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
        notes: "",
        intervals: [
            startInterval()
        ],
        tags: []
    }
}

export function elapsedTime(task) {
    return _.sum(_.map(task.intervals, dur => {
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

export function now_in_seconds() {
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


// from github default colors 
// https://gist.github.com/borekb/d61cdc45f0c92606a92b15388cf80185
const COLORS = [
    '#b60205', '#e99695',
    '#d93f0b', '#f9d0c4',
    '#fbca04', '#fef2c0',
    '#0e8a16', '#c2e0c6',
    '#006b75', '#bfdadc',
    '#1d76db', '#c5def5',
    '#0052cc', '#bfd4f2',
    '#d4c5f9',
];
