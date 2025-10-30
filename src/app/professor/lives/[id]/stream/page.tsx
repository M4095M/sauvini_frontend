"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  VideoOff,
  MessageSquare,
  Send,
  Users,
  Maximize,
  Minimize,
  Circle,
  CircleDot,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSafeTranslation } from "@/hooks/useSafeTranslation";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/button";
import { livesApi, type Live } from "@/api/lives";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function LiveStreamingPage() {
  const params = useParams();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const { safeTranslate } = useSafeTranslation();
  const { getUserFullName, getUserEmail } = useAuth();
  const liveId = params?.id as string;

  const [live, setLive] = useState<Live | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Viewer count state (updated by Jitsi events)
  const [viewerCount, setViewerCount] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState<"file" | "stream" | null>(
    null
  );

  // Comments state
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  // Jitsi meeting API reference
  const jitsiApiRef = useRef<any>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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
          setViewerCount(response.data.viewer_count || 0);

          // Don't auto-open - let user click to open
          // Auto-opening can be blocked by browsers
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
  }, [liveId]);

  // Fetch comments when live is loaded
  useEffect(() => {
    if (!live || !liveId) return;

    const fetchComments = async () => {
      try {
        // TODO: Implement comments API call
        // const response = await livesApi.getLiveComments(liveId);
        // if (response.success && response.data) {
        //   setComments(response.data);
        // }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [live, liveId]);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!isFullscreen) {
        // Enter fullscreen
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen();
        } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
          // Safari
          await (videoContainerRef.current as any).webkitRequestFullscreen();
        } else if ((videoContainerRef.current as any).msRequestFullscreen) {
          // IE/Edge
          await (videoContainerRef.current as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleToggleRecording = async () => {
    if (!jitsiApiRef.current) return;

    try {
      if (isRecording) {
        // Stop recording
        jitsiApiRef.current.stopRecording();
        setIsRecording(false);
        setRecordingMode(null);
      } else {
        // Start recording
        jitsiApiRef.current.startRecording({
          mode: "file",
        });
        setIsRecording(true);
        setRecordingMode("file");
      }
    } catch (error: any) {
      console.error("Error toggling recording:", error);
      alert(
        safeTranslate(
          "professor.lives.streaming.recordingError",
          "Failed to toggle recording. Recording may not be available."
        )
      );
    }
  };

  const handleEndLive = async () => {
    if (
      !liveId ||
      !confirm(
        safeTranslate(
          "professor.lives.endModal.message",
          "Are you sure you want to end this live?"
        )
      )
    ) {
      return;
    }

    // Stop recording if active
    if (isRecording && jitsiApiRef.current) {
      try {
        jitsiApiRef.current.stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }

    try {
      const response = await livesApi.endLive(liveId);
      if (response.success) {
        router.push("/professor/lives");
      } else {
        alert(response.message || "Failed to end live session");
      }
    } catch (err: any) {
      console.error("Error ending live:", err);
      alert(err?.message || "Failed to end live session");
    }
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !liveId) return;

    // TODO: Implement comment sending via API
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        content: newComment,
        user_name: "You",
        created_at: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader
          label={safeTranslate("professor.lives.streaming.liveNow", "Live Now")}
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
                  "professor.lives.player.chapterName",
                  "Chapter Name"
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
          <div className="flex items-center gap-3">
            <Button
              state="tonal"
              size="M"
              icon_position="left"
              icon={
                isRecording ? (
                  <CircleDot className="w-4 h-4 text-red-600" />
                ) : (
                  <Circle className="w-4 h-4" />
                )
              }
              text={
                isRecording
                  ? safeTranslate(
                      "professor.lives.streaming.stopRecording",
                      "Stop Recording"
                    )
                  : safeTranslate(
                      "professor.lives.streaming.startRecording",
                      "Start Recording"
                    )
              }
              onClick={handleToggleRecording}
              optionalStyles={
                isRecording ? "bg-red-600 hover:bg-red-700 text-white" : ""
              }
            />
            <Button
              state="tonal"
              size="M"
              icon_position="left"
              icon={
                isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )
              }
              text={
                isFullscreen
                  ? safeTranslate(
                      "professor.lives.streaming.exitFullscreen",
                      "Exit Fullscreen"
                    )
                  : safeTranslate(
                      "professor.lives.streaming.fullscreen",
                      "Fullscreen"
                    )
              }
              onClick={toggleFullscreen}
            />
            <Button
              state="filled"
              size="M"
              icon_position="none"
              text={safeTranslate(
                "professor.lives.streaming.endLive",
                "End Live"
              )}
              onClick={handleEndLive}
              optionalStyles="bg-red-600 hover:bg-red-700"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Video Area */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
            {/* Video Container */}
            <div
              ref={videoContainerRef}
              className="relative w-full bg-black rounded-lg overflow-hidden flex-1 min-h-0"
              style={{ aspectRatio: "16/9" }}
            >
              {/* Status indicators */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  {safeTranslate(
                    "professor.lives.streaming.liveNow",
                    "Live Now"
                  )}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800/90 text-white">
                  <Users className="w-3 h-3 mr-1" />
                  {viewerCount || 0}{" "}
                  {safeTranslate(
                    "professor.lives.streaming.viewers",
                    "viewers"
                  )}
                </span>
                {isRecording && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                    <CircleDot className="w-3 h-3 mr-1 animate-pulse" />
                    {safeTranslate(
                      "professor.lives.streaming.recording",
                      "Recording"
                    )}
                  </span>
                )}
              </div>

              {/* Jitsi Meeting Component */}
              {live.jitsi_room_name ? (
                <JitsiMeeting
                  domain={
                    process.env.NEXT_PUBLIC_JITSI_DOMAIN || "localhost:8080"
                  }
                  roomName={live.jitsi_room_name}
                  userInfo={{
                    displayName: getUserFullName() || "Professor",
                    email: getUserEmail() || "professor@sauvini.com",
                  }}
                  configOverwrite={{
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    enableClosePage: false,
                    disableInviteFunctions: true,
                    disableJoinLeaveSounds: true,
                    disableRemoteMute: true,
                    enableLayerSuspension: true,
                    // Custom colors matching your app
                    subject: live.title || "Live Session",
                    toolbarButtons: [
                      "microphone",
                      "camera",
                      "closedcaptions",
                      "desktop",
                      "settings",
                      "hangup",
                    ],
                    defaultLanguage: isRTL ? "ar" : "en",
                    hideDisplayName: false,
                    // Disable external integrations
                    disableThirdPartyRequests: true,
                    enableNoAudioDetection: false,
                    enableNoisyMicDetection: false,
                    // Hide prejoin page
                    prejoinPageEnabled: false,
                    // Remove branding
                    defaultWelcomePageLogoUrl: "",
                    enableWelcomePage: false,
                  }}
                  interfaceConfigOverwrite={{
                    // UI Configuration
                    APP_NAME: "Sauvini Live",
                    HIDE_INVITE_MORE_HEADER: true,
                    HIDE_KICK_BUTTON_FOR_GUESTS: true,
                    DISABLE_VIDEO_BACKGROUND: false,
                    DISABLE_FOCUS_INDICATOR: false,
                    DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
                    TOOLBAR_BUTTONS: [
                      "microphone",
                      "camera",
                      "closedcaptions",
                      "desktop",
                      "settings",
                      "hangup",
                    ],
                    SETTINGS_SECTIONS: ["devices", "profile"],
                    // Match your app's primary color
                    DEFAULT_BACKGROUND: "#324C72",
                    INITIAL_TOOLBAR_TIMEOUT: 20000,
                    TOOLBAR_TIMEOUT: 4000,
                    // Hide unnecessary UI elements
                    DISABLE_PRESENCE_STATUS: true,
                    DISABLE_RINGING: false,
                    DISABLE_TRANSCRIPTION_SUBTITLES: false,
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    // Remove all watermarks and branding
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_POWERED_BY: false,
                    PROVIDER_NAME: "Sauvini",
                    BRAND_WATERMARK_LINK: "",
                    JITSI_WATERMARK_LINK: "",
                    DEFAULT_WELCOME_PAGE_LOGO_URL: "",
                    SHOW_WELCOME_PAGE_CONTENT: false,
                    SHOW_WELCOME_FOOTER: false,
                    // Customize participant tile colors
                    VIDEO_LAYOUT_FIT: "height",
                    TILE_VIEW_MAX_COLUMNS: 5,
                  }}
                  getIFrameRef={(containerRef) => {
                    if (containerRef) {
                      containerRef.style.height = "100%";
                      containerRef.style.width = "100%";
                      containerRef.style.border = "none";
                      containerRef.style.overflow = "hidden";

                      // Inject CSS to hide Jitsi logos/watermarks
                      // Use MutationObserver to handle dynamically added elements
                      const hideJitsiBranding = () => {
                        try {
                          const iframe = containerRef as HTMLIFrameElement;
                          if (
                            !iframe ||
                            (!(iframe as any).contentDocument &&
                              !(iframe as any).contentWindow)
                          )
                            return;

                          const doc =
                            (iframe as any).contentDocument ||
                            (iframe as any).contentWindow?.document;
                          if (!doc) return;

                          // Create or update style element
                          let style = doc.getElementById(
                            "sauvini-branding-removal"
                          );
                          if (!style) {
                            style = doc.createElement("style");
                            style.id = "sauvini-branding-removal";
                            doc.head.appendChild(style);
                          }
                          style.textContent = `
                            /* Hide Jitsi watermarks and logos - Comprehensive */
                            .watermark, .leftwatermark, .rightwatermark,
                            [class*="watermark"], [id*="watermark"],
                            img[src*="watermark"], img[src*="logo"],
                            img[alt*="Jitsi"], img[alt*="jitsi"],
                            [class*="poweredby"], [id*="poweredby"],
                            .poweredby, [data-testid*="watermark"],
                            .jitsi-logo, .jitsi-icon,
                            svg[class*="watermark"], svg[class*="logo"] {
                              display: none !important;
                              visibility: hidden !important;
                              opacity: 0 !important;
                              width: 0 !important;
                              height: 0 !important;
                              pointer-events: none !important;
                            }
                            
                            footer[class*="footer"], [class*="welcome-footer"],
                            [id*="footer"], .welcome-footer {
                              display: none !important;
                            }
                            
                            [class*="powered"], [id*="powered"], .powered-by-text {
                              display: none !important;
                            }
                            
                            header [class*="branding"], header [class*="logo"],
                            [class*="header-branding"], .app-banner {
                              display: none !important;
                            }
                          `;

                          // Also directly hide elements that might exist
                          const selectors = [
                            '[class*="watermark"]',
                            '[id*="watermark"]',
                            'img[src*="watermark"]',
                            'img[src*="logo"]',
                            '[class*="poweredby"]',
                            ".jitsi-logo",
                          ];

                          selectors.forEach((selector) => {
                            try {
                              const elements = doc.querySelectorAll(selector);
                              elements.forEach((el: any) => {
                                if (el.style) {
                                  el.style.display = "none";
                                  el.style.visibility = "hidden";
                                  el.style.opacity = "0";
                                }
                              });
                            } catch (e) {
                              // Ignore errors
                            }
                          });

                          // Set up MutationObserver to catch dynamically added logos
                          const win = iframe.contentWindow as any;
                          if (win && !win.jitsiBrandingObserver) {
                            win.jitsiBrandingObserver = new MutationObserver(
                              () => {
                                hideJitsiBranding();
                              }
                            );

                            win.jitsiBrandingObserver.observe(
                              doc.body || doc.documentElement,
                              {
                                childList: true,
                                subtree: true,
                                attributes: true,
                                attributeFilter: ["class", "id", "src"],
                              }
                            );
                          }
                        } catch (e) {
                          // Cross-origin restrictions might prevent this
                          console.log("Could not inject watermark removal:", e);
                        }
                      };

                      // Try immediately
                      hideJitsiBranding();

                      // Also try after a delay in case iframe loads later
                      setTimeout(hideJitsiBranding, 1000);
                      setTimeout(hideJitsiBranding, 3000);
                    }
                  }}
                  onApiReady={(apiObject) => {
                    jitsiApiRef.current = apiObject;

                    // Update viewer count when participants change
                    const updateViewerCount = () => {
                      const participants = apiObject.getParticipantsInfo();
                      // Exclude local participant (professor) from count
                      // Participants array length already excludes local participant
                      setViewerCount(participants.length);
                    };

                    apiObject.addEventListener(
                      "participantJoined",
                      updateViewerCount
                    );
                    apiObject.addEventListener(
                      "participantLeft",
                      updateViewerCount
                    );

                    // Recording event listeners - note: recordingStatusChanged may not fire reliably
                    // We'll check status manually instead
                    const checkRecordingStatus = () => {
                      try {
                        // Try to determine if recording is active
                        // This is a workaround since getRecordingStatus may not be available
                        // Recording status will be set when start/stop recording is called
                      } catch (error) {
                        console.error(
                          "Error checking recording status:",
                          error
                        );
                      }
                    };

                    // Auto-start recording when live starts
                    try {
                      apiObject.startRecording({
                        mode: "file",
                        dropboxToken: "",
                        shouldShare: false,
                        rtmpStreamKey: "",
                        rtmpBroadcastID: "",
                        youtubeStreamKey: "",
                        youtubeBroadcastID: "",
                      });
                      setIsRecording(true);
                      setRecordingMode("file");
                    } catch (error) {
                      console.log("Recording may not be available:", error);
                    }

                    // Initial count
                    updateViewerCount();
                  }}
                  onReadyToClose={() => {
                    // Handle meeting close
                    router.push("/professor/lives");
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p
                      className={`text-gray-400 ${
                        isRTL ? "font-arabic" : "font-sans"
                      }`}
                    >
                      {safeTranslate(
                        "professor.lives.streaming.roomNotReady",
                        "Waiting for meeting room..."
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-[#1A1A1A] rounded-lg p-4 h-full min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3
                className={`font-semibold text-gray-900 dark:text-white ${
                  isRTL ? "font-arabic" : "font-sans"
                }`}
              >
                {safeTranslate(
                  "professor.lives.streaming.comments",
                  "Comments"
                )}
              </h3>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 min-h-0">
              {comments.length === 0 ? (
                <p
                  className={`text-sm text-gray-500 text-center py-8 ${
                    isRTL ? "font-arabic" : "font-sans"
                  }`}
                >
                  {safeTranslate(
                    "professor.lives.streaming.comments",
                    "No comments yet"
                  )}
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-800 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                        {(comment.user_name || "U")[0].toUpperCase()}
                      </div>
                      <span
                        className={`font-medium text-sm text-gray-900 dark:text-white ${
                          isRTL ? "font-arabic" : "font-sans"
                        }`}
                      >
                        {comment.user_name ||
                          safeTranslate(
                            "professor.lives.streaming.userName",
                            "User Name"
                          )}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p
                      className={`text-sm text-gray-700 dark:text-gray-300 mt-2 ${
                        isRTL ? "font-arabic" : "font-sans"
                      }`}
                    >
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendComment();
                  }
                }}
                placeholder={safeTranslate(
                  "professor.lives.streaming.addComment",
                  "Add a comment"
                )}
                className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                  isRTL ? "font-arabic text-right" : "font-sans text-left"
                }`}
              />
              <button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                title={safeTranslate(
                  "professor.lives.streaming.addComment",
                  "Add a comment"
                )}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
