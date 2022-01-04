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

  let isInCode = false;
  text.split('\n').forEach(line => {
    if (line.startsWith('```')) {
      isInCode = !isInCode;
    }
    const headingSharpsArr = line.match(/^#{1,6}\s/g);
    if (!headingSharpsArr || isInCode) {
      return
    }
    const level = headingSharpsArr[0].trim().length;
    const content = line.substring(level + 1);

    // build catalog node tree
    if (level === 1) {
      catalogRoot.text = content;
    } else {
      curNode = new CatalogNode(level, content, [], ++headCount[level]);
      while (lastNode.level >= level && lastNode.parent) {
        lastNode = lastNode.parent;
      }
      lastNode.children.push(curNode);
      curNode.parent = lastNode;
      lastNode = curNode;
    }
  });

  return preorderTraverse(catalogRoot);
}

export { CatalogNode, getHeadingInfo };
