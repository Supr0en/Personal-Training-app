import { useState } from "react";
import type { CustomerForm, Customer } from "./Types";

type EditCustomerProps = {
  fetchCustomers: () => void;
  customerRow: Customer;
}
export default function EditCustomerForm({fetchCustomers, customerRow}: EditCustomerProps) {
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
    setCustomerData({
      firstname: customerRow.firstname,
      lastname: customerRow.lastname,
      streetaddress: customerRow.streetaddress,
      postcode: customerRow.postcode,
      city: customerRow.city,
      email: customerRow.email,
      phone: customerRow.phone,
    });
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
    fetch(customerRow._links.customer.href, {
      method: 'PUT',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify(customerData)
    })
      .then(response => {
        if(!response.ok)
          throw new Error("Error when editing customer");
        return response.json();
      })
      .then(() => {
        fetchCustomers();
      })
      .catch(err => console.log(err))
    handleClose();
  }
  return (
    <>
      <button onClick={handleOpen} className="px-3 py-1 bg-blue-500 text-white rounded">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <h2 className="text-lg font-bold mb-4">Edit Customer Info</h2>
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
