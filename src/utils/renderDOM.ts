import { Block } from '@/core/block.ts';

export function render(selector: string, block: Block) {
  const root = document.querySelector(selector);
  const content = block.getContent();

  if (content) {
    root?.appendChild(content);
  }

  block.dispatchComponentDidMount();

  return root;
}
