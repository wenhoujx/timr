import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup } from "react-bootstrap"
import { formatTime } from '../utils/utils'

function computeTimes(tags, getTime) {
    return _.sortBy(_.map(tags, tag => [tag, getTime(tag.tag)]), ([tag, time]) => -time)
}

export function TagList({ tags, getTagTime, addTag, removeTag, updateTagColor }) {
    const [times, setTimes] = useState(computeTimes(tags, getTagTime))
    const [value, setValue] = useState('')
    const [editing, setEditing] = useState(-1)
    const addNewTag = () => {
        if (_.isEmpty(value)) {
            return
        }
        addTag(_.trim(value))
        setValue("")
    }
    useEffect(() => {
        setTimes(computeTimes(tags, getTagTime))
    }, [tags])
    const refreshTimes = () => {
        setTimes(computeTimes(tags, getTagTime))
    }

    return (
        <InputGroup size='sm'>
            <div className='d-flex justify-content-start flex-wrap'
            >
                <Button
                    size='sm'
                    className='bi-arrow-clockwise'
                    onClick={refreshTimes} />
                <Form.Control
                    className='p-0'
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
                        {editing === tag.tag ? (
                            <Form.Control
                                className='p-0'
                                style={{ height: '31px' }}
                                type="color"
                                value={tag.color}
                                onChange={e => { updateTagColor(tag.tag, e.target.value); setEditing(-1) }}
                                onBlur={() => setEditing(-1)}
                                autoFocus
                            />
                        ) : (
                            <span
                                className='ps-1'
                                style={{ backgroundColor: tag.color }}
                                onDoubleClick={() => setEditing(tag.tag)}
                            >{tag.tag}:{formatTime(getTagTime(tag.tag))}</span>

                        )}
                        <Button
                            size='sm'
                            className='bi-trash-fill border-0'
                            style={{
                                backgroundColor: tag.color
                            }}
                            onClick={() => removeTag(tag.tag)}
                        />
                    </div>

                ))}
            </div>

        </InputGroup>
    )
}
