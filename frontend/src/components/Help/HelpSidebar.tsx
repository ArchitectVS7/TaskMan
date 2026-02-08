
import { useState } from 'react';
import { useHelp } from '../../context/HelpContext';
import { X, Search, BookOpen, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Ensure this is installed or use simple rendering

export function HelpSidebar() {
    const { isOpen, closeHelp, suggestedBlocks, searchBlocks, isLoading } = useHelp();
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const searchResults = searchQuery ? searchBlocks(searchQuery) : [];


    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Help & Documentation
                </h2>
                <button
                    onClick={closeHelp}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <>
                        {searchQuery && searchResults.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No results found for "{searchQuery}"
                            </div>
                        )}

                        {!searchQuery && suggestedBlocks.length > 0 && (
                            <div className="mb-2">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    Recommended for this page
                                </h3>
                                <div className="space-y-4">
                                    {suggestedBlocks.map(block => (
                                        <div key={block.blockId} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
                                            <h4 className="font-medium text-gray-900 mb-1">{block.title}</h4>
                                            <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                                                <ReactMarkdown>{block.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchQuery && (
                            <div className="space-y-4">
                                {searchResults.map(block => (
                                    <div key={block.blockId} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-colors">
                                        <h4 className="font-medium text-gray-900 mb-1">{block.title}</h4>
                                        <div className="text-sm text-gray-600">
                                            <p className="line-clamp-3">{block.content.replace(/^[#*>-] /gm, '')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!searchQuery && suggestedBlocks.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <p>Browse the full documentation for more.</p>
                                <a href="/help" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-flex items-center gap-1">
                                    Open User Manual <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <a href="/help" className="block w-full text-center py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    View Full Documentation
                </a>
            </div>
        </div>
    );
}
