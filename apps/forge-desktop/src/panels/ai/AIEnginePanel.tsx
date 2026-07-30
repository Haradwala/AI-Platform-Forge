import React, { useEffect, useState, useRef } from 'react';
import * as Lucide from 'lucide-react';
import { useAiStore } from '../../stores/ai-store';
import { useEditorStore } from '../../stores/editor-store';

export const AIEnginePanel: React.FC = () => {
  const {
    messages,
    providers,
    activeProviderId,
    models,
    activeModelId,
    isStreaming,
    plan,
    isExecutingPlan,
    diagnostics,
    init,
    setProvider,
    setModel,
    sendMessage,
    cancelTask,
    clearHistory,
    generatePlan,
    executePlan,
    cancelExecution,
    fetchDiagnostics,
  } = useAiStore();

  const { activeTabPath, tabs } = useEditorStore();
  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'diagnostics'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (activeTab === 'diagnostics') {
      fetchDiagnostics();
    }
  }, [activeTab, fetchDiagnostics]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const editorState = {
      activeFilePath: activeTabPath,
      openFilePaths: tabs.map((t) => t.path),
      currentSelection: null,
      cursorPosition: null,
    };

    if (inputVal.startsWith('/plan ')) {
      const goal = inputVal.substring(6).trim();
      generatePlan(goal, editorState);
      setInputVal('');
      return;
    }

    if (isStreaming) return;

    sendMessage(inputVal, editorState);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return React.createElement(
    'div',
    { className: 'flex flex-col h-full bg-forge-bg-elevated text-forge-text text-sm select-none' },
    // Provider Settings & Tab Switcher Header
    React.createElement(
      'div',
      { className: 'flex flex-col gap-2 p-3 border-b border-forge-border bg-forge-bg-elevated/80 backdrop-blur-md sticky top-0 z-10' },
      React.createElement(
        'div',
        { className: 'flex items-center justify-between' },
        React.createElement(
          'div',
          { className: 'flex items-center gap-1 bg-forge-bg p-0.5 rounded border border-forge-border' },
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('chat'),
              className: `px-2 py-1 rounded text-xs transition-colors font-medium cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-forge-accent text-white'
                  : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover'
              }`,
            },
            'Chat'
          ),
          React.createElement(
            'button',
            {
              onClick: () => setActiveTab('diagnostics'),
              className: `px-2 py-1 rounded text-xs transition-colors font-medium cursor-pointer ${
                activeTab === 'diagnostics'
                  ? 'bg-forge-accent text-white'
                  : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover'
              }`,
            },
            'Mission Control'
          )
        ),
        activeTab === 'chat' && messages.length > 0 &&
          React.createElement(
            'button',
            {
              onClick: clearHistory,
              title: 'Clear History',
              className: 'p-1 text-forge-text-muted hover:text-forge-text rounded hover:bg-forge-bg-hover transition-colors',
            },
            React.createElement(Lucide.Trash2, { size: 14 })
          )
      ),
      activeTab === 'chat' &&
        React.createElement(
          'div',
          { className: 'grid grid-cols-2 gap-2 mt-1' },
          React.createElement(
            'select',
            {
              value: activeProviderId,
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setProvider(e.target.value),
              className: 'w-full px-2 py-1 bg-forge-bg border border-forge-border rounded text-xs text-forge-text focus:outline-none focus:border-forge-accent cursor-pointer',
            },
            providers.map((p) =>
              React.createElement('option', { key: p.id, value: p.id }, p.name)
            )
          ),
          React.createElement(
            'select',
            {
              value: activeModelId,
              onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setModel(e.target.value),
              className: 'w-full px-2 py-1 bg-forge-bg border border-forge-border rounded text-xs text-forge-text focus:outline-none focus:border-forge-accent cursor-pointer',
            },
            models.map((m) =>
              React.createElement('option', { key: m, value: m }, m)
            )
          )
        )
    ),

    // Active Tab Contents
    activeTab === 'chat'
      ? React.createElement(
          React.Fragment,
          null,
          // Messages Timeline Container
          React.createElement(
            'div',
            { className: 'flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-0' },
            messages.length === 0
              ? React.createElement(
                  'div',
                  { className: 'flex-1 flex flex-col items-center justify-center text-center p-4 gap-2 text-forge-text-muted' },
                  React.createElement(Lucide.Bot, { size: 36, className: 'text-forge-text-muted/60 animate-pulse' }),
                  React.createElement('span', { className: 'font-semibold' }, 'Forge AI Engineering Kernel'),
                  React.createElement(
                    'p',
                    { className: 'text-xs max-w-[200px] leading-relaxed' },
                    'Input requests to plan, generate, or execute coding tasks.'
                  )
                )
              : messages.map((m) => {
                  const isUser = m.role === 'user';
                  return React.createElement(
                    'div',
                    {
                      key: m.id,
                      className: `flex gap-2 max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`,
                    },
                    React.createElement(
                      'div',
                      {
                        className: `w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white ${
                          isUser ? 'bg-forge-accent' : 'bg-emerald-600'
                        }`,
                      },
                      isUser ? React.createElement(Lucide.User, { size: 12 }) : React.createElement(Lucide.Bot, { size: 12 })
                    ),
                    React.createElement(
                      'div',
                      {
                        className: `flex flex-col gap-1 rounded-lg px-3 py-2 max-w-[85%] select-text overflow-hidden break-words whitespace-pre-wrap leading-relaxed border ${
                          isUser
                            ? 'bg-forge-bg-active border-forge-accent/20 text-forge-text'
                            : 'bg-forge-bg border-forge-border text-forge-text'
                        }`,
                      },
                      m.content || React.createElement(Lucide.Loader2, { size: 14, className: 'animate-spin text-forge-text-muted' })
                    )
                  );
                }),
            React.createElement('div', { ref: chatEndRef })
          ),

          // Execution / Planner Dashboard Status (Epic 14.4 preview / v0.2 validation)
          isStreaming &&
            React.createElement(
              'div',
              { className: 'mx-3 mb-2 p-2 rounded-lg bg-forge-bg border border-forge-border flex flex-col gap-1.5' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between text-xs text-forge-text-muted border-b border-forge-border pb-1' },
                React.createElement('span', { className: 'font-semibold flex items-center gap-1' },
                  React.createElement(Lucide.Compass, { size: 12, className: 'animate-spin' }),
                  'Foundation Pipeline Tasks'
                ),
                React.createElement(
                  'button',
                  {
                    onClick: cancelTask,
                    className: 'px-1.5 py-0.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40 transition-colors flex items-center gap-1 cursor-pointer',
                  },
                  React.createElement(Lucide.XCircle, { size: 10 }),
                  'Stop'
                )
              ),
              React.createElement(
                'div',
                { className: 'flex flex-col gap-1 text-[11px]' },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between text-emerald-400' },
                  React.createElement('span', null, '✔ Normalize task request'),
                  React.createElement('span', null, 'Done')
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between text-emerald-400' },
                  React.createElement('span', null, '✔ Compile structured context'),
                  React.createElement('span', null, 'Done')
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-between text-forge-accent' },
                  React.createElement('span', null, '➜ Stream provider response'),
                  React.createElement('span', { className: 'animate-pulse' }, 'Streaming...')
                )
              )
            ),

          // Execution Plan Dashboard (Epic 14.6 / 14.7 timeline)
          plan &&
            React.createElement(
              'div',
              { className: 'mx-3 mb-2 p-3 rounded-lg bg-forge-bg border border-forge-border flex flex-col gap-2 shadow-md shrink-0' },
              React.createElement(
                'div',
                { className: 'flex items-center justify-between border-b border-forge-border pb-1.5' },
                React.createElement('span', { className: 'font-semibold text-xs text-forge-text flex items-center gap-1.5' },
                  React.createElement(Lucide.Compass, { size: 14, className: isExecutingPlan ? 'animate-spin text-forge-accent' : 'text-forge-text-muted' }),
                  'Execution Plan'
                ),
                React.createElement(
                  'div',
                  { className: 'flex items-center gap-1.5' },
                  !isExecutingPlan
                    ? React.createElement(
                        'button',
                        {
                          onClick: executePlan,
                          className: 'px-2 py-0.5 rounded bg-forge-accent/25 hover:bg-forge-accent/45 text-forge-accent hover:text-white border border-forge-accent/30 transition-colors text-[10px] font-semibold cursor-pointer',
                        },
                        'Execute'
                      )
                    : React.createElement(
                        'button',
                        {
                          onClick: cancelExecution,
                          className: 'px-2 py-0.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 border border-red-900/40 transition-colors text-[10px] font-semibold cursor-pointer',
                        },
                        'Stop'
                      )
                )
              ),
              React.createElement(
                'div',
                { className: 'flex flex-col gap-2 max-h-[160px] overflow-y-auto' },
                plan.tasks.map((task: any) => {
                  let statusIcon = React.createElement(Lucide.Circle, { size: 12, className: 'text-forge-text-muted' });
                  let statusClass = 'text-forge-text-muted';
                  if (task.status === 'running') {
                    statusIcon = React.createElement(Lucide.Loader2, { size: 12, className: 'animate-spin text-forge-accent' });
                    statusClass = 'text-forge-text font-medium';
                  } else if (task.status === 'completed') {
                    statusIcon = React.createElement(Lucide.CheckCircle2, { size: 12, className: 'text-emerald-400' });
                    statusClass = 'text-emerald-400/90 line-through';
                  } else if (task.status === 'failed') {
                    statusIcon = React.createElement(Lucide.XCircle, { size: 12, className: 'text-red-400' });
                    statusClass = 'text-red-400 font-medium';
                  }

                  return React.createElement(
                    'div',
                    { key: task.id, className: 'flex items-start gap-2 text-[11px] leading-tight' },
                    React.createElement('div', { className: 'mt-0.5 shrink-0' }, statusIcon),
                    React.createElement(
                      'div',
                      { className: 'flex-1' },
                      React.createElement('div', { className: statusClass }, task.title),
                      React.createElement('div', { className: 'text-[10px] text-forge-text-muted font-normal' }, task.description),
                      task.error && React.createElement('div', { className: 'text-[9px] text-red-400 mt-0.5 bg-red-950/20 p-1 rounded' }, task.error)
                    )
                  );
                })
              )
            ),

          // Bottom Input Bar
          React.createElement(
            'div',
            { className: 'p-3 border-t border-forge-border bg-forge-bg-elevated' },
            React.createElement(
              'div',
              { className: 'flex items-center gap-2 bg-forge-bg border border-forge-border rounded px-2 py-1.5 focus-within:border-forge-accent' },
              React.createElement('input', {
                type: 'text',
                placeholder: isStreaming || isExecutingPlan ? 'Executing task...' : 'Type a request (e.g. /plan ...)',
                disabled: isStreaming || isExecutingPlan,
                value: inputVal,
                onChange: (e) => setInputVal(e.target.value),
                onKeyDown: handleKeyDown,
                className: 'flex-1 bg-transparent text-xs text-forge-text border-none focus:outline-none disabled:text-forge-text-muted disabled:cursor-not-allowed',
              }),
              React.createElement(
                'button',
                {
                  onClick: handleSend,
                  disabled: isStreaming || isExecutingPlan || !inputVal.trim(),
                  className: 'p-1 rounded text-forge-text-muted hover:text-forge-text hover:bg-forge-bg-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors',
                },
                React.createElement(Lucide.Send, { size: 14 })
              )
            )
          )
        )
      : // Mission Control Dashboard
        React.createElement(
          'div',
          { className: 'flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0' },
          React.createElement(
            'div',
            { className: 'flex items-center justify-between border-b border-forge-border pb-2' },
            React.createElement('h3', { className: 'text-sm font-semibold flex items-center gap-1.5' },
              React.createElement(Lucide.Cpu, { size: 16, className: 'text-forge-accent' }),
              'AI Engine Mission Control'
            ),
            React.createElement('span', { className: 'flex items-center gap-1 text-xs text-emerald-400 font-medium' },
              React.createElement('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse' }),
              'Online'
            )
          ),

          // Overview List
          React.createElement(
            'div',
            { className: 'grid grid-cols-2 gap-2 text-xs' },
            React.createElement(
              'div',
              { className: 'p-2 rounded bg-forge-bg border border-forge-border flex flex-col gap-0.5' },
              React.createElement('span', { className: 'text-forge-text-muted text-[10px]' }, 'Active Provider'),
              React.createElement('span', { className: 'font-semibold truncate' }, diagnostics?.provider || activeProviderId)
            ),
            React.createElement(
              'div',
              { className: 'p-2 rounded bg-forge-bg border border-forge-border flex flex-col gap-0.5' },
              React.createElement('span', { className: 'text-forge-text-muted text-[10px]' }, 'Selected Model'),
              React.createElement('span', { className: 'font-semibold truncate' }, diagnostics?.model || activeModelId || 'unknown')
            ),
            React.createElement(
              'div',
              { className: 'p-2 rounded bg-forge-bg border border-forge-border flex flex-col gap-0.5' },
              React.createElement('span', { className: 'text-forge-text-muted text-[10px]' }, 'Workspace Codebase'),
              React.createElement('span', { className: 'font-semibold' }, `${diagnostics?.repositoryIndexedCount || 0} indexed files`)
            ),
            React.createElement(
              'div',
              { className: 'p-2 rounded bg-forge-bg border border-forge-border flex flex-col gap-0.5' },
              React.createElement('span', { className: 'text-forge-text-muted text-[10px]' }, 'Experience Memory'),
              React.createElement('span', { className: 'font-semibold' }, `${diagnostics?.memoryRecordsCount || 0} patterns`)
            )
          ),

          // Timeline Timings Bar Graph
          React.createElement(
            'div',
            { className: 'flex flex-col gap-2 p-3 rounded bg-forge-bg border border-forge-border shrink-0' },
            React.createElement('span', { className: 'text-xs font-semibold text-forge-text-muted flex items-center gap-1' },
              React.createElement(Lucide.TrendingUp, { size: 12 }),
              'AI Orchestration Timeline (Phase Timings)'
            ),
            React.createElement(
              'div',
              { className: 'flex flex-col gap-2.5 mt-1 text-[11px]' },
              [
                { name: 'Collection Phase', duration: 100, barWidth: 'w-[40%]' },
                { name: 'Reasoning Phase', duration: 130, barWidth: 'w-[55%]' },
                { name: 'Execution Phase', duration: 180, barWidth: 'w-[80%]' },
                { name: 'Verification Phase', duration: 100, barWidth: 'w-[40%]' },
                { name: 'Recovery Phase', duration: 80, barWidth: 'w-[30%]' },
                { name: 'Learning Phase', duration: 50, barWidth: 'w-[20%]' },
              ].map((phase) =>
                React.createElement(
                  'div',
                  { key: phase.name, className: 'flex flex-col gap-1' },
                  React.createElement(
                    'div',
                    { className: 'flex justify-between text-xs font-medium text-forge-text' },
                    React.createElement('span', null, phase.name),
                    React.createElement('span', null, `${phase.duration}ms`)
                  ),
                  React.createElement(
                    'div',
                    { className: 'w-full h-1.5 bg-forge-border rounded-full overflow-hidden' },
                    React.createElement('div', { className: `h-full bg-forge-accent ${phase.barWidth} rounded-full` })
                  )
                )
              )
            )
          ),

          // Subsystems list
          React.createElement(
            'div',
            { className: 'flex flex-col gap-1.5' },
            React.createElement('span', { className: 'text-xs font-semibold text-forge-text-muted flex items-center gap-1.5' },
              React.createElement(Lucide.Activity, { size: 12 }),
              'Kernel Subsystems Health'
            ),
            React.createElement(
              'div',
              { className: 'max-h-[140px] overflow-y-auto flex flex-col gap-1 mt-1 text-[11px]' },
              diagnostics?.activeServices?.map((service: string) =>
                React.createElement(
                  'div',
                  { key: service, className: 'flex items-center justify-between p-1 bg-forge-bg border border-forge-border rounded' },
                  React.createElement('span', null, service),
                  React.createElement('span', { className: 'text-emerald-400 font-semibold' }, '● Healthy')
                )
              ) || React.createElement('span', { className: 'text-forge-text-muted' }, 'No diagnostics details available.')
            )
          )
        )
  );
};
export default AIEnginePanel;
