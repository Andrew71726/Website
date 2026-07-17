import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import {
  GitBranch,
  GitCommit,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Key,
  Shield,
  BookOpen,
  FileCode,
  Check,
  Copy,
  Plus,
  RefreshCw,
  ExternalLink,
  Cpu,
  Database,
  Eye,
  Terminal,
  Info,
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

// Define TS Interfaces for high density view
interface Job {
  id: string;
  status: 'Success' | 'Failed' | 'Running';
  articlesGenerated: number;
  filesChanged: number;
  timestamp: string;
  trigger: string;
  topic?: string;
}

interface LogLine {
  text: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'done';
  timestamp: string;
}

const DEFAULT_JOBS: Job[] = [
  { id: '#9420', status: 'Success', articlesGenerated: 1, filesChanged: 2, timestamp: 'Today, 02:00:14 AM', trigger: 'Scheduled (Cron)', topic: 'The Future of AI-Powered GitHub Actions in Modern DevOps' },
  { id: '#9419', status: 'Success', articlesGenerated: 1, filesChanged: 2, timestamp: 'Yesterday, 02:00:11 AM', trigger: 'Scheduled (Cron)', topic: 'How Automated Article Generation with GPT-4 Transforms Blogging' },
  { id: '#9418', status: 'Success', articlesGenerated: 1, filesChanged: 2, timestamp: '2 days ago, 02:01:04 AM', trigger: 'Scheduled (Cron)', topic: 'Optimizing Python Scripts for Static Site Search Engines' },
  { id: '#9417', status: 'Success', articlesGenerated: 1, filesChanged: 2, timestamp: '3 days ago, 02:00:09 AM', trigger: 'Scheduled (Cron)', topic: 'A Guide to Dynamic Sitemap Updates with Python and XML Tree' },
  { id: '#9416', status: 'Failed', articlesGenerated: 0, filesChanged: 0, timestamp: '4 days ago, 02:04:22 AM', trigger: 'Manual', topic: 'The Evolution of Zero-Maintenance Serverless Web Applications' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'yaml' | 'script' | 'guide'>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [currentJobId, setCurrentJobId] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Custom states for interactive features
  const [openaiKeyInput, setOpenaiKeyInput] = useState('');
  const [isSecretSaved, setIsSecretSaved] = useState(false);
  const [cronString, setCronString] = useState('0 18 * * *');
  const [pythonTopicIndex, setPythonTopicIndex] = useState(0);

  // Terminal Logs State
  const [logLines, setLogLines] = useState<LogLine[]>([
    { text: '[INFO] Initializing scheduler engine...', type: 'info', timestamp: '02:00:00 AM' },
    { text: '[INFO] Cron pattern matching target: 0 18 * * * (02:00 AM Malaysia Time)', type: 'info', timestamp: '02:00:01 AM' },
    { text: '[INFO] Setting up Python 3.11 environment...', type: 'info', timestamp: '02:00:02 AM' },
    { text: '[INFO] Successfully installed dependencies from requirements.txt (openai>=1.0.0)', type: 'info', timestamp: '02:00:04 AM' },
    { text: '[INFO] Authenticating with OpenAI API using secret KEY...', type: 'info', timestamp: '02:00:05 AM' },
    { text: '[INFO] Generating content for: "The Future of AI-Powered GitHub Actions in Modern DevOps"', type: 'info', timestamp: '02:00:06 AM' },
    { text: '[SUCCESS] Content generated successfully (1842 words, static page created under /articles/the-future-of-ai.html).', type: 'success', timestamp: '02:00:10 AM' },
    { text: '[INFO] Updating sitemap.xml with new entry.', type: 'info', timestamp: '02:00:11 AM' },
    { text: '[INFO] Committing 2 changes back to origin/main branch...', type: 'info', timestamp: '02:00:12 AM' },
    { text: '[DONE] Workflow completed successfully. All artifacts persisted. Next scheduled run in 23h 59m.', type: 'done', timestamp: '02:00:14 AM' }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logLines]);

  // Simulation topics array
  const simulationTopics = [
    "Setting Up High-Density Performance Monitors for Cloud Workloads",
    "A Guide to Dynamic Sitemap Updates with Python and XML Tree",
    "The Evolution of Zero-Maintenance Serverless Web Applications",
    "Maximizing SEO Score with Automated Markdown Static-Sites",
    "Continuous Article Deployment: From OpenAI prompt to Production HTML"
  ];

  // Helper copy function
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Run full simulation
  const startSimulation = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimulationStep(0);
    setSimulatedProgress(0);
    
    const newId = `#94${Math.floor(Math.random() * 90 + 21)}`;
    setCurrentJobId(newId);

    // Add a new job in running state at the top of the list
    const selectedTopic = simulationTopics[pythonTopicIndex];
    const newRunningJob: Job = {
      id: newId,
      status: 'Running',
      articlesGenerated: 0,
      filesChanged: 0,
      timestamp: 'Just now',
      trigger: 'Manual Run',
      topic: selectedTopic
    };
    
    setJobs(prev => [newRunningJob, ...prev]);

    // Clear logs and begin simulation stream
    const startTimeStr = new Date().toLocaleTimeString('en-MY', { hour12: true });
    setLogLines([
      { text: `[INFO] Initializing manual run for Job ${newId} (workflow_dispatch)...`, type: 'info', timestamp: startTimeStr }
    ]);
  };

  // Simulation Steps Interval Effect
  useEffect(() => {
    if (!isSimulating) return;

    const topicSelected = simulationTopics[pythonTopicIndex];
    const slug = topicSelected.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const simulationSequence = [
      { text: '[INFO] Requesting GitHub virtual runner (ubuntu-latest)...', type: 'info', progress: 10 },
      { text: '[INFO] Pulling branch main (depth: full)...', type: 'info', progress: 20 },
      { text: '[INFO] Installing Python 3.11 with pip optimization cache...', type: 'info', progress: 30 },
      { text: '[INFO] Pip command executed: python -m pip install -r requirements.txt', type: 'info', progress: 42 },
      { text: '[INFO] Collecting Packages: openai, certifi, urllib3, charset-normalizer...', type: 'info', progress: 50 },
      { text: '[SUCCESS] Installed 6 packages successfully from requirements.txt', type: 'success', progress: 58 },
      { text: '[INFO] Reading Environment secrets. Seeking OPENAI_API_KEY...', type: 'info', progress: 65 },
      { text: isSecretSaved 
        ? '[SUCCESS] Found active custom repository secret: OPENAI_API_KEY (SHA256: HashVerified)' 
        : '[WARNING] No repository secret OPENAI_API_KEY found! Falling back to trial API limit.', type: isSecretSaved ? 'success' : 'warning', progress: 72 },
      { text: `[INFO] Running target script: python generate.py (Topic: "${topicSelected}")`, type: 'info', progress: 80 },
      { text: `[SUCCESS] OpenAI API response received. Created static article "articles/${slug}.html" (2,100 words)`, type: 'success', progress: 88 },
      { text: `[INFO] Sitemap update complete: Appended https://example.com/articles/${slug}.html to sitemap.xml`, type: 'info', progress: 92 },
      { text: '[INFO] Git pushing modified sitemap.xml and new article file to origin/main...', type: 'info', progress: 97 },
      { text: `[DONE] Run ${currentJobId} completed successfully! [skip ci] build pipeline bypassed.`, type: 'done', progress: 100 }
    ];

    if (simulationStep < simulationSequence.length) {
      const timer = setTimeout(() => {
        const step = simulationSequence[simulationStep];
        setSimulatedProgress(step.progress);
        
        const timestampStr = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        });

        setLogLines(prev => [...prev, {
          text: step.text,
          type: step.type as any,
          timestamp: timestampStr
        }]);

        setSimulationStep(prev => prev + 1);
      }, 750);
      return () => clearTimeout(timer);
    } else {
      // Finalize simulation: Change job status from 'Running' to 'Success'
      setJobs(prev => prev.map(job => {
        if (job.id === currentJobId) {
          return {
            ...job,
            status: 'Success',
            articlesGenerated: 1,
            filesChanged: 2,
            timestamp: 'Just now'
          };
        }
        return job;
      }));
      setIsSimulating(false);
      // Increment selected topic index so the next run uses a different title
      setPythonTopicIndex(prev => (prev + 1) % simulationTopics.length);
    }
  }, [isSimulating, simulationStep]);

  // Static strings for copy
  const workflowYamlCode = `name: Auto-Publish Articles

on:
  schedule:
    # Run every day at 2:00 AM Malaysia Time (MYT), which is UTC+8.
    # 2:00 AM MYT = 18:00 (6:00 PM) UTC of the previous day.
    - cron: '${cronString}'
  # Enable manual triggering of this workflow from the GitHub Actions tab
  workflow_dispatch:

permissions:
  contents: write

jobs:
  publish:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then
            pip install -r requirements.txt
          else
            pip install openai
          fi

      - name: Run article generation script
        env:
          OPENAI_API_KEY: \${{ secrets.OPENAI_API_KEY }}
        run: |
          if [ -f generate.py ]; then
            python generate.py
          elif [ -f main.py ]; then
            python main.py
          else
            echo "::warning::No python generation script found."
          fi

      - name: Commit and push generated HTML files and sitemap
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
          
          git add "**/*.html" 2>/dev/null || true
          git add "*.html" 2>/dev/null || true
          git add sitemap.xml 2>/dev/null || true
          
          if [ -n "$(git status --porcelain)" ]; then
            git commit -m "Auto-generate new articles and update sitemap.xml [skip ci]"
            git push origin HEAD:\${{ github.ref }}
          else
            echo "No new files or changes detected to commit."
          fi`;

  const pythonScriptCode = `import os
import sys
import re
from datetime import datetime
from openai import OpenAI

def main():
    # 1. Fetch OpenAI API Key from Repository Secret
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("[ERROR] OPENAI_API_KEY not found in environment.")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # 2. Dynamic Article Title Selection List
    topics = [
        "The Future of AI-Powered GitHub Actions in Modern DevOps",
        "How Automated Article Generation with GPT-4 Transforms Blogging",
        "Optimizing Python Scripts for Static Site Search Engines",
        "Setting Up High-Density Performance Monitors for Cloud Workloads",
        "A Guide to Dynamic Sitemap Updates with Python and XML Tree",
        "The Evolution of Zero-Maintenance Serverless Web Applications"
    ]

    # Pick a rotating topic based on today's date
    day_of_month = datetime.now().day
    selected_topic = topics[day_of_month % len(topics)]
    print(f"[INFO] Selected Topic: {selected_topic}")

    # Ensure articles directory exists
    os.makedirs("articles", exist_ok=True)

    # 3. Request GPT article with custom CSS styles
    prompt = f"""
    Write a comprehensive, engaging article about: "{selected_topic}".
    Generate a full-page standalone HTML document.
    Requirements:
    - Beautiful modern header, article body, elegant author card, footers.
    - Style fully using Tailwind CSS CDN (https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4).
    - Output raw HTML only without any backticks wrappers.
    """

    print("[INFO] Calling OpenAI API...")
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    
    html_content = response.choices[0].message.content.strip()
    
    # Save to disk
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', selected_topic.lower()).strip('-')
    filename = f"articles/{slug}.html"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[SUCCESS] Saved static article under: {filename}")

    # 4. Update XML sitemap
    sitemap_file = "sitemap.xml"
    article_url = f"https://example.com/{filename}"
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    sitemap_entry = f"""  <url>
    <loc>{article_url}</loc>
    <lastmod>{current_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""
    
    if os.path.exists(sitemap_file):
        with open(sitemap_file, "r") as sf:
            sitemap_content = sf.read()
        if article_url not in sitemap_content:
            updated = sitemap_content.replace("</urlset>", f"{sitemap_entry}\\n</urlset>")
            with open(sitemap_file, "w") as sf_write:
                sf_write.write(updated)
            print(f"[INFO] Dynamic entry added to sitemap.xml")

if __name__ == "__main__":
    main()`;

  return (
    <div className="min-h-screen bg-[#07090E] text-[#D1D5DB] font-sans flex items-center justify-center p-2 sm:p-4">
      {/* Container - Fixed to requested dimensions 1024x768 on desktop for strict High-Density style */}
      <div 
        id="control-center-panel" 
        className="w-full max-w-5xl md:h-[730px] bg-[#0A0D14] rounded-xl border border-[#1F293D] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-5 py-4 border-b border-[#1E2538] bg-[#0E121E] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white font-mono">.github/workflows/auto-publish.yml</h1>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-mono font-semibold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-mono">
                Daily Automatic Publishing • Scheduled at 02:00 MYT (Malaysia Time)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="hidden md:flex px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded">
              CRON: {cronString}
            </div>
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-all border ${
                isSimulating
                  ? 'bg-[#121622] text-gray-500 border-[#1E232E] cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400/30 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                  <span>Running Job...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Manual Trigger</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Inner layout (Sidebar + main) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Side navigation */}
          <aside className="w-full md:w-60 bg-[#080B11] border-b md:border-b-0 md:border-r border-[#1E2538] flex flex-col justify-between p-4 space-y-4 shrink-0">
            <div className="space-y-4">
              {/* Menu Tabs */}
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Control Desk</h2>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      activeTab === 'dashboard'
                        ? 'bg-[#1A2333] text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#0E131F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Console & Logs</span>
                    </div>
                    {isSimulating && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('yaml')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      activeTab === 'yaml'
                        ? 'bg-[#1A2333] text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#0E131F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>auto-publish.yml</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500">YAML</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('script')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      activeTab === 'script'
                        ? 'bg-[#1A2333] text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#0E131F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5" />
                      <span>generate.py</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500">Python</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('guide')}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      activeTab === 'guide'
                        ? 'bg-[#1A2333] text-blue-400 border-l-2 border-blue-500 font-semibold'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#0E131F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Secrets Setup Guide</span>
                    </div>
                    {!isSecretSaved && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </button>
                </nav>
              </div>

              {/* Secrets configuration component directly in sidebar */}
              <div className="p-3 bg-[#0B0E14] rounded-lg border border-[#1E2538] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-amber-500" /> API Secret Store
                  </span>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSecretSaved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  OpenAI Key is injected from repository secrets to safeguard keys:
                </p>
                
                {isSecretSaved ? (
                  <div className="space-y-1">
                    <div className="bg-[#121824] px-2 py-1 rounded text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                      <span>sk-proj-••••4x92</span>
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <button 
                      onClick={() => setIsSecretSaved(false)} 
                      className="text-[9px] text-red-400 hover:underline cursor-pointer block font-mono"
                    >
                      Clear simulated key
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="password"
                      placeholder="sk-proj-..."
                      value={openaiKeyInput}
                      onChange={(e) => setOpenaiKeyInput(e.target.value)}
                      className="w-full text-[10px] px-2 py-1 bg-black/40 border border-[#1F293D] rounded text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (openaiKeyInput.trim()) {
                          setIsSecretSaved(true);
                          setOpenaiKeyInput('');
                        }
                      }}
                      className="w-full py-1 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 rounded text-[9px] font-mono transition-colors"
                    >
                      Verify & Save Secret
                    </button>
                  </div>
                )}
              </div>

              {/* Environment Information */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Environment</h3>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Python Runtime</span>
                    <span className="text-blue-400">v3.11</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Pip Installer</span>
                    <span className="text-gray-300">v24.x</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>OS Runner</span>
                    <span className="text-gray-300">ubuntu-latest</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500">
                    <span>Sitemap Tracker</span>
                    <span className="text-blue-400">sitemap.xml</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics block */}
            <div className="pt-3 border-t border-[#1C2233] bg-black/10">
              <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono">
                <span className="text-gray-500">Overall Success Rate</span>
                <span className="text-emerald-400 font-bold">100%</span>
              </div>
              <div className="w-full bg-[#161B29] h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full" />
              </div>
            </div>
          </aside>

          {/* Main workspace */}
          <main className="flex-1 flex flex-col bg-[#0A0D14] overflow-hidden">
            
            <AnimatePresence mode="wait">
              {/* Dashboard / Console logs view */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  {/* Performance stats bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[#1E2538] divide-x divide-[#1E2538] bg-[#0E121E]/30 shrink-0">
                    <div className="p-3">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Trigger Frequency</span>
                      <p className="text-xs font-bold text-gray-200 mt-1 font-mono">Every Day at 2:00 AM</p>
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Target Directory</span>
                      <p className="text-xs font-bold text-gray-200 mt-1 font-mono">/articles/*.html</p>
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Automation Scope</span>
                      <p className="text-xs font-bold text-gray-200 mt-1 font-mono">Commit back to Main</p>
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Sitemaps URL File</span>
                      <p className="text-xs font-bold text-emerald-400 mt-1 font-mono">sitemap.xml (Active)</p>
                    </div>
                  </div>

                  {/* Execution history block */}
                  <div className="flex-1 p-4 min-h-0 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" /> Scheduled Execution History
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 font-mono">Timezone: Asia/Kuala_Lumpur (MYT)</span>
                        <button 
                          onClick={() => setJobs(DEFAULT_JOBS)}
                          className="text-gray-500 hover:text-white transition-colors"
                          title="Reset history"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Table of jobs */}
                    <div className="flex-1 border border-[#1E2538] rounded-lg bg-[#07090E] overflow-y-auto max-h-[220px]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-[#0E121E] text-gray-400 uppercase text-[9px] tracking-wider z-10">
                          <tr className="border-b border-[#1E2538]">
                            <th className="px-3 py-2 font-medium">Job ID</th>
                            <th className="px-3 py-2 font-medium">Status</th>
                            <th className="px-3 py-2 font-medium">Topic Generated</th>
                            <th className="px-3 py-2 font-medium text-center">Files Added</th>
                            <th className="px-3 py-2 font-medium text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono divide-y divide-[#131929] text-[11px]">
                          {jobs.map((job) => (
                            <tr 
                              key={job.id} 
                              className={`hover:bg-blue-500/5 transition-colors cursor-default ${
                                job.status === 'Running' ? 'bg-blue-500/5 animate-pulse' : ''
                              }`}
                            >
                              <td className="px-3 py-2 text-blue-400 font-semibold">{job.id}</td>
                              <td className="px-3 py-2">
                                {job.status === 'Running' ? (
                                  <span className="flex items-center gap-1.5 text-blue-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                                    <span>Running...</span>
                                  </span>
                                ) : job.status === 'Success' ? (
                                  <span className="flex items-center gap-1.5 text-emerald-400">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    <span>Success</span>
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 text-rose-400">
                                    <XCircle className="w-3 h-3 text-rose-500" />
                                    <span>Failed</span>
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-gray-300 max-w-xs truncate" title={job.topic}>
                                {job.topic || "Article Generation"}
                              </td>
                              <td className="px-3 py-2 text-center text-gray-400">
                                {job.status === 'Running' ? '-' : `+${job.filesChanged} files`}
                              </td>
                              <td className="px-3 py-2 text-right text-gray-500">{job.timestamp}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Simulation Topic Selector */}
                    <div className="mt-2 flex items-center justify-between px-3 py-2 bg-[#0C101B]/80 rounded border border-[#1D243A] text-xs font-mono text-gray-400">
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-blue-400" />
                        <span>Next simulation topic:</span>
                        <select 
                          value={pythonTopicIndex}
                          onChange={(e) => setPythonTopicIndex(Number(e.target.value))}
                          className="bg-[#151B2E] text-white border border-[#232D48] px-2 py-0.5 rounded text-xs focus:outline-none focus:border-blue-500"
                        >
                          {simulationTopics.map((topic, i) => (
                            <option key={i} value={i}>{topic.substring(0, 45)}...</option>
                          ))}
                        </select>
                      </div>
                      <span className="text-[10px] text-gray-500">Click Manual Trigger to run</span>
                    </div>
                  </div>

                  {/* Console Log Stream */}
                  <div className="h-44 border-t border-[#1E2538] bg-[#05070A] p-4 font-mono flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-gray-400 animate-pulse" />
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          Live Pipeline Console Output {currentJobId && `[Job ${currentJobId}]`}
                        </span>
                      </div>
                      {isSimulating && (
                        <div className="flex items-center gap-2 w-48">
                          <div className="w-full bg-[#161B29] h-1 rounded overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${simulatedProgress}%` }} />
                          </div>
                          <span className="text-[10px] text-blue-400 w-8 text-right font-bold">{simulatedProgress}%</span>
                        </div>
                      )}
                    </div>

                    {/* Console body */}
                    <div className="flex-1 overflow-y-auto text-[11px] leading-normal text-gray-300 space-y-1 select-text bg-[#030406] p-2.5 rounded border border-[#121724]">
                      {logLines.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2 py-0.5 hover:bg-white/5 transition-colors">
                          <span className="text-gray-600 select-none shrink-0">{line.timestamp}</span>
                          <span className={`shrink-0 font-bold ${
                            line.type === 'error' ? 'text-rose-500' : 
                            line.type === 'success' ? 'text-emerald-400' : 
                            line.type === 'done' ? 'text-blue-400' : 
                            line.type === 'warning' ? 'text-amber-400' : 'text-blue-500'
                          }`}>
                            {line.type === 'error' ? '[ERROR]' : 
                             line.type === 'success' ? '[SUCCESS]' : 
                             line.type === 'done' ? '[PASS]' : 
                             line.type === 'warning' ? '[WARN]' : '[INFO]'}
                          </span>
                          <span className="text-gray-200">{line.text}</span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* YAML Editor / Code Viewer */}
              {activeTab === 'yaml' && (
                <motion.div
                  key="yaml"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="p-3 border-b border-[#1E2538] bg-[#0E121E]/30 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-amber-500" />
                      <span>.github/workflows/auto-publish.yml</span>
                      <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px] uppercase">READ-ONLY TEMPLATE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Change Scheduled Time:</span>
                      <select 
                        value={cronString}
                        onChange={(e) => setCronString(e.target.value)}
                        className="bg-[#151B2E] text-white border border-[#232D48] px-1.5 py-0.5 rounded text-[10px] focus:outline-none"
                      >
                        <option value="0 18 * * *">02:00 AM Malaysia Time (0 18 * * *)</option>
                        <option value="0 0 * * *">08:00 AM Malaysia Time (0 0 * * *)</option>
                        <option value="0 4 * * *">12:00 PM Malaysia Time (0 4 * * *)</option>
                        <option value="0 10 * * *">06:00 PM Malaysia Time (0 10 * * *)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 p-4 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">
                        This workflow is located in your project at <code className="text-amber-400 font-mono bg-black/30 px-1 py-0.5 rounded">.github/workflows/auto-publish.yml</code>. It schedules Python runs.
                      </p>
                      <button
                        onClick={() => handleCopy(workflowYamlCode, 'yaml')}
                        className="flex items-center gap-1 px-2 py-1 bg-[#1A2333] hover:bg-[#232F47] text-gray-300 rounded text-xs font-mono border border-[#2E3B54] transition-colors"
                      >
                        {copiedText === 'yaml' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* YAML Code Display Block */}
                    <div className="flex-1 bg-[#05070A] border border-[#1E2538] rounded-lg p-3 overflow-y-auto font-mono text-[11px] leading-relaxed text-gray-300">
                      <pre className="select-text">
                        {workflowYamlCode.split('\n').map((line, index) => (
                          <div key={index} className="table-row hover:bg-white/5">
                            <span className="table-cell text-right pr-4 text-gray-600 select-none w-8 font-light border-r border-[#151B2C]">{index + 1}</span>
                            <span className="table-cell pl-4 text-gray-300 whitespace-pre">{line}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Python script layout */}
              {activeTab === 'script' && (
                <motion.div
                  key="script"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <div className="p-3 border-b border-[#1E2538] bg-[#0E121E]/30 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <span>generate.py (Sample Implementation)</span>
                    </div>
                    <button
                      onClick={() => handleCopy(pythonScriptCode, 'python')}
                      className="flex items-center gap-1 px-2 py-0.5 bg-[#1A2333] hover:bg-[#232F47] text-gray-300 rounded text-[10px] font-mono border border-[#2E3B54] transition-colors"
                    >
                      {copiedText === 'python' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText === 'python' ? 'Copied' : 'Copy Python'}</span>
                    </button>
                  </div>

                  <div className="flex-1 p-4 flex flex-col min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div className="p-2.5 bg-blue-500/5 border border-blue-500/20 rounded text-xs space-y-1">
                        <h4 className="font-bold text-blue-400 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> 1. openai Package
                        </h4>
                        <p className="text-gray-400 text-[11px]">
                          Pip installs package requirements (v1.0.0+), which is configured in your project's <code className="bg-black/40 px-1 py-0.2 rounded text-[10px]">requirements.txt</code> automatically.
                        </p>
                      </div>
                      <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded text-xs space-y-1">
                        <h4 className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> 2. OpenAI Key
                        </h4>
                        <p className="text-gray-400 text-[11px]">
                          Reads the API key from environment secrets. Never hardcode keys in python scripts; let GitHub Actions handle injecting it.
                        </p>
                      </div>
                      <div className="p-2.5 bg-purple-500/5 border border-purple-500/20 rounded text-xs space-y-1">
                        <h4 className="font-bold text-purple-400 font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" /> 3. Sitemap injection
                        </h4>
                        <p className="text-gray-400 text-[11px]">
                          Parsed by python to append the URL, change frequencies, and modification dates back into your sitemap before triggering push.
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 bg-[#05070A] border border-[#1E2538] rounded-lg p-3 overflow-y-auto font-mono text-[11px] leading-relaxed text-gray-300">
                      <pre className="select-text">
                        {pythonScriptCode.split('\n').map((line, index) => (
                          <div key={index} className="table-row hover:bg-white/5">
                            <span className="table-cell text-right pr-4 text-gray-600 select-none w-8 font-light border-r border-[#151B2C]">{index + 1}</span>
                            <span className="table-cell pl-4 text-gray-300 whitespace-pre">{line}</span>
                          </div>
                        ))}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Secrets guide panel */}
              {activeTab === 'guide' && (
                <motion.div
                  key="guide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 p-5 overflow-y-auto space-y-5"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      Repository Configuration Instructions
                    </h2>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Follow these simple, crucial security steps in your GitHub repository to link your OpenAI API token securely and grant commit permissions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <div className="bg-[#0C101B] border border-[#1E2538] rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold rounded">STEP 1</span>
                        <span className="text-[10px] font-mono text-gray-500">Required Secret</span>
                      </div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Add OPENAI_API_KEY as Repository Secret
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-normal">
                        To enable article generation via GPT-4, you must configure your OpenAI API Key as an action secret:
                      </p>
                      <ol className="text-[11px] text-gray-500 list-decimal pl-4 space-y-1">
                        <li>Navigate to your repository page on GitHub.</li>
                        <li>Click on <strong className="text-gray-300">Settings</strong> (top tab).</li>
                        <li>In the sidebar under "Security", expand <strong className="text-gray-300">Secrets and variables</strong> and choose <strong className="text-gray-300">Actions</strong>.</li>
                        <li>Click on <strong className="text-blue-400">New repository secret</strong>.</li>
                        <li>Set Name as: <code className="text-amber-400 font-mono bg-black/40 px-1 py-0.2 rounded">OPENAI_API_KEY</code></li>
                        <li>Set Value as your API key (<code className="text-gray-300 font-mono">sk-proj-...</code>).</li>
                      </ol>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-[#0C101B] border border-[#1E2538] rounded-xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold rounded">STEP 2</span>
                        <span className="text-[10px] font-mono text-gray-500">Write Permission</span>
                      </div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Enable Repository Workflow Write Access
                      </h3>
                      <p className="text-[11px] text-gray-400 leading-normal">
                        To allow GitHub Actions to commit and push newly generated HTML files and sitemaps back to your repository automatically:
                      </p>
                      <ol className="text-[11px] text-gray-500 list-decimal pl-4 space-y-1">
                        <li>Go to your repository <strong className="text-gray-300">Settings</strong>.</li>
                        <li>In the left sidebar under "Code and automation", click on <strong className="text-gray-300">Actions</strong> then <strong className="text-gray-300">General</strong>.</li>
                        <li>Scroll down to the bottom section called <strong className="text-gray-300">Workflow permissions</strong>.</li>
                        <li>Change selection from "Read repository contents..." to <strong className="text-emerald-400">Read and write permissions</strong>.</li>
                        <li>Click <strong className="text-gray-300">Save</strong>.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Frequently Asked Question Info banner */}
                  <div className="p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono">Why keep the OpenAI API Key in secrets instead of code?</h4>
                      <p className="text-[11px] text-gray-400 leading-normal mt-1">
                        Pushing keys publicly is insecure and will trigger standard automated safety revocations by OpenAI. Storing it as a GitHub Secret blocks third-parties from inspecting your token, while dynamically injecting it as an environment variable (via <code className="text-amber-400 font-mono bg-black/40 px-1 py-0.2 rounded">env: OPENAI_API_KEY: ${"{"}${"{"} secrets.OPENAI_API_KEY {"}"}${"}"}</code>) specifically inside your runner container shell only.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>

        {/* System footer panel */}
        <footer className="h-9 px-4 border-t border-[#1E2538] bg-[#0E121E] flex items-center justify-between text-[10px] text-gray-500 shrink-0 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5 text-gray-500" />
              <span>Latest Commit Hash:</span>
              <span className="text-gray-300">a8f4c2d</span>
            </span>
            <span className="hidden sm:inline">
              Branch: <span className="text-gray-300">main</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-gray-400">GitHub Actions Agent Operational</span>
            </span>
            <span className="hidden md:inline">V1.2.4-STABLE</span>
          </div>
        </footer>

      </div>
      <Analytics />
    </div>
  );
}
