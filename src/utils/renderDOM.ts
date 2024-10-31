import { Component } from '@/core/component.ts';

export function render(selector: string, component: Component) {
  const root = document.querySelector(selector);
  const content = component.getContent();

  if (content && root) {
    root.innerHTML = '';
    root?.appendChild(content);
  }

  component.dispatchComponentDidMount();

  return root;
}
