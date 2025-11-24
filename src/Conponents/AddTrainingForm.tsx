import { useEffect, useState } from 'react';
import type { TrainingFrom, Customer } from './Types';
import { saveTraining } from '../TraininingApi';
import { getCustomers } from '../Api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type addTrainingProps = {
  fetchTrainings: () => void;
}

export default function AddTrainingForm({fetchTrainings}: addTrainingProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingFrom>({
    date: "",
    duration: 0,
    activity: "",
    customer: ""
  });

  useEffect(() => {
    getCustomers()
      .then(customerData => setCustomers(customerData._embedded.customers))
      .catch(error => console.log(error))
  }, []);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setTrainingData({
      date: "",
      duration: 0,
      activity: "",
      customer: "",
    })
  }

  const handleSave = () => {
    saveTraining(trainingData)
      .then(() => {
        fetchTrainings();
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
              <DatePicker
                selected={trainingData.date ? new Date(trainingData.date) : null}
                onChange={(date) =>
                  setTrainingData((prev) => ({
                    ...prev,
                    date: date ? date.toISOString() : '', // store as ISO string
                  }))
                }
                className="m-1 w-full p-1 border border-gray-300 rounded"
                showDateSelect
                showTimeSelect
                dateFormat="dd/MM/yyyy hh:mm"
                placeholderText="dd/MM/yyyy hh:mm"
              />
              <input type='number' placeholder='30' value={trainingData.duration} onChange={event => setTrainingData({...trainingData, duration: event.target.value})} className="m-1 w-full p-1 border border-gray-300 rounded" />
              <input type='text' placeholder='Workout' value={trainingData.activity} onChange={event => setTrainingData({...trainingData, activity: event.target.value})} className="m-1 w-full p-1 border border-gray-300 rounded" />
              <select onChange={event => setTrainingData({...trainingData, customer: event.target.value})} className="m-1 w-full p-1 border border-gray-300 rounded">
                {customers.map(customer => (
                  <option key={customer._links.self.href} value={customer._links.self.href}>
                    {customer.firstname} {customer.lastname}
                  </option>
                ))}
              </select>
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
