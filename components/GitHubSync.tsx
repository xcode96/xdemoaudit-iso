
import React, { useState } from 'react';
import Card from './Card';
import type { Category, RawCategory } from '../types';
import { sanitizeCategoriesForStorage } from '../constants';

interface GitHubSyncProps {
  categories: Category[];
  onImport: (data: RawCategory[]) => void;
}

const GitHubSync: React.FC<GitHubSyncProps> = ({ categories, onImport }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [path, setPath] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'push' | 'pull' | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handlePush = async () => {
    setAction('push');
    setLoading(true);
    setStatus({ type: 'info', message: 'Pushing data to GitHub...' });

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    try {
      let sha: string | undefined;
      try {
        const getResponse = await fetch(apiUrl, { headers });
        if (getResponse.ok) {
          const fileData = await getResponse.json();
          sha = fileData.sha;
        } else if (getResponse.status !== 404) {
           const errorData = await getResponse.json();
           throw new Error(`Failed to get file info: ${errorData.message || getResponse.statusText}`);
        }
      } catch (err) {
        console.warn('Could not fetch existing file SHA, proceeding with creation attempt.', err);
      }
      
      const storableData = sanitizeCategoriesForStorage(categories);
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(storableData, null, 2))));
      const body = JSON.stringify({
        message: `Sync: Digital Defense Checklist update ${new Date().toISOString()}`,
        content: content,
        sha: sha,
      });

      const putResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {...headers, 'Content-Type': 'application/json'},
        body: body,
      });

      if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(`GitHub API Error: ${errorData.message || putResponse.statusText}`);
      }

      setStatus({ type: 'success', message: 'Successfully pushed to GitHub!' });

    } catch (error) {
      console.error('GitHub Push Error:', error);
      setStatus({ type: 'error', message: (error as Error).message || 'An unknown error occurred during push.' });
    } finally {
      setLoading(false);
      setAction(null);
    }
  };
  
  const handlePull = async () => {
    setAction('pull');
    setLoading(true);
    setStatus({ type: 'info', message: 'Pulling data from GitHub...' });

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const headers = {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    try {
        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch file: ${errorData.message || response.statusText}`);
        }
        
        const fileData = await response.json();
        if (fileData.encoding !== 'base64') {
            throw new Error('File encoding is not base64.');
        }
        
        let parsedData;
        try {
            const decodedContent = decodeURIComponent(escape(atob(fileData.content)));
            parsedData = JSON.parse(decodedContent);
        } catch(e) {
            console.error("JSON Parsing Error on Pull:", e);
            throw new Error("The file from GitHub is not valid JSON. Please ensure the 'File Path' points to a correct checklist data file, not a source code file.");
        }

        // Basic validation
        if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].id && parsedData[0].title && Array.isArray(parsedData[0].items)) {
           if (window.confirm('Are you sure you want to import data from GitHub? This will overwrite your current checklist.')) {
             onImport(parsedData);
             setStatus({ type: 'success', message: 'Successfully pulled and updated from GitHub!' });
           } else {
             setStatus({ type: 'info', message: 'Pull operation cancelled.' });
           }
        } else {
            throw new Error('Fetched file has invalid format.');
        }

    } catch (error) {
      console.error('GitHub Pull Error:', error);
      setStatus({ type: 'error', message: (error as Error).message || 'An unknown error occurred during pull.' });
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleSubmit = (e: React.FormEvent, submitAction: 'push' | 'pull') => {
    e.preventDefault();
    if (!owner || !repo || !path || !token) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }
    
    if (submitAction === 'push') {
        handlePush();
    } else {
        handlePull();
    }
  };

  return (
    <Card>
        <h3 className="text-xl font-bold text-white mb-4">Sync to GitHub</h3>
        <p className="text-sm text-gray-400 mb-4">Push or pull your checklist data to a file in a GitHub repository. You'll need a <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">Personal Access Token (PAT)</a> with `repo` scope.</p>
        <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="github-owner" className="block text-sm font-medium text-gray-400">Owner</label>
                    <input type="text" id="github-owner" value={owner} onChange={e => setOwner(e.target.value)} className="mt-1 block w-full input-style" placeholder="e.g., your-username" />
                </div>
                 <div>
                    <label htmlFor="github-repo" className="block text-sm font-medium text-gray-400">Repository</label>
                    <input type="text" id="github-repo" value={repo} onChange={e => setRepo(e.target.value)} className="mt-1 block w-full input-style" placeholder="e.g., my-checklists" />
                </div>
            </div>
            <div>
                <label htmlFor="github-path" className="block text-sm font-medium text-gray-400">File Path</label>
                <input type="text" id="github-path" value={path} onChange={e => setPath(e.target.value)} className="mt-1 block w-full input-style" placeholder="e.g., data/checklist.json" />
            </div>
            <div>
                <label htmlFor="github-token" className="block text-sm font-medium text-gray-400">Personal Access Token (PAT)</label>
                <input type="password" id="github-token" value={token} onChange={e => setToken(e.target.value)} className="mt-1 block w-full input-style" placeholder="ghp_..." />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'pull')}
                    disabled={loading}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading && action === 'pull' ? 'Pulling...' : 'Pull from GitHub'}
                </button>
                <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'push')}
                    disabled={loading}
                    className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading && action === 'push' ? 'Pushing...' : 'Push to GitHub'}
                </button>
            </div>
            {status && (
                <div className={`mt-4 text-center text-sm p-2 rounded-md ${
                    status.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 
                    status.type === 'error' ? 'bg-rose-500/20 text-rose-300' : 'bg-sky-500/20 text-sky-300'
                }`}>
                    {status.message}
                </div>
            )}
        </form>
         <style>{`
            .input-style {
                background-color: #1a1e26;
                border: 1px solid #4a5568;
                border-radius: 0.375rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                padding: 0.5rem 0.75rem;
                color: white;
            }
            .input-style:focus {
                outline: none;
                box-shadow: 0 0 0 2px #a78bfa;
                border-color: #8b5cf6;
            }
        `}</style>
    </Card>
  );
};

export default GitHubSync;
