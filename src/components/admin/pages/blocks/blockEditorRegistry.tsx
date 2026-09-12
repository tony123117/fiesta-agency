import type { BlockType, Block } from '@/lib/blockTypes';
import { HeadingEditor } from './HeadingEditor';
import { TextEditor } from './TextEditor';
import { ImageEditor } from './ImageEditor';
import { ButtonEditor } from './ButtonEditor';
import { SpacerEditor } from './SpacerEditor';

export interface BlockEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  responsive?: Block['responsive'];
  onResponsiveChange?: (r: Block['responsive']) => void;
}

export const blockEditorRegistry: Record<BlockType, React.ComponentType<BlockEditorProps>> = {
  heading: HeadingEditor,
  text: TextEditor,
  image: ImageEditor,
  button: ButtonEditor,
  spacer: SpacerEditor,
};
