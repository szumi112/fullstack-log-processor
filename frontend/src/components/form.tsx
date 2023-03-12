import React, { useState, useRef, FormEvent } from "react";
import axios from "axios";

interface Props {
  addLog: (newLog: Log) => void;
}

interface Log {
  _id: string;
  processedLog: string;
}

function Form({ addLog }: Props) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [log, setLog] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null); // create a reference to the form element

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page refresh

    const formData = { name, email, log };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post<Log>(
        "http://localhost:3000/api/submit-log-report",
        formData,
        config
      );

      console.log("Server response:", response.data);

      // Call the addLog function with the new log
      addLog(response.data);

      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setLog("");

      // Reset the form's validity and clear the errors
      if (formRef.current) {
        formRef.current.reset(); // reset the form's fields and validity
        formRef.current.reportValidity(); // clear the form's errors
      }
    } catch (err) {
      console.error("Error submitting log report:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
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

export default Form;
