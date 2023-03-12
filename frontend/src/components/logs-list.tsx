import React, { useState, useEffect } from "react";

interface Log {
  _id: string;
  processedLog: string;
}

interface LogsListProps {
  logs: Log[];
  setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
}

const LogsList: React.FC<LogsListProps> = ({ logs, setLogs }) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const ws: WebSocket = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (message: MessageEvent) => {
      const data = JSON.parse(message.data.toString());
      setLogs((prevLogs) => {
        // Filter out logs with duplicate _id values before appending new logs to the existing logs
        const newLogs = data.filter(
          (log: Log) => !prevLogs.find((prevLog) => prevLog._id === log._id)
        );
        return [...prevLogs, ...newLogs];
      });
      setLoading(false);
    };

    ws.onerror = (event: Event) => {
      const errorMessage = (event as ErrorEvent).message;
      console.error("WebSocket error:", errorMessage);
      setError(errorMessage);
      setLoading(false);
    };

    ws.onclose = (event: CloseEvent) => {
      console.log(
        `WebSocket disconnected: code=${event.code} reason=${event.reason}`
      );
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []); // Only run this effect once on mount

  return (
    <div className="list">
      <h2>Live Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {logs.map((log) => (
              <li key={log._id}>
                <pre>{log.processedLog}</pre>
              </li>
            ))}
          </ul>
          {logs.length === 0 && <p>No logs found</p>}
          {error && <p>Error: {error}</p>}
        </>
      )}
    </div>
  );
};

export default LogsList;
