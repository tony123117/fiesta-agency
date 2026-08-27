import type { RichTextContent, RichTextInline, RichTextNode } from '@/lib/types';

export function RichText({ content, className }: { content: RichTextContent | null; className?: string }) {
  if (!content || !Array.isArray(content) || content.length === 0) return null;
  return (
    <div className={className}>
      {content.map((node, i) => <RichTextNodeView key={i} node={node} />)}
    </div>
  );
}

function RichTextNodeView({ node }: { node: RichTextNode }) {
  switch (node.type) {
    case 'paragraph':
      return <p className="mb-4 leading-relaxed">{renderInlines(node.children)}</p>;
    case 'heading':
      if (node.level === 2) {
        return <h2 className="font-serif text-2xl md:text-3xl font-light text-ivory mt-8 mb-4">{renderInlines(node.children)}</h2>;
      }
      return <h3 className="font-serif text-xl md:text-2xl font-light text-ivory mt-6 mb-3">{renderInlines(node.children)}</h3>;
    case 'list':
      const Tag = node.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`mb-4 ${node.ordered ? 'list-decimal' : 'list-none'} space-y-2 pl-0`}>
          {node.items.map((item, i) => (
            <li key={i} className="leading-relaxed flex gap-3">
              {!node.ordered && <span className="text-gold mt-1.5 block w-1.5 h-1.5 bg-gold shrink-0" />}
              <span>{renderInlines(item)}</span>
            </li>
          ))}
        </Tag>
      );
    case 'quote':
      return (
        <blockquote className="border-l-2 border-gold pl-6 my-6 font-serif text-lg italic text-ivory-muted">
          {renderInlines(node.children)}
        </blockquote>
      );
    default:
      return null;
  }
}

function renderInlines(inlines: RichTextInline[]): React.ReactNode {
  return inlines.map((inline, i) => {
    if ('text' in inline) {
      let el: React.ReactNode = inline.text;
      if (inline.italic) el = <em key={i}>{el}</em>;
      if (inline.bold) el = <strong key={i} className="font-semibold text-ivory">{el}</strong>;
      return <span key={i}>{el}</span>;
    }
    if (inline.type === 'link') {
      return (
        <a key={i} href={inline.href} target="_blank" rel="noopener noreferrer"
          className="text-gold link-underline">
          {renderInlines(inline.children)}
        </a>
      );
    }
    return null;
  });
}
