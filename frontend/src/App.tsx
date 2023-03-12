import React, { useState } from "react";
import Form from "./components/form";
import LogsList from "./components/logs-list";

interface Log {
  _id: string;
  processedLog: string;
}

const App: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  const addLog = (newLog: Log) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  return (
    <>
      <Form addLog={addLog} />
      <LogsList logs={logs} setLogs={setLogs} />
    </>
  );
};

export default App;
