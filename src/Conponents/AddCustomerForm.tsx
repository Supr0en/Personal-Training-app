import { useState } from 'react';
import type { CustomerForm } from './Types';
import { saveCustomer } from '../Api';

type addCustomerProps = {
  fetchCustomers: () => void;
}

export default function AddCustomerForm({fetchCustomers}: addCustomerProps) {
  const [open, setOpen] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerForm>({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    email: "",
    phone: "",
  });

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setCustomerData({
      firstname: "",
      lastname: "",
      streetaddress: "",
      postcode: "",
      city: "",
      email: "",
      phone: "",
    })
  }

  const handleSave = () => {
    saveCustomer(customerData)
      .then(() => {
        fetchCustomers();
      })
    handleClose();
  }
  return (
    <>
      <button onClick={() => {handleOpen()}} className="px-4 py-2 bg-blue-500 text-white rounded">
        Open Dialog
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Add new Customer</h2>
            <div className="mb-4">
              <input type='text' placeholder='kela' value={customerData.firstname} onChange={event => setCustomerData({...customerData, firstname: event.target.value})} />
              <input type='text' placeholder='kelamaa' value={customerData.lastname} onChange={event => setCustomerData({...customerData, lastname: event.target.value})} />
              <input type='text' placeholder='6 street' value={customerData.streetaddress} onChange={event => setCustomerData({...customerData, streetaddress: event.target.value})} />
              <input type='text' placeholder='00100' value={customerData.postcode} onChange={event => setCustomerData({...customerData, postcode: event.target.value})} />
              <input type='text' placeholder='Helsinki' value={customerData.city} onChange={event => setCustomerData({...customerData, city: event.target.value})} />
              <input type='text' placeholder='kela@esimerkki.com' value={customerData.email} onChange={event => setCustomerData({...customerData, email: event.target.value})} />
              <input type='text' placeholder='323-23456789' value={customerData.phone} onChange={event => setCustomerData({...customerData, phone: event.target.value})} />
            </div>
            <button onClick={handleClose} className="px-4 py-2 bg-red-500 text-white rounded"> 
              Close
            </button>
            <button onClick={handleSave} className='px-4 py-2 bg-green-500 text-white rounded'>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
