'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface TypingAnimationProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
  className?: string;
  enableMarkdown?: boolean; // New prop to enable/disable markdown rendering
}

export function TypingAnimation({ 
  text, 
  speed = 15, 
  onComplete, 
  className = "",
  enableMarkdown = true
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || typeof text !== 'string') return;

    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= text.length) {
          setIsComplete(true);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  useEffect(() => {
    if (typeof text === 'string') {
      setDisplayedText(text.slice(0, currentIndex));
    }
  }, [currentIndex, text]);

  if (!text || typeof text !== 'string') {
    return <div className={className}>No content to display</div>;
  }

  // If markdown is disabled, render as plain text
  if (!enableMarkdown) {
    return (
      <div className={className}>
        <span className="whitespace-pre-wrap">{displayedText}</span>
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5" />
        )}
      </div>
    );
  }

  // Render with markdown support
  return (
    <div className={className}>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom components for better styling
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-foreground mb-3 mt-5 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-semibold text-foreground mb-2 mt-3 first:mt-0">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-foreground mb-3 leading-relaxed">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-foreground mb-3 space-y-1 ml-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-foreground mb-3 space-y-1 ml-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-foreground leading-relaxed">
                {children}
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-foreground">
                {children}
              </em>
            ),
            code: ({ children, className }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                );
              }
              return (
                <code className={className}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="bg-muted border border-border rounded-lg p-4 mb-3 overflow-x-auto">
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground mb-3">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline"
              >
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-3">
                <table className="min-w-full border border-border rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-muted">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody>
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-border last:border-b-0">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2 text-left font-semibold text-foreground">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2 text-foreground">
                {children}
              </td>
            ),
            hr: () => (
              <hr className="border-border my-4" />
            ),
          }}
        >
          {displayedText}
        </ReactMarkdown>
      </div>
      {!isComplete && (
        <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5" />
      )}
    </div>
  );
}
