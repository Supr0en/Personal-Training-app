import type { TrainingForm } from "./Conponents/Types";

export function getTrainings() {
    return fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings")
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error when fetching customers" + response.statusText,
          );
        return response.json();
      })
}; 

export function saveTraining( newTraining: TrainingForm ) {
    return fetch("https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings", {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newTraining)
    })
    .then((response) => {
        if (!response.ok)
          throw new Error("Failed to create Customer: " + response.statusText);
        response.json();
    })
}

export function deleteTraining(url: string) {
  return fetch(url, { method: 'DELETE' })
    .then((response) => {
      if(!response.ok)
        throw new Error("Failed to delete Customer: " + response.statusText);
      response.json();
    })
}
