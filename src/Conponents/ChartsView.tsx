import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { getTrainings } from "../TraininingApi";
import type { Training } from "./Types";

function ChartsView(){
  const [trainings, setTrainings] = useState<Training[]>([]);
  const margin = { top: 30, right: 30, left: 30, bottom: 25}
  
  useEffect(() => { 
      fetchTrainings();
  }, []);

  const fetchTrainings = () => {
    getTrainings()
      .then(trainingData => setTrainings(trainingData._embedded?.trainings))
      .catch((error: Error) => console.log(error))
  };

  return (
    <BarChart width={600} height={300} data={trainings} margin={margin}>
      <XAxis dataKey="activity" label={{ position: 'insideBottom', value: "Activity", offset: -10 }} />
      <YAxis label={{ position: 'insideTop', value: "Duration (min)", offset: 50, angle: -90, dy: 60 }} />
      <Bar dataKey="duration"  fill="#314158" />
    </BarChart>
  ) 
};
export default ChartsView;  
