import type { CustomerForm } from "./Conponents/Types";

export function getCustomers(){
    return fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers")
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error when fetching customers" + response.statusText,
          )
        return response.json();
      });
  }; 

export function saveCustomer(newCustomer: CustomerForm ) {
    return fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newCustomer)
    })
    .then((response) => {
        if (!response.ok)
          throw new Error("Failed to create Customer: " + response.statusText);
        response.json();
    })
}

export function deleteCustomer(url: string) {
  return fetch(url, { method: 'DELETE' })
    .then((response) => {
      if(!response.ok)
        throw new Error("Failed to delete Customer: " + response.statusText);
      response.json();
    });
}
