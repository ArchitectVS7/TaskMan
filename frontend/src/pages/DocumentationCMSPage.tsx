
import React, { useState, useEffect } from 'react';
import { Search, Save, GitCommit, RefreshCw, FileText, AlertCircle } from 'lucide-react';

// Interfaces
interface DocumentationBlock {
    id: string;
    title: string;
    content: string;
    metadata: {
        featureId?: string;
        route?: string;
        audience?: string[];
        surface?: string[];
        tags?: string[];
    };
    level: number;
    filePath: string;
    lastModified: string;
}

interface FeatureSpec {
    id: string;
    name: string;
    description: string;
    section: string;
    status: 'implemented' | 'not-implemented' | 'partially-implemented';
    codeLocation?: string;
    prdReference: string;
}

interface ComparisonResult {
    prdOnly: FeatureSpec[];
    codeOnly: FeatureSpec[];
    matched: Array<{ prd: FeatureSpec; code: FeatureSpec }>;
    summary: {
        totalPrdFeatures: number;
        totalCodeFeatures: number;
        matchedFeatures: number;
        prdOnlyCount: number;
        codeOnlyCount: number;
    };
}

const API_BASE = 'http://localhost:3001/api';

// Main CMS Dashboard Component
export default function DocumentationCMSPage() {
    const [blocks, setBlocks] = useState<DocumentationBlock[]>([]);
    const [selectedBlock, setSelectedBlock] = useState<DocumentationBlock | null>(null);
    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'editor' | 'comparison' | 'structure'>('editor');
    const [error, setError] = useState<string>('');

    // Load documentation blocks on component mount
    useEffect(() => {
        fetchDocumentationBlocks();
    }, []);

    const fetchDocumentationBlocks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/docs/blocks`);
            if (!response.ok) throw new Error('Failed to fetch blocks. Ensure CMS API is running (npm run docs:cms in .docs-automation)');
            const data = await response.json();
            setBlocks(data.blocks || []);
        } catch (err: any) {
            console.error('Error fetching documentation blocks:', err);
            setError(err.message);

            // Fallback/Demo data if API fails (optional, but good for robust UI)
            // setBlocks([...mockBlocks]); 
        } finally {
            setLoading(false);
        }
    };

    const fetchComparisonResult = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/compare/features`);
            if (!response.ok) throw new Error('Failed to fetch comparison');
            const data = await response.json();
            setComparisonResult(data);
        } catch (err) {
            console.error('Error fetching comparison result:', err);
            // setComparisonResult(mockComparison);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUpdate = async (updatedBlock: DocumentationBlock) => {
        try {
            const response = await fetch(`${API_BASE}/docs/blocks/${updatedBlock.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBlock)
            });

            if (!response.ok) throw new Error('Failed to update');

            // Update the local state
            setBlocks(blocks.map(b => b.id === updatedBlock.id ? updatedBlock : b));
            setSelectedBlock(updatedBlock);
            alert('Documentation block updated successfully!');
        } catch (err) {
            console.error('Error updating block:', err);
            alert('Failed to update documentation block');
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            await fetch(`${API_BASE}/sync`, { method: 'POST' });
            alert('Documentation synced successfully!');
            fetchDocumentationBlocks(); // Refresh the blocks
        } catch (err) {
            console.error('Error syncing documentation:', err);
            alert('Failed to sync documentation');
        } finally {
            setLoading(false);
        }
    };

    const handleCommit = async (message: string) => {
        try {
            const response = await fetch(`${API_BASE}/docs/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            if (!response.ok) throw new Error('Commit failed');
            alert('Changes committed successfully!');
        } catch (err) {
            console.error('Error committing changes:', err);
            alert('Failed to commit changes');
        }
    };

    // Filter blocks based on search query
    const filteredBlocks = blocks.filter(block =>
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.metadata.featureId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation CMS</h1>
                <p className="text-gray-600">Manage and compare documentation between PRD and codebase</p>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
                <div className="flex bg-gray-100 rounded-md p-1">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => { setActiveTab('comparison'); fetchComparisonResult(); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'comparison' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Comparison
                    </button>
                    <button
                        onClick={() => setActiveTab('structure')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Structure
                    </button>
                </div>

                <div className="ml-auto flex gap-2">
                    <button
                        onClick={handleSync}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Syncing...' : 'Sync Docs'}
                    </button>
                </div>
            </div>

            {loading && !blocks.length && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {(!loading || blocks.length > 0) && (
                <>
                    {activeTab === 'editor' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Block List Panel */}
                            <div className="lg:col-span-1 flex flex-col h-[calc(100vh-250px)]">
                                <div className="bg-white rounded-lg shadow flex flex-col h-full">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold text-gray-900">Documentation Blocks</h2>
                                        <div className="mt-2 relative">
                                            <input
                                                type="text"
                                                placeholder="Search blocks..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                        {filteredBlocks.map(block => (
                                            <div
                                                key={block.id}
                                                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedBlock?.id === block.id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                                onClick={() => setSelectedBlock(block)}
                                            >
                                                <h3 className="font-medium text-gray-900 text-sm">{block.title}</h3>
                                                <p className="text-xs text-gray-500 truncate mt-1">{block.content.replace(/[#*`]/g, '').substring(0, 60)}...</p>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {block.metadata.featureId && (
                                                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Feature: {block.metadata.featureId}</span>
                                                    )}
                                                    {block.metadata.route && (
                                                        <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Route: {block.metadata.route}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {filteredBlocks.length === 0 && (
                                            <div className="p-4 text-center text-gray-500 text-sm">No blocks found</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Editor Panel */}
                            <div className="lg:col-span-2 h-[calc(100vh-250px)]">
                                {selectedBlock ? (
                                    <DocumentationEditor
                                        key={selectedBlock.id}
                                        block={selectedBlock}
                                        onUpdate={handleBlockUpdate}
                                        onCommit={handleCommit}
                                    />
                                ) : (
                                    <div className="bg-white rounded-lg shadow h-full flex flex-col justify-center items-center text-center p-8">
                                        <FileText className="w-16 h-16 text-gray-200 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-900">No Block Selected</h3>
                                        <p className="text-gray-500 max-w-sm mt-2">Select a documentation block from the list to start editing content and metadata.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <FeatureComparisonView comparisonResult={comparisonResult} />
                    )}

                    {activeTab === 'structure' && (
                        <DocumentationStructureView />
                    )}
                </>
            )}
        </div>
    );
}

// Documentation Editor Component
const DocumentationEditor: React.FC<{
    block: DocumentationBlock;
    onUpdate: (block: DocumentationBlock) => void;
    onCommit: (message: string) => void;
}> = ({ block, onUpdate, onCommit }) => {
    const [title, setTitle] = useState(block.title);
    const [content, setContent] = useState(block.content);
    const [featureId, setFeatureId] = useState(block.metadata.featureId || '');
    const [route, setRoute] = useState(block.metadata.route || '');
    const [audience, setAudience] = useState(block.metadata.audience?.join(', ') || '');
    const [surface, setSurface] = useState(block.metadata.surface?.join(', ') || '');
    const [tags, setTags] = useState(block.metadata.tags?.join(', ') || '');
    const [commitMessage, setCommitMessage] = useState('');

    // Update local state when block changes
    // Local state is initialized from props.
    // Changing the 'key' in the parent component ensures this component remounts
    // when a different block is selected, resetting the state.


    const handleSave = () => {
        const updatedBlock: DocumentationBlock = {
            ...block,
            title,
            content,
            metadata: {
                featureId: featureId || undefined,
                route: route || undefined,
                audience: audience ? audience.split(',').map(a => a.trim()) : [],
                surface: surface ? surface.split(',').map(s => s.trim()) : [],
                tags: tags ? tags.split(',').map(t => t.trim()) : [],
            }
        };
        onUpdate(updatedBlock);
    };

    const handleCommitChanges = () => {
        if (!commitMessage.trim()) {
            alert('Please enter a commit message');
            return;
        }
        onCommit(commitMessage);
        setCommitMessage('');
    };

    return (
        <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        {block.level}
                    </span>
                    Edit Block
                </h2>
                <span className="text-xs text-gray-500 font-mono">{block.id}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Feature ID</label>
                            <input
                                type="text"
                                value={featureId}
                                onChange={(e) => setFeatureId(e.target.value)}
                                placeholder="e.g., auth.login"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Route</label>
                            <input
                                type="text"
                                value={route}
                                onChange={(e) => setRoute(e.target.value)}
                                placeholder="e.g., /login"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Audience</label>
                            <input
                                type="text"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                placeholder="e.g., user, admin"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Surface</label>
                            <input
                                type="text"
                                value={surface}
                                onChange={(e) => setSurface(e.target.value)}
                                placeholder="e.g., docs, help"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g., security"
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex flex-col md:flex-row gap-4">
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>

                <div className="flex-1"></div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        placeholder="Commit message..."
                        className="flex-1 md:w-64 px-3 py-2 border rounded-md text-sm"
                    />
                    <button
                        onClick={handleCommitChanges}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                    >
                        <GitCommit className="w-4 h-4" />
                        Commit
                    </button>
                </div>
            </div>
        </div>
    );
};

// Feature Comparison View Component
const FeatureComparisonView: React.FC<{ comparisonResult: ComparisonResult | null }> = ({ comparisonResult }) => {
    if (!comparisonResult) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center h-64 flex flex-col items-center justify-center">
                <p className="text-gray-500">Run feature comparison to see results</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Comparison Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">{comparisonResult.summary.totalPrdFeatures}</div>
                        <div className="text-gray-600">Features in PRD</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">{comparisonResult.summary.totalCodeFeatures}</div>
                        <div className="text-gray-600">Features in Code</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">{comparisonResult.summary.matchedFeatures}</div>
                        <div className="text-gray-600">Matched Features</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* PRD Only Features */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b bg-red-50">
                        <h3 className="font-semibold text-red-700">Features in PRD Only ({comparisonResult.prdOnly.length})</h3>
                    </div>
                    <div className="p-2 max-h-96 overflow-y-auto">
                        {comparisonResult.prdOnly.map(feature => (
                            <div key={feature.id} className="p-3 border-b last:border-0 hover:bg-gray-50">
                                <h4 className="font-medium text-gray-900">{feature.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                                <div className="mt-2 text-xs text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">{feature.section}</div>
                            </div>
                        ))}
                        {comparisonResult.prdOnly.length === 0 && <div className="p-4 text-center text-gray-500">None</div>}
                    </div>
                </div>

                {/* Matched Features */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b bg-green-50">
                        <h3 className="font-semibold text-green-700">Matched Features ({comparisonResult.matched.length})</h3>
                    </div>
                    <div className="p-2 max-h-96 overflow-y-auto">
                        {comparisonResult.matched.map((match, idx) => (
                            <div key={idx} className="p-3 border-b last:border-0 hover:bg-gray-50">
                                <h4 className="font-medium text-gray-900">{match.prd.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{match.prd.description}</p>
                                <div className="mt-2 text-xs grid grid-cols-1 gap-1">
                                    <div className="text-blue-600 bg-blue-50 px-2 py-1 rounded">PRD: {match.prd.prdReference}</div>
                                    <div className="text-green-600 bg-green-50 px-2 py-1 rounded">Code: {match.code.codeLocation}</div>
                                </div>
                            </div>
                        ))}
                        {comparisonResult.matched.length === 0 && <div className="p-4 text-center text-gray-500">None</div>}
                    </div>
                </div>

                {/* Code Only Features */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b bg-yellow-50">
                        <h3 className="font-semibold text-yellow-700">Features in Code Only ({comparisonResult.codeOnly.length})</h3>
                    </div>
                    <div className="p-2 max-h-96 overflow-y-auto">
                        {comparisonResult.codeOnly.map(feature => (
                            <div key={feature.id} className="p-3 border-b last:border-0 hover:bg-gray-50">
                                <h4 className="font-medium text-gray-900">{feature.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                                <div className="mt-2 text-xs text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">{feature.codeLocation}</div>
                            </div>
                        ))}
                        {comparisonResult.codeOnly.length === 0 && <div className="p-4 text-center text-gray-500">None</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Documentation Structure View Component
const DocumentationStructureView: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Documentation Structure</h2>
            </div>
            <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                <FileText className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-lg">Structure Visualization</p>
                <p className="mt-2 text-sm max-w-md text-center">This view would ideally visualize the file hierarchy and relationships between documentation artifacts.</p>
            </div>
        </div>
    );
};
