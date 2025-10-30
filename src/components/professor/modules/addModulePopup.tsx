"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DropDown from "@/components/input/dropDown";
import ControlledInput from "@/components/input/ControlledInput";
import Tag from "@/components/questions/tag";
import Button from "@/components/ui/button";
import { ModulesApi } from "@/api/modules";

type AddModulePopupProps = {
  onClose?: () => void;
  onSuccess?: () => void;
};

interface AcademicStream {
  id: {
    tb: string;
    id: {
      String: string;
    };
  };
  name: string;
  name_ar: string;
}

const MODULE_COLORS = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
];

export default function AddModulePopup({
  onClose,
  onSuccess,
}: AddModulePopupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");
  const [selectedStreams, setSelectedStreams] = useState<AcademicStream[]>([]);
  const [availableStreams, setAvailableStreams] = useState<AcademicStream[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamsLoading, setStreamsLoading] = useState(true);

  // Fetch academic streams on mount
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setStreamsLoading(true);
        const response = await fetch("/api/v1/courses/academic-streams");
        const data = await response.json();

        if (data.success && data.data) {
          setAvailableStreams(data.data);
        } else {
          console.error("Failed to fetch academic streams:", data.message);
        }
      } catch (err) {
        console.error("Error fetching academic streams:", err);
      } finally {
        setStreamsLoading(false);
      }
    };

    fetchStreams();
  }, []);

  const handleAddStream = (streamName: string) => {
    const stream = availableStreams.find((s) => s.name === streamName);
    if (stream && !selectedStreams.find((s) => s.name === stream.name)) {
      setSelectedStreams([...selectedStreams, stream]);
    }
  };

  const handleRemoveStream = (streamName: string) => {
    setSelectedStreams(selectedStreams.filter((s) => s.name !== streamName));
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError("Module name is required");
      return;
    }
    if (!description.trim()) {
      setError("Module description is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create module
      const response = await ModulesApi.createModule({
        name: name.trim(),
        description: description.trim(),
        color: color,
        custom_id: `module:${name.toLowerCase().replace(/\s+/g, "-")}`,
      });

      if (response.success && response.data) {
        // TODO: Add academic streams to module
        // For now, just close the popup on success
        console.log("Module created successfully:", response.data);
        onSuccess?.();
        onClose?.();
      } else {
        setError(response.message || "Failed to create module");
      }
    } catch (err) {
      console.error("Error creating module:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl px-10 py-11 rounded-2xl bg-neutral-100 flex flex-col gap-12">
      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="text-neutral-600 text-4xl font-semibold">
          Add Module
        </div>
        <div className="text-neutral-400 font-normal text-xl">
          Create a new module with details and academic streams
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* input fields */}
      <div className="flex flex-col gap-5">
        {/* name and desc */}
        <div className="flex flex-col gap-10">
          {/* name */}
          <ControlledInput
            label={"Module Name"}
            value={name}
            onChange={(value) => setName(value)}
            type={"text"}
            max_width=""
            placeholder="e.g., Mathematics 101"
          />
          {/* desc */}
          <ControlledInput
            label={"Module Description"}
            value={description}
            onChange={(value) => setDescription(value)}
            type={"text"}
            long
            max_height="h-[192px]"
            max_width=""
            placeholder="Enter a detailed description of the module..."
          />
        </div>

        {/* Color selection */}
        <div className="flex flex-col gap-4">
          <label className="text-neutral-600 font-medium">Module Color</label>
          <div className="flex gap-3 flex-wrap">
            {MODULE_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setColor(c.value)}
                className={`w-12 h-12 rounded-full ${c.color} ${
                  color === c.value
                    ? "ring-4 ring-offset-2 ring-blue-400"
                    : "opacity-60 hover:opacity-100"
                } transition-all`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* academic stream */}
        <div className="flex flex-col gap-4">
          {/* drop down */}
          {streamsLoading ? (
            <div className="text-neutral-400">Loading academic streams...</div>
          ) : (
            <DropDown
              label="Supported Academic Streams"
              placeholder="Select a stream to add"
              options={availableStreams
                .filter(
                  (s) => !selectedStreams.find((sel) => sel.name === s.name)
                )
                .map((s) => ({ id: s.name, text: s.name }))}
              onChange={(value) => handleAddStream(value)}
            />
          )}
          {/* tags */}
          {selectedStreams.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {selectedStreams.map((stream) => (
                <Tag
                  key={stream.name}
                  icon={
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={() => handleRemoveStream(stream.name)}
                    />
                  }
                  text={stream.name}
                  className={"bg-primary-50 text-primary-300"}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-5 items-center">
        <Button
          state={"tonal"}
          size={"S"}
          icon_position={"none"}
          text="Cancel"
          onClick={onClose}
          disabled={loading}
        />
        <Button
          state={"filled"}
          size={"S"}
          icon_position={"none"}
          text={loading ? "Creating..." : "Create Module"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}
