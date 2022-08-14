import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Form } from 'react-bootstrap'
import { updateItems, getAllCategories, getAllItems } from '../../api'
import { constants } from '../../util/constant'
import './items.css'
import Axios from 'axios'
import Button from 'react-bootstrap/Button'
import Multiselect from 'multiselect-react-dropdown'

export const ItemComponent = () => {
  const [categories, setCategories] = useState()
  const [items, setItems] = useState([])
  const [item, setItem] = useState({ title: '', description: '', price: 0, selectedCategories: [] })
  const [show, setShow] = useState(false)
  const [changeRole, setChangeRole] = useState('Change to Admin')
  const [currentUser, setCurrentUser] = useState(4)
  const [errorMessage, setErrorMessage] = useState('')
  const categories_ids = []

  useEffect(() => {
    getItems()
  }, [])

  // show model
  const handleClose = () => {
    setErrorMessage("")
    setShow(false)}
  // hide model
  const handleShow = () => setShow(true)
  // change role between user and admin
  const roleHandler = (event) => {
    if (changeRole === 'Change to Admin') {
      setChangeRole('Change to User')
      setCurrentUser(6)
    } else {
      setChangeRole('Change to Admin')
      setCurrentUser(4)
    }
  }
  // change status of item (retired or available)
  const changeStatus = async (status, item) => {
    const { id } = item
    const udpatedItem = await updateItems(id, { item: { status } })
    setItems(udpatedItem)
  }
  // get all items and categories
  const getItems = async () => {
    const allItems = await getAllItems()
    const allCategories = await getAllCategories()

    setItems(allItems)
    setCategories(allCategories)
  }
  // add new item
  const handleAddItem = async () => {
    item.selectedCategories.map(el => {
      categories.map(c => {
        if (c.name === el) {
          categories_ids.push(c.id)
        }
      })
    })

    await Axios.post('http://localhost:3000/items.json', { item: { title: item.title.charAt(0).toUpperCase() + item.title.slice(1), description: item.description.charAt(0).toUpperCase() + item.description.slice(1), price: item.price, status: 'permit', category_ids: categories_ids } })
      .then(() => {
        getItems()
        handleClose()
      })
      .catch((errors) => {
        console.log(Object.entries(errors.response.data))
        setErrorMessage(Object.entries(errors.response.data))

      })
  }

  return (
    <div className='row'>
      {currentUser === 6 && <button onClick={handleShow} className='btn  btn-lg add_item'>{constants.ADD_ITEM}</button>}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{constants.NEW_ITEM}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddItem}>
            <Form.Group controlId='formTitle'>
            {errorMessage && <>
              {errorMessage.map((el,index)=>(
                <div key={index} className='error'> {el[0]}  {el[1]}  </div>
              ))}
            </>}
              <Form.Label>{constants.TITLE}</Form.Label>
              <Form.Control onChange={(event) => { setItem({ ...item, title: event.target.value }) }} type='text' placeholder='Enter title' />
            </Form.Group>
            <Form.Group controlId='formDescription'>
              <Form.Label>{constants.DESCRIPTION}</Form.Label>
              <Form.Control onChange={(event) => { setItem({ ...item, description: event.target.value }) }} type='text' placeholder='Enter description' />
            </Form.Group>
            <Form.Group controlId='formPrice'>
              <Form.Label>{constants.PRICE}</Form.Label>
              <Form.Control onChange={(event) => { setItem({ ...item, price: event.target.value }) }} type='text' placeholder='Enter price' />
            </Form.Group>

            <Form.Group controlId='formPrice'>
              <Form.Label>{constants.CATEGORY}</Form.Label>
              <Multiselect
                isObject={false}
                onKeyPressFn={function noRefCheck () {}}
                onRemove={(event) => { setItem({ ...item, selectedCategories: event }) }}
                onSearch={function noRefCheck () {}}
                onSelect={(event) => { setItem({ ...item, selectedCategories: event }) }}
                options={categories && categories.map(el => el.name)}
              />
            </Form.Group>
            <br />

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={handleAddItem}>
            {constants.CREATE}
          </Button>
        </Modal.Footer>
      </Modal>
      <button className='btn  btn-lg changeRole' onClick={roleHandler}>{changeRole}</button>
      <hr/>
      {items.map(item => {
        if ((currentUser === 4 && item.status === 'permit') || currentUser === 6) {
          return (
           <div key={item.id} className='card text-center itemCard'>
                <div key={item.id} className='card-body'>
                  <h5 className='card-title'><Link to={`/items/${item.id}`} className='item_partial'>{item.title}</Link></h5>
                  <p className='card-text'>{item.description}</p>
                  {item.status === 'permit' ? <div>{(currentUser === 6) && <button onClick={() => { changeStatus('not_permit', item) }} type='submit' className='btn btn-danger mr-2'>{constants.RETIRE_ITEM}</button>}</div> : <div>{(currentUser === 6) && <button onClick={() => { changeStatus('permit', item) }} type='submit' className='btn btn-danger mr-2'>{constants.MARK_AS_AVAILABLE}</button>}</div>}
                  <br />
                  <div className='btn-group' role='group' aria-label='...'>
                    {(currentUser === 6) && <button type='button' className='btn btn-warning' data-toggle='modal' data-target='#myupdateitem_< item.id>'>{constants.EDIT}</button>}
                  </div>
                  <br />
                  <br />
                  <div />
                  {((currentUser === 6) && (item.status === 'not_permit')) && <div className='retired_message'>{constants.RETIRED}</div>}
                  {(currentUser === 4) && <button type='submit' className='btn btn-primary'>{constants.ADD_TO_CART}</button>}
                </div>
              </div>
          )
        }
      })}
    </div>
  )
}
