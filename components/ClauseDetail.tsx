
import React, { useState, useMemo } from 'react';
import type { Category, ChecklistItem, LearningHubItem, AuditStatus } from '../types';
import Card from './Card';

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

interface ClauseDetailProps {
  clauseId: string;
  onBack: () => void;
  categories: Category[];
  learningData: LearningHubItem[];
}

const getStatusClasses = (status: AuditStatus): { bg: string, text: string } => {
    switch (status) {
        case 'Conformant': return { bg: 'bg-green-500/10', text: 'text-green-400' };
        case 'Non-Conformant': return { bg: 'bg-rose-500/10', text: 'text-rose-400' };
        case 'Observation': return { bg: 'bg-yellow-500/10', text: 'text-yellow-400' };
        case 'Not Applicable': return { bg: 'bg-gray-500/10 opacity-60', text: 'text-gray-400' };
        case 'Not Audited':
        default: return { bg: 'bg-gray-600/20', text: 'text-gray-300' };
    }
};

const ClauseDetail: React.FC<ClauseDetailProps> = ({ clauseId, onBack, categories, learningData }) => {
    // State for clause-level compliance tracking
    const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>('To Do');
    const [result, setResult] = useState<'Not Assessed' | 'Conformant' | 'Non-Conformant' | 'Observation'>('Not Assessed');
    const [score, setScore] = useState('');
    const [observation, setObservation] = useState('');

    const clauseInfo = useMemo(() => {
        return learningData.find(item => item.id.toLowerCase() === clauseId.toLowerCase());
    }, [clauseId, learningData]);

    const linkedItems = useMemo(() => {
        return categories.flatMap(cat => 
            cat.items.filter(item => item.clause?.toLowerCase() === clauseId.toLowerCase())
        );
    }, [clauseId, categories]);

    if (!clauseInfo) {
        return (
             <div>
                <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <Card>
                    <p className="text-center text-rose-400">Clause information for "{clauseId}" not found in the Learning Hub.</p>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <button onClick={onBack} className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 font-semibold">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Category View</span>
            </button>
            
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{clauseId}</h1>
                <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                   {clauseInfo.what}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 space-y-8">
                    <Card>
                        <h2 className="text-xl font-bold text-purple-400 mb-4">Guidance</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-semibold text-gray-200 uppercase tracking-wide text-xs">Why it Matters</p>
                                <p className="text-gray-300 mt-1">{clauseInfo.why}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-200 uppercase tracking-wide text-xs">How to Implement</p>
                                <p className="text-gray-300 mt-1">{clauseInfo.how}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-bold text-purple-400 mb-4">Linked Controls</h2>
                        <div className="space-y-3">
                        {linkedItems.length > 0 ? linkedItems.map(item => {
                            const statusClasses = getStatusClasses(item.status);
                            const formattedDetails = item.details.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">$1</a>');
                            return (
                                <div key={item.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-white pr-4">{item.security}</p>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md whitespace-nowrap ${statusClasses.bg} ${statusClasses.text}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: formattedDetails }} />
                                </div>
                            )
                        }) : <p className="text-gray-500">No controls are linked to this clause.</p>}
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <h2 className="text-xl font-bold text-purple-400 mb-4">Compliance Assessment</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="clause-status" className="block text-sm font-medium text-gray-400">Status</label>
                                <select id="clause-status" value={status} onChange={e => setStatus(e.target.value as any)} className="input-style mt-1 block w-full">
                                    <option>To Do</option>
                                    <option>In Progress</option>
                                    <option>Done</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="clause-result" className="block text-sm font-medium text-gray-400">Result</label>
                                <select id="clause-result" value={result} onChange={e => setResult(e.target.value as any)} className="input-style mt-1 block w-full">
                                    <option>Not Assessed</option>
                                    <option>Conformant</option>
                                    <option>Non-Conformant</option>
                                    <option>Observation</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="clause-score" className="block text-sm font-medium text-gray-400">Score</label>
                                <input id="clause-score" type="number" value={score} onChange={e => setScore(e.target.value)} className="input-style mt-1 block w-full" placeholder="e.g., 85" />
                            </div>
                            <div>
                                <label htmlFor="clause-observation" className="block text-sm font-medium text-gray-400">Observations & Evidence</label>
                                <textarea id="clause-observation" value={observation} onChange={e => setObservation(e.target.value)} rows={4} className="input-style mt-1 block w-full" placeholder="Add notes on overall clause compliance..." />
                            </div>
                             <div className="pt-2">
                                <button type="button" onClick={() => alert('Assessment saved (not persisted in this version).')} className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
                                    Save Assessment
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
            <style>{`.input-style { background-color: #1a1e26; border: 1px solid #4a5568; border-radius: 0.375rem; padding: 0.5rem 0.75rem; color: white; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #a78bfa; border-color: #8b5cf6; }`}</style>
        </div>
    );
};

export default ClauseDetail;
