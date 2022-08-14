import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './orders.css'
import { constants } from '../../util/constant'
import { useState, useEffect } from 'react'
import { getAllOrderItems, userConfirmedItems, updateOrders, getFilteredOrders } from '../../api'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [summaryOrders, setSummaryOrders] = useState([])

  useEffect(() => {
    getOrders()
  }, [])

  // get all orders
  const getOrders = async () => {
    const orderdItems = await getAllOrderItems()
    const usersConfirmedItems = await userConfirmedItems()
    setOrders(orderdItems)
    setUsers(usersConfirmedItems)
    setSummaryOrders(orderdItems)
  }
  // find length of all orders by status
  const statusLength = (lengthStyle, label, status) => {
    return (
      <div className={`ml-2 ${lengthStyle}`}> {label}
        <hr />
        {summaryOrders.filter(function (temp) { return (temp.status === status) }).length}
      </div>
    )
  }
  // filter order search
  const filterButton = (status, label) => {
    return (
      <button onClick={() => { filterOrders(status) }} className='btn btn-info ml-1 filter_button'>{label} </button>)
  }
  // update order
  const updateOrder = async (status, order) => {
    const { id } = order
    const udpatedItem = await updateOrders(id, { order: { status } })
    setOrders(udpatedItem)
    setSummaryOrders(udpatedItem)
  }

  const filterOrders = async (status) => {
    const filteredOrder = await getFilteredOrders({ params: { search: status } })
    setOrders(filteredOrder)
  }

  const getDate = (order) => {
    return order.created_at.slice(0, 10)
  }

  const getTime = (order) => {
    return order.created_at.slice(11, 19)
  }

  const findUser = (users, order) => {
    const data = users.filter(el => el.id === order.user_id)
    return data[0].email
  }

  const findName = (users, order) => {
    const data = users.filter(el => el.id === order.user_id)
    return data[0].full_name
  }

  return (
    <div>
      <div className='row summary_heading'>
        <div className='card text-white bg-info mb-3 summary_card'>
          <div className='card-header'>{constants.SUMMARY}</div>
          <div className='card-body'>
            <div />
            <div className='row'>
              {statusLength('ordered_status', 'Ordered:', 'ordered')}
              {statusLength('paid_status', 'Paid:', 'paid')}
              {statusLength('cancelled_status', 'Cancelled:', 'cancelled')}
              {statusLength('completed_status', 'Completed:', 'completed')}
            </div>
          </div>
        </div>
        <div className='card text-white bg-warning mb-3 ml-5 filter_heading'>
          <div className='card-header'>{constants.FILTER_HEADING}</div>
          <div className='card-body'>
            {filterButton('ordered', 'Ordered')}
            {filterButton('paid', 'Paid')}
            {filterButton('cancelled', 'Cancelled')}
            {filterButton('completed', 'Completed')}
          </div>
        </div>
      </div>
      <div id='selected_status' className='ml-2 selected_status_div styles.selected_status'> </div><br />

      {orders.map(order => (
        <div key={order.id} className='jumbotron md-col-8 order_div'>
          <Row>
            <Col>
              <h5 className='display-4 '>{constants.ORDER}</h5>
            </Col>
            <Col>
              <Row className='status_change_div'>
                {order.status === 'completed' ? <Col><h6 className='completed_tag'>{constants.COMPLETED} </h6></Col> : order.status === 'cancelled' ? <Col><h6 className='cancelled_tag'> {constants.CANCELLED}</h6></Col> : <div />}
                {order.status === 'ordered' || order.status === 'paid' ? <Col><button onClick={() => { updateOrder('cancelled', order) }} className='cancelled_button'> {constants.CANCEL}</button></Col> : <></>}
                {order.status === 'ordered' ? <Col><button onClick={() => { updateOrder('paid', order) }} className='paid_button'>{constants.MARK_PAID}</button></Col> : <></>}
                {order.status === 'paid' ? <Col><button onClick={() => { updateOrder('completed', order) }} className='completed_button'>{constants.MARK_COMPLETED}</button></Col> : <></>}
              </Row>
            </Col>
          </Row>
          <Row className='info_div'>
            <Col><h6 className='ml-5'>{constants.NAME} {findName(users, order)}</h6></Col>
            <Col><h6 className='ml-5'>{constants.EMAIL}  {findUser(users, order)}</h6></Col>
          </Row>
          <Row className='row ml-1 order_info'>
            <Col><h5 className='mt-1 display-7 '>{constants.BILL}{order.price}</h5></Col>
            <Col><div className='ml-2 mt-0 ordered_status'> {order.status}</div></Col>
            <Col><h6>{constants.DATE} {getDate(order)} </h6></Col>
            <Col><h6 className='ml-5'>{constants.TIME} {getTime(order)} </h6></Col>
          </Row>
        </div>
      ))}
    </div>
  )
}
export default Orders
