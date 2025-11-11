import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { captureState, restoreState, getWorkspaces as apiGetWorkspaces } from "../api"
import {
  Brain,
  Activity,
  CheckCircle,
  Clock,
  Zap,
  Play,
  FolderSync,
  Trash2,
  Plus,
  Settings,
  Search,
  Bell,
  User,
  BarChart2,
  Cloud,
  Cpu,
} from "lucide-react"

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([])
  const [lastRestored, setLastRestored] = useState(null)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [username] = useState("Jay")
  const navigate = useNavigate()
  const [preferences, setPreferences] = useState({
    cloudSync: true,
    githubConnected: false,
  })
  const [systemStats] = useState({
    cpu: 45,
    memory: 62,
    disk: 28,
    network: 15,
  })

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const data = await apiGetWorkspaces()
        setWorkspaces(data || [])

        const last = data.find((ws) => ws.lastRestored)
        if (last) {
          setLastRestored({
            workspace: last.name,
            time: last.lastRestored,
            apps: last.apps?.length || 0,
            files: last.files || 0,
            tabs: last.tabs || 0,
          })
        }

        setAiSuggestion(
          "Based on your usage pattern, I recommend creating a 'Research Mode' workspace for your frequent article reading sessions.",
        )
      } catch (err) {
        console.error("Error fetching workspaces:", err)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleOpenPreferences = () => {
    const api = window.electronAPI || window.electron
    if (api && api.send) {
      api.send("open-preferences")
    } else {
      console.warn("Electron API not available to open preferences")
    }
  }

  const handleRestoreWorkspace = async (workspace) => {
    try {
      let ok = false
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/workspaces/${workspace.id}/restore`,
          { method: "POST" },
        )
        ok = res.ok
      } catch (e) {
        ok = false
      }

      if (!ok) {
        const r = await restoreState()
        if (!r.ok) throw new Error("Restore failed")
      }
      setLastRestored({
        workspace: workspace.name,
        time: new Date().toLocaleString(),
        apps: workspace.apps?.length || 0,
        files: workspace.files || 0,
        tabs: workspace.tabs || 0,
      })
      alert(`Workspace "${workspace.name}" restored!`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCaptureState = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/capture", { method: "POST" });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      alert("State captured: " + (data?.file_path || data?.message || "OK"));
    } catch (e) {
      console.error("captureState error:", e);
      alert("Error capturing state: " + e.message);
    }
  };

  const handleSyncWorkspace = async (workspaceId) => {
    try {
      await fetch(`http://localhost:5000/api/workspaces/${workspaceId}/sync`, { method: "PUT" })
      setWorkspaces((prev) => prev.map((ws) => (ws.id === workspaceId ? { ...ws, synced: true } : ws)))
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      await fetch(`http://localhost:5000/api/workspaces/${workspaceId}`, { method: "DELETE" })
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateWorkspace = () => {
    alert("Redirect to Create Workspace page or open modal")
  }

  const handleCustomizePreferences = () => {
    handleOpenPreferences()
  }

  const handleSyncSettings = () => {
    alert("Sync Settings clicked")
  }

  const handleRealTimeMonitoring = () => {
    alert("Navigating to Real-Time Monitoring page...")
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1a1a3e 50%, #0f172a 100%)",
      }}
    >
      {/* Sidebar - Fixed */}
      <div
        style={{
          width: "256px",
          background: "linear-gradient(180deg, #1e293b 0%, #1a1f3a 100%)",
          borderRight: "1px solid rgba(148, 163, 184, 0.1)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
          }}
        >
          <Brain size={28} color="#3b82f6" />
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            IntelliOS
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              color: "#f1f5f9",
              fontSize: "14px",
              fontWeight: "500",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Activity size={20} />
            Dashboard
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            <BarChart2 size={20} />
            Monitoring
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              color: "#cbd5e1",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
          >
            <Settings size={20} />
            Settings
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1a1a3e 50%, #0f172a 100%)",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            background: "linear-gradient(90deg, rgba(30, 41, 59, 0.8) 0%, rgba(26, 26, 62, 0.8) 100%)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
            <Search size={20} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search workspaces..."
              style={{
                background: "rgba(51, 65, 85, 0.5)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#f1f5f9",
                fontSize: "14px",
                outline: "none",
                width: "300px",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Bell size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
            <User size={20} color="#94a3b8" style={{ cursor: "pointer" }} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 8px 0" }}>
              Welcome back, {username}
            </h1>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>
              Manage your workspaces and monitor system performance
            </p>
          </div>

          {/* System Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                label: "CPU Usage",
                value: systemStats.cpu,
                icon: Cpu,
                color: "#ef4444",
                gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
              },
              {
                label: "Memory",
                value: systemStats.memory,
                icon: Activity,
                color: "#f59e0b",
                gradient: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
              },
              {
                label: "Disk Space",
                value: systemStats.disk,
                icon: Cloud,
                color: "#3b82f6",
                gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              },
              {
                label: "Network",
                value: systemStats.network,
                icon: Zap,
                color: "#10b981",
                gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  style={{
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.3) 100%)",
                    border: "1px solid rgba(148, 163, 184, 0.1)",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "500" }}>{stat.label}</span>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9" }}>{stat.value}%</div>
                  <div
                    style={{
                      height: "4px",
                      background: "rgba(51, 65, 85, 0.5)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${stat.value}%`,
                        background: stat.gradient,
                        borderRadius: "2px",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Last Restored Section */}
          {lastRestored && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "32px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <CheckCircle size={24} color="#10b981" />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9", margin: "0 0 4px 0" }}>
                  Last Restored: {lastRestored.workspace}
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {lastRestored.time} • {lastRestored.apps} apps • {lastRestored.files} files • {lastRestored.tabs} tabs
                </p>
              </div>
            </div>
          )}

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div
              style={{
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "8px",
                padding: "20px",
                marginBottom: "32px",
                display: "flex",
                gap: "16px",
              }}
            >
              <Brain size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#f1f5f9", margin: "0 0 4px 0" }}>
                  AI Suggestion
                </p>
                <p style={{ fontSize: "13px", color: "#cbd5e1", margin: 0 }}>{aiSuggestion}</p>
              </div>
            </div>
          )}

          {/* Workspaces Section */}
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", margin: 0 }}>Your Workspaces</h2>
              <button
                onClick={handleCreateWorkspace}
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #ec4899 100%)",
                  color: "#f1f5f9",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
              >
                <Plus size={16} />
                New Workspace
              </button>
            </div>

            {/* Workspaces Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  style={{
                    background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.3) 100%)",
                    border: "1px solid rgba(148, 163, 184, 0.1)",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 4px 0" }}>
                      {workspace.name}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                      {workspace.apps?.length || 0} apps • {workspace.files || 0} files
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => handleRestoreWorkspace(workspace)}
                      style={{
                        flex: 1,
                        minWidth: "80px",
                        background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                        color: "#f1f5f9",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Play size={14} />
                      Restore
                    </button>
                    <button
                      onClick={() => handleSyncWorkspace(workspace.id)}
                      style={{
                        flex: 1,
                        minWidth: "80px",
                        background: "rgba(51, 65, 85, 0.5)",
                        color: "#f1f5f9",
                        border: "1px solid rgba(148, 163, 184, 0.1)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <FolderSync size={14} />
                      Sync
                    </button>
                    <button
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                      style={{
                        flex: 1,
                        minWidth: "80px",
                        background: "rgba(51, 65, 85, 0.5)",
                        color: "#f1f5f9",
                        border: "1px solid rgba(148, 163, 184, 0.1)",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <button
              onClick={handleCaptureState}
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.3) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRadius: "8px",
                padding: "16px",
                color: "#f1f5f9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              <Clock size={20} />
              Capture State
            </button>
            <button
              onClick={handleCustomizePreferences}
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.3) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRadius: "8px",
                padding: "16px",
                color: "#f1f5f9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              <Settings size={20} />
              Preferences
            </button>
            <button
              onClick={handleRealTimeMonitoring}
              style={{
                background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(51, 65, 85, 0.3) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.1)",
                borderRadius: "8px",
                padding: "16px",
                color: "#f1f5f9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.2s",
              }}
            >
              <Activity size={20} />
              Monitoring
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
