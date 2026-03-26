'use client';

import { useState } from 'react';
import Link from 'next/link';
import storyData from '@/content/story.json';
import { useChecklist } from '@/hooks/useChecklist';

interface Objective {
  task: string;
  hint: string;
  spoiler: string;
}

interface Blocker {
  problem: string;
  solution: string;
}

interface Chapter {
  id: string;
  chapter: number;
  title: string;
  summary: string;
  objectives: Objective[];
  commonBlockers: Blocker[];
  rewards: string[];
  nextChapter: string | null;
}

const chapters = storyData as Chapter[];

const totalObjectives = chapters.reduce(
  (sum, ch) => sum + ch.objectives.length,
  0
);

export default function StoryPage() {
  const { isChecked, toggleCheck, getProgress } = useChecklist();
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    chapters[0]?.id ?? null
  );
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(
    new Set()
  );
  const [expandedBlockers, setExpandedBlockers] = useState<Set<string>>(
    new Set()
  );

  const progress = getProgress('story', totalObjectives);

  const toggleSpoiler = (key: string) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleBlocker = (key: string) => {
    setExpandedBlockers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Story Guide</span>
      </nav>

      {/* Page Header */}
      <div className="page-header">
        <h1>Story Guide</h1>
        <p>Follow the tale of Pokopia chapter by chapter</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-header">
          <span>Overall Progress</span>
          <span>
            {progress.checked} / {progress.total} objectives ({progress.percent}
            %)
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Chapters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {chapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          const chapterProgress = getProgress(
            'story',
            totalObjectives
          );

          return (
            <div key={chapter.id} className={`expandable ${isExpanded ? 'expandable-open' : ''}`}>
              <button
                className="expandable-header"
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className="expandable-chevron">▶</span>
                <span>
                  Chapter {chapter.chapter}: {chapter.title}
                </span>
              </button>

              <div className="expandable-content">
                {/* Summary */}
                <p className="card-desc" style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                  {chapter.summary}
                </p>

                {/* Objectives Checklist */}
                <h4 style={{ marginBottom: '0.75rem' }}>Objectives</h4>
                <div style={{ marginBottom: '1.5rem' }}>
                  {chapter.objectives.map((obj, objIdx) => {
                    const objKey = `${chapter.id}-obj-${objIdx}`;
                    const checked = isChecked('story', objKey);
                    const spoilerRevealed = revealedSpoilers.has(objKey);

                    return (
                      <div key={objKey}>
                        <div className="checklist-item">
                          <button
                            className={`checklist-checkbox ${checked ? 'checked' : ''}`}
                            onClick={() => toggleCheck('story', objKey)}
                          >
                            {checked ? '✓' : ''}
                          </button>
                          <div style={{ flex: 1 }}>
                            <span className={`checklist-label ${checked ? 'checked' : ''}`}>
                              {obj.task}
                            </span>
                            <p
                              className="card-desc"
                              style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}
                            >
                              Hint: {obj.hint}
                            </p>
                          </div>
                        </div>

                        {/* Spoiler Block */}
                        <div
                          className={`spoiler ${spoilerRevealed ? 'spoiler-revealed' : 'spoiler-hidden'}`}
                          onClick={() => toggleSpoiler(objKey)}
                          style={{ marginTop: '0.5rem', marginBottom: '0.75rem', marginLeft: '2.25rem' }}
                        >
                          <div className="spoiler-content">
                            <p style={{ fontSize: '0.9rem' }}>{obj.spoiler}</p>
                          </div>
                          {!spoilerRevealed && (
                            <div className="spoiler-overlay">
                              Click to reveal spoiler
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Common Blockers */}
                {chapter.commonBlockers.length > 0 && (
                  <>
                    <h4 style={{ marginBottom: '0.75rem' }}>Common Blockers</h4>
                    <div style={{ marginBottom: '1.5rem' }}>
                      {chapter.commonBlockers.map((blocker, bIdx) => {
                        const blockerKey = `${chapter.id}-blocker-${bIdx}`;
                        const blockerExpanded = expandedBlockers.has(blockerKey);

                        return (
                          <div
                            key={blockerKey}
                            className={`expandable ${blockerExpanded ? 'expandable-open' : ''}`}
                          >
                            <button
                              className="expandable-header"
                              onClick={() => toggleBlocker(blockerKey)}
                            >
                              <span className="expandable-chevron">▶</span>
                              <span>{blocker.problem}</span>
                            </button>
                            <div className="expandable-content">
                              <div className="callout callout-tip">
                                <p style={{ fontSize: '0.9rem' }}>{blocker.solution}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Rewards */}
                <h4 style={{ marginBottom: '0.5rem' }}>Rewards</h4>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {chapter.rewards.map((reward) => (
                    <span key={reward} className="badge badge-yellow">
                      {reward}
                    </span>
                  ))}
                </div>

                {/* Next Chapter Navigation */}
                {chapter.nextChapter && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => toggleChapter(chapter.nextChapter!)}
                  >
                    Next: Chapter {chapter.chapter + 1} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
