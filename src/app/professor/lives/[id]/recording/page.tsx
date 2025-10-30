"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Download, VideoOff } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/button";
import { livesApi, type Live } from "@/api/lives";
import SecureVideoPlayer from "@/components/files/SecureVideoPlayer";

export default function RecordingPage() {
  const params = useParams();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { safeTranslate } = useSafeTranslation();
  const liveId = params?.id as string;

  const [live, setLive] = useState<Live | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLive = async () => {
      if (!liveId) {
        setError("Live session ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await livesApi.getLiveById(liveId);
        if (response.success && response.data) {
          setLive(response.data);

          // Check if recording is available
          if (!response.data.recording_url && !response.data.recording_file) {
            setError(
              safeTranslate(
                "professor.lives.recording.noRecording",
                "No recording available for this live session."
              )
            );
          }
        } else {
          setError(response.message || "Failed to load live session");
        }
      } catch (err: any) {
        console.error("Error fetching live:", err);
        setError(err?.message || "Failed to load live session");
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
  }, [liveId, safeTranslate]);

  const handleDownload = () => {
    if (live?.recording_url) {
      window.open(live.recording_url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader
          label={safeTranslate(
            "professor.lives.recording.loading",
            "Loading recording..."
          )}
        />
      </div>
    );
  }

  if (error || !live) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error || "Live session not found"}
          </h3>
          <Button
            state="filled"
            size="M"
            icon_position="left"
            icon={<ArrowLeft className="w-4 h-4" />}
            text={safeTranslate("professor.lives.player.back", "Back")}
            onClick={() => router.push("/professor/lives")}
            optionalStyles="mt-4"
          />
        </div>
      </div>
    );
  }

  const hasRecording = live.recording_url || live.recording_file;

  return (
    <div
      className={`min-h-screen w-full flex flex-col bg-gray-100 dark:bg-gray-900 ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="w-full bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              state="tonal"
              size="S"
              icon_position="left"
              icon={<ArrowLeft className="w-4 h-4" />}
              text={safeTranslate("professor.lives.player.back", "Back")}
              onClick={() => router.push("/professor/lives")}
            />
            <div>
              <p
                className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {safeTranslate(
                  "professor.lives.recording.recordingTitle",
                  "Recording"
                )}
              </p>
              <h1
                className={`text-xl font-bold text-gray-900 dark:text-white ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {live.title}
              </h1>
            </div>
          </div>
          {hasRecording && (
            <Button
              state="filled"
              size="M"
              icon_position="left"
              icon={<Download className="w-4 h-4" />}
              text={safeTranslate(
                "professor.lives.recording.download",
                "Download Recording"
              )}
              onClick={handleDownload}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1920px] mx-auto">
          {/* Recording Info */}
          <div className="mb-6 bg-white dark:bg-[#1A1A1A] rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p
                  className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {safeTranslate(
                    "professor.lives.recording.dateRecorded",
                    "Recorded on"
                  )}
                </p>
                <p
                  className={`text-gray-900 dark:text-white ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {live.ended_at
                    ? new Date(live.ended_at).toLocaleString()
                    : safeTranslate(
                        "professor.lives.recording.notAvailable",
                        "Not available"
                      )}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm text-gray-500 dark:text-gray-400 mb-1 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {safeTranslate(
                    "professor.lives.recording.duration",
                    "Duration"
                  )}
                </p>
                <p
                  className={`text-gray-900 dark:text-white ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {live.started_at && live.ended_at
                    ? (() => {
                        const start = new Date(live.started_at);
                        const end = new Date(live.ended_at);
                        const diffMs = end.getTime() - start.getTime();
                        const hours = Math.floor(diffMs / (1000 * 60 * 60));
                        const minutes = Math.floor(
                          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        return `${hours}h ${minutes}m`;
                      })()
                    : safeTranslate(
                        "professor.lives.recording.notAvailable",
                        "Not available"
                      )}
                </p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          {hasRecording ? (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-lg overflow-hidden">
              <div className="aspect-video w-full">
                {live.recording_file ? (
                  // Recording stored as File object - use SecureVideoPlayer
                  <SecureVideoPlayer
                    fileId={live.recording_file}
                    className="w-full h-full"
                    onAccessGranted={(url) => {
                      console.log("Recording access granted:", url);
                    }}
                    onAccessDenied={(error) => {
                      console.error("Recording access denied:", error);
                      setError(error);
                    }}
                  />
                ) : live.recording_url ? (
                  // Recording stored as direct URL
                  <video
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    playsInline
                  >
                    <source src={live.recording_url} type="video/mp4" />
                    {safeTranslate(
                      "professor.lives.recording.notSupported",
                      "Your browser does not support the video tag."
                    )}
                  </video>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-lg p-12 text-center">
              <div className="max-w-md mx-auto">
                <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3
                  className={`text-lg font-medium text-gray-900 dark:text-white mb-2 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {safeTranslate(
                    "professor.lives.recording.noRecording",
                    "No Recording Available"
                  )}
                </h3>
                <p
                  className={`text-gray-500 dark:text-gray-400 mb-6 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {safeTranslate(
                    "professor.lives.recording.noRecordingDescription",
                    "This live session does not have a recording. The recording may still be processing or may not have been created."
                  )}
                </p>
                <Button
                  state="filled"
                  size="M"
                  icon_position="left"
                  icon={<ArrowLeft className="w-4 h-4" />}
                  text={safeTranslate("professor.lives.player.back", "Back")}
                  onClick={() => router.push("/professor/lives")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
