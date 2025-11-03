import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  LayoutDashboard,
  Play,
  Settings,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
} from "lucide-react";

/**
 * Single-file React component: App.jsx
 * - Tailwind CSS only for styling
 * - Uses lucide-react for icons
 * - Dark mode aesthetic
 * - Responsive 3-column layout that stacks on small screens
 *
 * Notes:
 * - This file assumes Tailwind CSS and lucide-react are installed and configured in the host project.
 * - All state and UI logic are contained within this single file as requested.
 */

export default function App() {
  // Sidebar (projects)
  const mockProjects = [
    { id: 1, name: "Marketing Copy Draft", icon: FileText },
    { id: 2, name: "Code Generation Test", icon: LayoutDashboard },
    { id: 3, name: "Essay Outline", icon: FileText },
    { id: 4, name: "Customer Support Reply", icon: FileText },
    { id: 5, name: "Ad Headline Ideas", icon: FileText },
  ];
  const [activeProjectId, setActiveProjectId] = useState(mockProjects[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  // Prompt editor
  const [promptText, setPromptText] = useState(
    "Write a concise marketing blurb for a productivity app that automates repetitive tasks."
  );
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const responseRef = useRef(null);
  const streamIntervalRef = useRef(null);

  // Config panel states
  const [configOpen, setConfigOpen] = useState(false); // mobile toggled
  const [model, setModel] = useState("Gemini 2.5 Flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(256);
  const [stopSequences, setStopSequences] = useState("");

  // Simulated streaming response text (mocked)
  const mockResponses = {
    1: "Boost conversions with concise, benefit-driven copy that highlights time saved, seamless automation, and simple onboarding. Focus on results: less busywork, more focus on what matters. Include a short CTA.",
    2: "Here's the generated function: function greet(name) { return `Hello, ${name}!`; } Use this as a starting point, then add input validation and tests.",
    3: "I. Intro: Hook and thesis. II. Body: Major points and examples. III. Conclusion: Summary and call-to-action. Aim for clarity and logical flow.",
  };

  // Get a mock response depending on active project (fallback)
  const getMockResponse = () => {
    return (
      mockResponses[activeProjectId] ||
      "This is a simulated assistant response. Adjust model parameters and try again."
    );
  };

  // Function to simulate streaming response
  const runPrompt = () => {
    if (isLoading) return;
    setIsLoading(true);
    setResponseText("");
    const full = getMockResponse();

    // Simulate network latency before streaming
    let idx = 0;
    const chars = Array.from(full);
    const minDelay = 18;
    const maxDelay = 45;

    streamIntervalRef.current = setInterval(() => {
      // Append several characters at once for realistic streaming chunks
      const chunkSize = Math.random() > 0.85 ? 4 : Math.random() > 0.6 ? 2 : 1;
      let chunk = "";
      for (let c = 0; c < chunkSize && idx < chars.length; c++, idx++) {
        chunk += chars[idx];
      }
      setResponseText((prev) => prev + chunk);

      // Auto-scroll response area to bottom
      if (responseRef.current) {
        responseRef.current.scrollTop = responseRef.current.scrollHeight;
      }

      if (idx >= chars.length) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        // small delay to make finishing feel natural
        setTimeout(() => setIsLoading(false), 400);
      }
    }, Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay));
  };

  // Cancel/cleanup streaming on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    };
  }, []);

  // Helpers
  const activeProject = mockProjects.find((p) => p.id === activeProjectId);
  const formatNumber = (n) =>
    n >= 1000 ? `${Math.round((n / 1000) * 10) / 10}k` : String(n);

  // Responsive layout classes for widths as percentages on md and above
  // Left: 15%, Center: 55%, Right: 30%
  // On small screens they stack and use full width.
  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100 antialiased">
      {/* Topbar - mobile controls */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-100" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-100" />
            )}
          </button>
          <div className="font-semibold tracking-wide">Prompt Playground</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setConfigOpen((s) => !s);
            }}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
            aria-label="Toggle configuration"
          >
            <Settings className="w-5 h-5 text-gray-100" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Left Column */}
          <aside
            className={`${
              sidebarOpen ? "block" : "hidden"
            } md:block rounded-xl bg-gray-900 border border-gray-800 p-4 shadow-sm md:w-[15%]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-semibold">Prompt Playground</h2>
              </div>
              {/* Hide on desktop (decorative) */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 rounded hover:bg-gray-800"
                aria-label="Close sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-gray-200" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Sessions
              </div>
              <ul className="space-y-2">
                {mockProjects.map((proj) => {
                  const Icon = proj.icon;
                  const active = proj.id === activeProjectId;
                  return (
                    <li key={proj.id}>
                      <button
                        onClick={() => setActiveProjectId(proj.id)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                          active
                            ? "bg-gradient-to-r from-blue-800/40 to-cyan-800/30 ring-1 ring-cyan-500/30"
                            : "hover:bg-gray-850"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active ? "text-cyan-400" : "text-gray-300"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{proj.name}</div>
                          <div className="text-xs text-gray-400">
                            {proj.id === activeProjectId ? "Active" : "Idle"}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  // quick mock action: clear prompt & response
                  setPromptText("");
                  setResponseText("");
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-850 hover:bg-gray-800 transition text-sm"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                Clear Session
              </button>
            </div>
          </aside>

          {/* Center Column - Prompt Editor */}
          <section className="rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-sm md:w-[55%] flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-semibold text-gray-100">
                  {activeProject ? activeProject.name : "New Session"}
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Model: <span className="text-gray-200">{model}</span> •
                  Temp: <span className="text-gray-200">{temperature}</span>
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => {
                    setPromptText((p) => "");
                    setResponseText("");
                  }}
                  className="text-sm px-3 py-2 rounded-lg bg-gray-850 hover:bg-gray-800 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => runPrompt()}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isLoading
                      ? "bg-blue-600/70 text-white cursor-wait"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Run
                </button>
              </div>
            </div>

            {/* Prompt input */}
            <div className="mt-4 flex-1 flex flex-col min-h-[220px]">
              <label className="text-xs text-gray-400 mb-2">Prompt</label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Type your prompt here..."
                className="resize-none bg-gray-850 text-gray-100 placeholder-gray-500 rounded-xl p-4 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              />

              {/* Run + mobile controls */}
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div>Model: <span className="text-gray-200">{model}</span></div>
                  <div className="ml-2">•</div>
                  <div>Tokens: <span className="text-gray-200">{formatNumber(maxTokens)}</span></div>
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <button
                    onClick={() => {
                      setPromptText((p) => "");
                      setResponseText("");
                    }}
                    className="text-sm px-3 py-2 rounded-lg bg-gray-850 hover:bg-gray-800 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => runPrompt()}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isLoading
                        ? "bg-blue-600/70 text-white cursor-wait"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    Run
                  </button>
                </div>
              </div>

              {/* Response area */}
              <div className="mt-4">
                <label className="text-xs text-gray-400 mb-2 block">Response</label>
                <div
                  ref={responseRef}
                  className="mt-1 bg-gray-850 rounded-xl p-4 min-h-[140px] max-h-72 overflow-auto text-sm leading-relaxed whitespace-pre-wrap"
                >
                  <div className="text-gray-200">{responseText}</div>
                  {/* Blinking cursor while loading */}
                  {isLoading && (
                    <span className="inline-block w-1 h-4 bg-gray-200 ml-1 align-bottom animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom actions for desktop */}
            <div className="mt-4 hidden md:flex items-center justify-between">
              <div className="text-xs text-gray-400">Tip: Adjust temperature to change creativity.</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // quick mock: shorten response
                    setResponseText((r) => r.slice(0, Math.floor(r.length / 2)));
                  }}
                  className="text-sm px-3 py-2 rounded-lg bg-gray-850 hover:bg-gray-800 transition"
                >
                  Trim Response
                </button>
                <button
                  onClick={() => {
                    setResponseText("");
                    setIsLoading(false);
                    if (streamIntervalRef.current) {
                      clearInterval(streamIntervalRef.current);
                      streamIntervalRef.current = null;
                    }
                  }}
                  className="text-sm px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition text-white"
                >
                  Stop
                </button>
              </div>
            </div>
          </section>

          {/* Right Column - Configuration Panel */}
          <aside
            className={`rounded-xl bg-gray-900 border border-gray-800 p-6 shadow-sm md:w-[30%] ${
              configOpen ? "block" : "hidden"
            } md:block`}
          >
            <div className="sticky top-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Configuration</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // reset to defaults
                      setModel("Gemini 2.5 Flash");
                      setTemperature(0.7);
                      setMaxTokens(256);
                      setStopSequences("");
                    }}
                    className="text-xs px-2 py-1 rounded-lg bg-gray-850 hover:bg-gray-800 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setConfigOpen(false)}
                    className="md:hidden p-1 rounded hover:bg-gray-800"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-200" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-5">
                {/* Model Selection */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-gray-850 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option>Gemini 2.5 Flash</option>
                    <option>Gemini 2.5 Pro</option>
                    <option>Gemini 2.0</option>
                    <option>Mock-OpenAI-3</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Temperature</label>
                    <div className="text-xs text-gray-200 font-medium">{temperature.toFixed(1)}</div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full mt-2 accent-cyan-400"
                  />
                </div>

                {/* Max Tokens */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Max Output Tokens</label>
                    <div className="text-xs text-gray-200 font-medium">{maxTokens}</div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2048"
                    step="1"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full mt-2 accent-blue-500"
                  />
                </div>

                {/* Stop Sequences */}
                <div>
                  <label className="text-xs text-gray-400 mb-2 block">Stop Sequences</label>
                  <input
                    value={stopSequences}
                    onChange={(e) => setStopSequences(e.target.value)}
                    placeholder="e.g. ###"
                    className="w-full bg-gray-850 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate multiple sequences with commas.
                  </p>
                </div>

                {/* Misc */}
                <div className="pt-2 border-t border-gray-800">
                  <div className="text-xs text-gray-400 mb-2">Session</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPromptText("");
                        setResponseText("");
                      }}
                      className="flex-1 text-sm px-3 py-2 rounded-lg bg-gray-850 hover:bg-gray-800 transition"
                    >
                      Clear Prompt
                    </button>
                    <button
                      onClick={() => {
                        // Quick mock: run with current settings
                        runPrompt();
                        // ensure panels are visible on mobile
                        setConfigOpen(false);
                        setSidebarOpen(false);
                      }}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition text-sm font-medium"
                    >
                      Quick Run
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-3">
                  Model and parameter controls are for simulation only in this playground.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile bottom spacing */}
      <div className="md:hidden h-6" />
    </div>
  );
}