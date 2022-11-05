import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';
import OrderRow from './OrderRow';

const Orders = () => {
    const { user, logOut } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/orders?email=${user?.email}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('genius-token')}`
            }
        })
            .then(res => {
                if (res.status === 401 || res.status === 403) {
                    return logOut()
                }
                return res.json()
            })
            .then(data => {
                setOrders(data)
            })
    }, [user?.email, logOut])

    const handleDelete = id => {
        fetch(`http://localhost:5000/orders/${id}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem('genius-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.deletedCount > 0) {
                    alert("Order Cancel Successfully");
                    const remaining = orders.filter(order => order._id !== id);
                    setOrders(remaining)
                }
            })
            .catch(error => console.error(error))
    }

    const handleUpdate = id => {
        fetch(`http://localhost:5000/orders/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': "application/json",
                authorization: `Bearer ${localStorage.getItem('genius-token')}`
            },
            body: JSON.stringify({ status: "APPROVED" })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.modifiedCount > 0) {
                    const remaining = orders.filter(order => order._id !== id);
                    const approving = orders.find(order => order._id === id);
                    approving.status = "APPROVED";
                    const newOrders = [approving, ...remaining];
                    setOrders(newOrders);
                }
            })
    }

    return (
        <div>
            <h3 className='text-3xl'>You have total: {orders.length} orders</h3>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Cancel</th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map(order => <OrderRow
                                key={order._id}
                                order={order}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                            ></OrderRow>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;