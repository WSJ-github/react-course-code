import dayjs from 'dayjs';
import Calendar from './Calendar';
import { useState } from 'react';

function App() {
  const [value, setValue] =  useState(dayjs('2023-11-08'));

  return (
    <div className="App">
      <Calendar value={value} onChange={(val) => {
        console.log('触发了change～') // 这里会触发两次
        setValue(val)
      }}></Calendar>
    </div>
  );
}

export default App;