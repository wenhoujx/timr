import _ from 'lodash'
import { useState } from 'react'
import { Button } from "react-bootstrap"
import { formatTime } from '../utils/utils'

function computeTimes(tags, getTime) {
    return _.sortBy(_.map(_.keys(tags), tag => [tag, getTime(tag)]), ([tag, time]) => -time)
}

export function TagList({ tags, getTagTime, addTag, removeTag }) {
    const [times, setTimes] = useState(computeTimes(tags, getTagTime))
    const [value, setValue] = useState('')
    const addNewTag = () => {
        if (_.isEmpty(value)) {
            return
        }
        addTag(value)
        setTimes(prev => [...prev, [value, 0]])
        setValue("")
    }

    const refreshTimes = () => {
        setTimes(computeTimes(tags, getTagTime))
    }
    return (
        <div className='d-flex justify-content-start flex-wrap'
        >
            <Button size='sm' onClick={refreshTimes}>Refresh</Button>
            <input
                style={{ width: '7rem' }}
                placeholder='+new tag'
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={(e) => { e.key === 'Enter' && addNewTag() }}
            />
            {_.map(times, ([tag, time]) => (
                <div
                    key={tag}
                    className='d-flex align-items-center p-0 bg-info rounded'>
                    <span className='px-1'>{tag}: {formatTime(time)}</span>
                    <Button size='sm' onClick={() => removeTag(tag)}>x</Button>

                </div>

            ))}
        </div>
    )
}
