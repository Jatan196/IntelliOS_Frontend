import React, { useState } from 'react';
import { Plus, Folder, Globe, Browser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateWorkspace = () => {
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState({
        name: '',
        description: '',
        apps: [],
        files: [],
        tabs: [],
        lastUsed: new Date().toISOString(),
        synced: false
    });

    const [inputs, setInputs] = useState({
        app: '',
        file: '',
        tab: ''
    });

    const handleAddItem = (type) => {
        if (inputs[type].trim()) {
            setWorkspace(prev => ({
                ...prev,
                [type + 's']: [...prev[type + 's'], inputs[type].trim()]
            }));
            setInputs(prev => ({ ...prev, [type]: '' }));
        }
    };

    const handleRemoveItem = (type, index) => {
        setWorkspace(prev => ({
            ...prev,
            [type + 's']: prev[type + 's'].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prefer the preload-provided electronAPI; fallback to `electron` if available
        const api = window.electronAPI || window.electron
        if (api && api.invoke) {
            try {
                await api.invoke('create-workspace', workspace);
                navigate('/dashboard');
                return
            } catch (error) {
                console.error('Failed to create workspace via IPC:', error);
            }
        }

        // Fallback: no electron IPC available (e.g., running in browser). For now navigate to dashboard.
        console.warn('Electron IPC not available; CreateWorkspace will navigate without persisting.');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-6 h-6" />
                    Create Workspace
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Workspace Name"
                            value={workspace.name}
                            onChange={(e) => setWorkspace({...workspace, name: e.target.value})}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={workspace.description}
                            onChange={(e) => setWorkspace({...workspace, description: e.target.value})}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                            rows="3"
                        />
                    </div>

                    {/* Applications */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Applications
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputs.app}
                                onChange={(e) => setInputs({...inputs, app: e.target.value})}
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                                placeholder="Add application"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddItem('app')}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {workspace.apps.map((app, index) => (
                                <span key={index} className="bg-blue-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {app}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem('app', index)}
                                        className="hover:text-red-400"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Folder className="w-4 h-4" />
                            Files
                        </label>
                        {/* Similar structure as Applications */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputs.file}
                                onChange={(e) => setInputs({...inputs, file: e.target.value})}
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                                placeholder="Add file path"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddItem('file')}
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                        {/* Files list */}
                    </div>

                    {/* Browser Tabs */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Browser className="w-4 h-4" />
                            Browser Tabs
                        </label>
                        {/* Similar structure as Applications */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputs.tab}
                                onChange={(e) => setInputs({...inputs, tab: e.target.value})}
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2"
                                placeholder="Add tab URL"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddItem('tab')}
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                            >
                                Add
                            </button>
                        </div>
                        {/* Tabs list */}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-medium"
                    >
                        Create Workspace
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspace;