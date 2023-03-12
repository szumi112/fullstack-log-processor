import React, { useState } from "react";
import axios from "axios";

function LogReportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [log, setLog] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { name, email, log };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/submit-log-report",
        formData
      );

      console.log("Server response:", response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="log">Log:</label>
        <textarea
          id="log"
          required
          value={log}
          onChange={(e) => setLog(e.target.value)}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default LogReportForm;
