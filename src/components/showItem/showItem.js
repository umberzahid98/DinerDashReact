import { useParams, Link } from 'react-router-dom'
import { getItemById } from '../../api'
import { constants } from '../../util/constant'
import React, { useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './showItem.css'

const ShowItem = () => {
  const { id } = useParams()
  const [item, setItem] = useState([])

  const getItem = async () => {
    const itemById = await getItemById(id)
    setItem(itemById)
  }

  useEffect(() => {
    getItem()
  }, [])

  return (
    <div className='show_page'>
      <div className='card shadow-sm show_main_div'>
        <Col className='item_info'>
          <Row className='title'>
            {item.title}
          </Row>
          <span className='show_box' />
          <div className='price_status_tag'>
            <div className='item_status'>{item.status}</div>
            <div className='price'>{constants.CURRENCY} {item.price}</div>
          </div>
          <Row>
            <hr className='hr' />
          </Row>
          <Row className='description_heading'>
            {constants.DESCRIPTION}
          </Row>
          <Row className='description'>
            {item.description}
          </Row>
          <Row className='back'><Link to='/' className='btn btn-warning'>{constants.BACK}</Link></Row>
        </Col>
      </div>
    </div>
  )
}
export default ShowItem
