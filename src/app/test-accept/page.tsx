"use client";

import { useState } from "react";
import { AdminApi } from "@/api/admin";
import type { Professor } from "@/types/api";

export default function TestAcceptPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const response = await AdminApi.getAllProfessors();
      if (response.success && response.data) {
        setProfessors(response.data.professors || []);
        setMessage(
          `Fetched ${response.data.professors?.length || 0} professors`
        );
      } else {
        setMessage(`Error: ${response.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProfessor = async (professor: Professor) => {
    console.log("Accept button clicked for professor:", professor);
    setMessage(
      `Attempting to accept professor: ${professor.first_name} ${professor.last_name}`
    );

    try {
      // Extract the correct ID format from the professor object
      let professorId: string;
      if (typeof professor.id === "string") {
        professorId = professor.id;
      } else if (
        professor.id &&
        typeof professor.id === "object" &&
        "id" in professor.id &&
        "String" in professor.id.id
      ) {
        // Construct the full RecordId format: "Professor:uyxlwuimgvbxe9hzfyuc"
        professorId = `Professor:${professor.id.id.String}`;
      } else {
        throw new Error("Invalid professor ID format");
      }

      console.log("Processing professor with ID:", professorId);

      // Call the API
      const response = await AdminApi.approveProfessor({ id: professorId });

      if (response.success) {
        setMessage(
          `✅ Professor ${professor.first_name} ${professor.last_name} accepted successfully!`
        );
        // Refresh the list
        fetchProfessors();
      } else {
        setMessage(`❌ Error: ${response.message}`);
      }
    } catch (error) {
      console.error("Error accepting professor:", error);
      setMessage(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Accept Button</h1>

      <div className="space-y-4">
        <button
          onClick={fetchProfessors}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch Professors"}
        </button>

        <div className="bg-gray-100 p-4 rounded">
          <strong>Status:</strong> {message}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Professors:</h2>
          {professors.map((professor, index) => {
            const status =
              professor.status === "new"
                ? "Pending"
                : professor.status === "approved" ||
                  professor.status === "accepted"
                ? "Accepted"
                : professor.status === "rejected"
                ? "Rejected"
                : "Unknown";

            const isAccepted = status === "Accepted";

            return (
              <div
                key={index}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">
                    {professor.first_name} {professor.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{professor.email}</div>
                  <div className="text-sm">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        status === "Pending"
                          ? "text-yellow-600"
                          : status === "Accepted"
                          ? "text-green-600"
                          : status === "Rejected"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {!isAccepted && (
                  <button
                    onClick={() => handleAcceptProfessor(professor)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
