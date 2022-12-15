import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Button } from "react-bootstrap"
import { formatTime } from '../utils/utils'

function computeTimes(tags, getTime) {
    return _.sortBy(_.map(tags, tag => [tag, getTime(tag.tag)]), ([tag, time]) => -time)
}

export function TagList({ tags, getTagTime, addTag, removeTag }) {
    const [times, setTimes] = useState(computeTimes(tags, getTagTime))
    const [value, setValue] = useState('')
    const addNewTag = () => {
        if (_.isEmpty(value)) {
            return
        }
        addTag(value)
        setValue("")
    }
    useEffect(() => {
        setTimes(computeTimes(tags, getTagTime))
    }, [tags])
    const refreshTimes = () => {
        setTimes(computeTimes(tags, getTagTime))
    }

    return (
        <div className='d-flex justify-content-start flex-wrap'
        >
            <Button size='sm' onClick={refreshTimes}><i className='icon bi-arrow-clockwise' /></Button>
            <input
                style={{ width: '7rem' }}
                placeholder='+new tag'
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={(e) => { e.key === 'Enter' && addNewTag() }}
            />
            {_.map(times, ([tag, time]) => (
                <div
                    key={tag.tag}
                    className='d-flex align-items-center p-0 rounded'
                    style={{
                        backgroundColor: tag.color
                    }}
                    >
                    <span className='px-1'>{tag.tag}: {formatTime(time)}</span>
                    <Button size='sm' onClick={() => removeTag(tag.tag)}>x</Button>

                </div>

            ))}
        </div>
    )
}
