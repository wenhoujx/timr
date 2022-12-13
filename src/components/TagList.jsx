import _ from 'lodash'
import { useState } from 'react'
import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap"

export function TagList({ tags, addTag }) {
    const [value, setValue] = useState('')
    const addNewTag = () => {
        console.log(value)
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
                    <ListGroupItem key={tag} className='d-flex align-items-center'>
                        <span >{tag}</span>
                        <Button className='ms-auto'>x</Button>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </>

    )

}
