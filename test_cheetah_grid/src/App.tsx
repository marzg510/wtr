import React from 'react';
import logo from './logo.svg';
import './App.css';

import CheetahGrid from 'cheetah-grid';
import Column from 'cheetah-grid';

type Record = {
  personid: number;
  fname: string;
  lname: string;
  email: string;
};

const records: Record[] = [
  {
    personid: 1,
    fname: "Sophia",
    lname: "Hill",
    email: "sophia_hill@example.com",
  },
  {
    personid: 2,
    fname: "Aubrey",
    lname: "Martin",
    email: "aubrey_martin@example.com",
  },
];

function App() {
  return (
    <div className="App">
      <CheetahGrid
        style={{ flexGrow: 1 }}
        data={records}
        theme={"BASIC"}
      >
        <Column field="personid" width={50}>
          ID
        </Column>
        <Column field="fname" width={100}>
          First Name
        </Column>
        <Column field="lname" width={100}>
          Last Name
        </Column>
        <Column field="email" width={300}>
          E-Mail
        </Column>
      </CheetahGrid>
    </div>
  );
}

export default App;
