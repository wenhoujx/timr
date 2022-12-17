import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup, OverlayTrigger, Popover } from "react-bootstrap"
import { SliderPicker } from 'react-color'
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
                    className='d-flex align-items-center'
                    size='sm'
                    style={{ height: '26px' }}
                    onClick={refreshTimes} >
                    <i className='bi-arrow-clockwise' />
                </Button>
                <Form.Control
                    className='p-0'
                    style={{
                        width: '7rem',
                    }}
                    placeholder='+new tag'
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={(e) => { e.key === 'Enter' && addNewTag() }}
                />
                <div
                    className='d-flex align-items-center px-1 bg-info rounded'

                >
                    Total: {formatTime(_.sum(_.map(times, t => t[1])))}
                </div>

                {_.map(times, ([tag, time]) => (
                    <div
                        key={tag.tag}
                        className='d-flex align-items-center p-0 rounded'
                        style={{
                            backgroundColor: tag.color
                        }}
                    >
                        <OverlayTrigger
                            trigger="click"
                            placement={'bottom'}
                            rootClose
                            overlay={
                                <Popover
                                    style={{ width: '15rem' }}
                                >
                                    <Popover.Body>
                                        <SliderPicker
                                            color={tag.color}
                                            onChangeComplete={color => { updateTagColor(tag.tag, color.hex); setEditing(-1) }}
                                        />
                                    </Popover.Body>
                                </Popover>
                            }
                        >
                            <span
                                className='ps-1'
                                style={{ backgroundColor: tag.color }}
                                onDoubleClick={() => setEditing(tag.tag)}
                            >{tag.tag}:{formatTime(time)}</span>
                        </OverlayTrigger>
                        <Button
                            size='sm'
                            className='bi-trash-fill border-0 p-0 pe-1'
                            style={{
                                backgroundColor: tag.color,
                                color: 'black'
                            }}
                            onClick={() => removeTag(tag.tag)}
                        />
                    </div>

                ))}
            </div>

        </InputGroup >
    )
}
