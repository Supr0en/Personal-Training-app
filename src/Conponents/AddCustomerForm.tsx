import { useState } from 'react';
import type { CustomerForm } from './Types';
import { saveCustomer } from '../CustomerApi';

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
      <button onClick={() => {handleOpen()}} className="px-4 py-2 m-1 bg-blue-500 text-white rounded">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Add new Customer</h2>
            <div className="mb-4">
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='Harvey' value={customerData.firstname} onChange={event => setCustomerData({...customerData, firstname: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='Specter' value={customerData.lastname} onChange={event => setCustomerData({...customerData, lastname: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='Manhattan' value={customerData.streetaddress} onChange={event => setCustomerData({...customerData, streetaddress: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='10005' value={customerData.postcode} onChange={event => setCustomerData({...customerData, postcode: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='New York City' value={customerData.city} onChange={event => setCustomerData({...customerData, city: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='harvey-specter@Suits.com' value={customerData.email} onChange={event => setCustomerData({...customerData, email: event.target.value})} />
              <input className="m-1 w-full p-1 border border-gray-300 rounded" type='text' placeholder='(212)555-5678' value={customerData.phone} onChange={event => setCustomerData({...customerData, phone: event.target.value})} />
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
