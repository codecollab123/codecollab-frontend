"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axiosinstance";

type PofdData = {
  title: string;
  description: string;
  options: string[];
  answer: string;
  source: string;
  date: string;
  difficulty: string;
};

export default function PofdComponent() {
  const [data, setData] = useState<PofdData | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const getOptionKey = (option: string) => option.split(".")[0]; // A, B, C, D
  
  useEffect(() => {
    const fetchPofd = async () => {
      try {
        const res = await axiosInstance.get("/pofd/today");
        const raw = res.data?.data;
        if (raw) {
          const options = raw.description?.split("\n").filter(Boolean) || [];
          setData({ ...raw, options });
        }
      } catch (err) {
        console.error("Error fetching PoFD:", err);
      }
    };

    fetchPofd();
  }, []);

  const handleSubmit = () => {
    if (!data || !selected) return;
    setIsCorrect(selected === data.answer);
    setSubmitted(true);
  };

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2 text-green-600">
        Problem of the Day ({data.date})
      </h2>
      <p className="font-semibold">Title:</p>
      <p className="mb-4">{data.title}</p>

      <p className="font-semibold mb-1">Difficulty: { data.difficulty}</p>

      <div className="space-y-2">
        {data.options.map((option, idx) => (
          <label key={idx} className="block border p-2 rounded cursor-pointer ">
            <input
              type="radio"
              name="pofdOption"
              value={option}
              className="mr-2"
              onChange={(e) => setSelected(e.target.value)}
              disabled={submitted}
            />
            {option}
          </label>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-white-700"
        >
          Submit
        </button>
      )}

      {submitted && (
        <div className="mt-4">
          {isCorrect ? (
            <p className="text-green-400 font-semibold">✅ Correct Answer!</p>
          ) : (
            <p className="text-red-400 font-semibold">
              Incorrect. Correct Answer is: <strong>{data.answer}</strong>
            </p>
          )}
        </div>
      )}
      {status && (
  <p className={`mt-2 ${status === "correct" ? "text-green-600" : "text-red-600"}`}>
    {status === "correct" ? "Correct!" : "Incorrect. Try again!"}
  </p>
)}


      <p className="text-sm text-gray-500 mt-4">Source: {data.source}</p>
    </div>
  );
}
