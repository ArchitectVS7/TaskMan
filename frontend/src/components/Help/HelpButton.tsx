
import { useHelp } from '../../context/HelpContext';
import { HelpCircle } from 'lucide-react';

export function HelpButton() {
    const { toggleHelp } = useHelp();

    return (
        <button
            onClick={toggleHelp}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Help & Documentation"
            aria-label="Toggle help"
        >
            <HelpCircle className="w-5 h-5" />
        </button>
    );
}
