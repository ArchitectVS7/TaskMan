
import React, { useState } from 'react';
import { useHelp } from '../context/HelpContext';
import { Search, Hash } from 'lucide-react';

export default function HelpPage() {
    const { blocks, isLoading } = useHelp();
    const [searchQuery, setSearchQuery] = useState('');

    // Group blocks by level 1 headings (or level 2 if no level 1)
    const sections = React.useMemo(() => {
        if (!blocks.length) return [];

        const result: any[] = [];
        let currentSection: any = null;

        blocks.forEach(block => {
            // Assuming level 2 are main sections based on blocks examined
            if (block.level === 2) {
                if (currentSection) result.push(currentSection);
                currentSection = { ...block, children: [] };
            } else if (block.level > 2 && currentSection) {
                currentSection.children.push(block);
            }
        });

        if (currentSection) result.push(currentSection);
        return result;
    }, [blocks]);

    const filteredSections = searchQuery
        ? sections.filter(section =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.children.some((child: any) =>
                child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                child.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        )
        : sections;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center fixed inset-0">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Documentation</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about the Unified Task Management Platform.
                    </p>

                    <div className="mt-8 max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search the manual..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                    </div>
                </div>

                <div className="space-y-12">
                    {filteredSections.map((section: any) => (
                        <div key={section.blockId} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50">
                                <h2 className="text-2xl font-bold text-gray-900" id={section.blockId}>
                                    {section.title}
                                </h2>
                                <div className="mt-4 prose prose-indigo text-gray-600">
                                    <p>{section.content.replace(/^[#*>-] /gm, '')}</p>
                                </div>
                            </div>

                            {section.children.length > 0 && (
                                <div className="divide-y divide-gray-100">
                                    {section.children.map((child: any) => (
                                        <div key={child.blockId} className="p-6 md:p-8 hover:bg-gray-50 transition-colors" id={child.blockId}>
                                            <div className="flex items-start gap-3">
                                                <Hash className="w-5 h-5 text-gray-300 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                        {child.title}
                                                    </h3>
                                                    <div className="prose prose-sm text-gray-600 max-w-none">
                                                        <p className="whitespace-pre-wrap font-sans">{child.content.replace(/^[#]+ .*$/gm, '').trim()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
