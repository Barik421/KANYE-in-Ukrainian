import { useId, useState } from 'react';
import type { Annotation } from '../types/content';

interface AnnotationTextProps {
  text: string;
  annotations: Annotation[];
}

interface Segment {
  text: string;
  annotation?: Annotation;
}

function buildSegments(text: string, annotations: Annotation[]): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  const matches = annotations
    .map((annotation) => ({ annotation, index: text.toLocaleLowerCase().indexOf(annotation.phrase.toLocaleLowerCase()) }))
    .filter((match) => match.index >= 0)
    .sort((a, b) => a.index - b.index);

  for (const match of matches) {
    if (match.index < cursor) continue;
    if (match.index > cursor) segments.push({ text: text.slice(cursor, match.index) });
    segments.push({
      text: text.slice(match.index, match.index + match.annotation.phrase.length),
      annotation: match.annotation,
    });
    cursor = match.index + match.annotation.phrase.length;
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments.length > 0 ? segments : [{ text }];
}

export function AnnotationText({ text, annotations }: AnnotationTextProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const segments = buildSegments(text, annotations);

  return (
    <>
      {segments.map((segment, index) => {
        if (!segment.annotation) return <span key={`${segment.text}-${index}`}>{segment.text}</span>;
        const popoverId = `${baseId}-${segment.annotation.id}`;
        const isOpen = openId === segment.annotation.id;

        return (
          <span className="annotation" key={segment.annotation.id}>
            <button
              className="annotation__trigger"
              type="button"
              aria-expanded={isOpen}
              aria-describedby={isOpen ? popoverId : undefined}
              onClick={() => setOpenId(isOpen ? null : segment.annotation!.id)}
              onBlur={(event) => {
                if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                  setOpenId(null);
                }
              }}
            >
              {segment.text}
            </button>
            {isOpen ? (
              <span className="annotation__popover" id={popoverId} role="note" tabIndex={-1}>
                {segment.annotation.explanation}
              </span>
            ) : null}
          </span>
        );
      })}
    </>
  );
}
