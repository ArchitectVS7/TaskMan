
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export interface ContentBlock {
    blockId: string;
    title: string;
    content: string;
    level: number;
    sortOrder: number;
    metadata: {
        featureId?: string;
        route?: string;
        audience?: string[];
        surface?: string[];
        tags?: string[];
    };
}

interface HelpContextType {
    isOpen: boolean;
    toggleHelp: () => void;
    closeHelp: () => void;
    openHelp: () => void;
    blocks: ContentBlock[];
    isLoading: boolean;
    suggestedBlocks: ContentBlock[];
    searchBlocks: (query: string) => ContentBlock[];
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Load documentation on mount
    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const response = await fetch('/data/docs/database/content_blocks.json');
                if (response.ok) {
                    const data = await response.json();
                    setBlocks(data);
                } else {
                    console.error('Failed to load documentation:', response.statusText);
                }
            } catch (error) {
                console.error('Error loading documentation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocs();
    }, []);

    const toggleHelp = () => setIsOpen(prev => !prev);
    const closeHelp = () => setIsOpen(false);
    const openHelp = () => setIsOpen(true);

    // Find suggested blocks based on current route
    const suggestedBlocks = React.useMemo(() => {
        if (!blocks.length) return [];

        // Normalize current path (remove trailing slash, etc.)
        const currentPath = location.pathname;

        return blocks.filter(block => {
            if (!block.metadata?.route) return false;

            // Exact match or prefix match
            return currentPath === block.metadata.route ||
                (block.metadata.route !== '/' && currentPath.startsWith(block.metadata.route));
        }).sort((a, b) => (b.metadata.route?.length || 0) - (a.metadata.route?.length || 0)); // Prioritize more specific matches
    }, [blocks, location.pathname]);

    const searchBlocks = (query: string) => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return blocks.filter(block =>
            block.title.toLowerCase().includes(lowerQuery) ||
            block.content.toLowerCase().includes(lowerQuery)
        ).slice(0, 10); // Limit results
    };

    return (
        <HelpContext.Provider value={{
            isOpen,
            toggleHelp,
            closeHelp,
            openHelp,
            blocks,
            isLoading,
            suggestedBlocks,
            searchBlocks
        }}>
            {children}
        </HelpContext.Provider>
    );
}

export function useHelp() {
    const context = useContext(HelpContext);
    if (context === undefined) {
        throw new Error('useHelp must be used within a HelpProvider');
    }
    return context;
}
