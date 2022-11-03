import React, { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider/AuthProvider';

const Checkout = () => {
    const { title, price, _id } = useLoaderData();
    const { user } = useContext(AuthContext);

    const handlePlaceOrder = event => {
        event.preventDefault();
        const form = event.target;
        const name = `${form.firstName.value} ${form.lastName.value}`;
        const email = user?.email || "unregistered"
        const phone = form.phone.value;
        const message = form.message.value;

        const order = {
            service: _id,
            serviceName: title,
            customer: name,
            price,
            email,
            phone,
            message
        }

        fetch("http://localhost:5000/orders", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(order),
        })
            .then(res => res.json())
            .then(result => {
                if (result.acknowledged) {
                    form.reset()
                    alert("Ordered submitted successfully")
                    console.log(result)
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <div>
            <form onSubmit={handlePlaceOrder}>
                <h2 className='text-4xl'>You are about to order: {title}</h2>
                <h4 className="text-3xl">Price: ${price}</h4>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <input type="text" name="firstName" placeholder="First Name" className="input input-bordered w-full" />
                    <input type="text" name="lastName" placeholder="Last Name" className="input input-bordered w-full" />
                    <input type="text" name="phone" placeholder="Your Phone" className="input input-bordered w-full" />
                    <input type="text" name="email" placeholder="Your email" defaultValue={user?.email} readOnly className="input input-bordered w-full" />
                </div>
                <textarea name="message" className="textarea textarea-bordered h-24 w-full my-3" placeholder="Your message"></textarea>
                <button type='submit' className="btn btn-warning mb-3">Submit</button>
            </form>
        </div>
    );
};

export default Checkout;