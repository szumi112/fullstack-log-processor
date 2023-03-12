import React, { useState } from "react";
import Form from "./components/form";
import LogsList from "./components/logs-list";

interface Log {
  _id: string;
  processedLog: string;
}

const App: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(5);

  const addLog = (newLog: Log) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
    setPage(Math.ceil((logs.length + 1) / perPage));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      const lastPage = Math.ceil(logs.length / perPage);
      return nextPage > lastPage ? prevPage : nextPage;
    });
  };

  return (
    <>
      <Form addLog={addLog} />
      <LogsList
        logs={logs}
        setLogs={setLogs}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        currentPage={page}
        perPage={perPage}
        totalLogs={logs.length}
        setPage={setPage}
      />
    </>
  );
};

export default App;
