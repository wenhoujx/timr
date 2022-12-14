import _ from 'lodash'
import { useState } from 'react'
import { Badge, Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap"

export function TagList({ tags, addTag, removeTag }) {
    const [value, setValue] = useState('')
    const addNewTag = () => {
        if (_.isEmpty(value)) {
            return 
        } 

        addTag(value)
        setValue("")
    }
    return (
        <>
            <FormControl
                placeholder='+new tag'
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={(e) => { e.key === 'Enter' && addNewTag() }}
            />
            <ListGroup>
                {_.map(tags, (tagValue, tag) => (
                    <ListGroupItem
                        key={tag}
                        className='d-flex align-items-center p-0 bg-info rounded me-auto'>
                        <span className='px-1'>{tag}</span>
                        <Badge onClick={() => removeTag(tag)}>x</Badge>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </>

    )

}
