class CatalogNode {
  level: number;
  text: string;
  children: Array<CatalogNode>;
  index: number;
  parent: CatalogNode | null;

  constructor(level: number, text: string, children: Array<CatalogNode>, index?: number, parent?: CatalogNode) {
    this.level = level;
    this.text = text;
    this.children = children;
    this.parent = parent || null;
    this.index = index ?? -1;
  }
}

function preorderTraverse(root: CatalogNode): Array<CatalogNode> {
  const seq: Array<CatalogNode> = [];
  
  const recurse = (node: CatalogNode) => {
    seq.push(node);
    node.children.forEach(child => {
      recurse(child);
    });
  };

  recurse(root);
  return seq;
}

function getHeadingInfo(text: string) {
  const catalogRoot = new CatalogNode(1, '', [], 1);
  let lastNode = catalogRoot;
  let curNode: CatalogNode;

  const headCount = new Array(7).fill(0);

  const line = [];
  for (let i = 0, len = text.length; i < len; i++) {
    if (text[i] === '\n') {
      // When get a line of text, determine whether it starts with 1-6 '#'
      // FIXME: Unable to distinguish '#' from the code text
      const lineChars = line.join('');
      for (let level = 6; level > 0; level--) {
        if (lineChars.startsWith(Array.from({ length: level }).fill('#').join('') + ' ')) {
          const content = lineChars.substring(level + 1).trim();
          if (level === 1 && !catalogRoot.text) {
            catalogRoot.text = content;
          } else if (level > 1) {
            curNode = new CatalogNode(level, content, [], ++headCount[level]);

            while (lastNode.level >= level) {
              lastNode = lastNode.parent as CatalogNode;
            }
            lastNode.children.push(curNode);
            curNode.parent = lastNode;
            lastNode = curNode;
          }
          break;
        }
      }

      line.length = 0;
      continue;
    }
    line.push(text[i]);
  }

  return preorderTraverse(catalogRoot);
}

export { CatalogNode, getHeadingInfo };
