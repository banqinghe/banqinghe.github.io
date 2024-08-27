/**
 * https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/composables/outline.ts
 */

export interface MenuItem {
    element: HTMLElement;
    link: string;
    children?: MenuItem[];
}

export interface Header {
    element: HTMLHeadElement;
    title: string;
    link: string;
    level: number;
    children?: MenuItem[];
}

export function getHeaders() {
    const headers: Header[] = [
        ...document.querySelectorAll('.prose :where(h1,h2,h3,h4)'),
    ]
        .filter(el => el.id && el.hasChildNodes())
        .map(el => {
            const level = Number(el.tagName[1]);
            return {
                element: el as HTMLHeadElement,
                title: serializeHeader(el),
                link: '#' + el.id,
                level,
            };
        });

    return resolveHeaders(headers);
}

function serializeHeader(h: Element): string {
    let ret = '';
    for (const node of h.childNodes) {
        if (node.nodeType === 1 || node.nodeType === 3) {
            ret += node.textContent;
        }
    }
    return ret.trim();
}

export function resolveHeaders(headers: Header[]) {
    const resolvedHeaders = [];
    for (const { element, link } of headers) {
        resolvedHeaders.push({ element, link });
    }

    const ret: MenuItem[] = [];
    outer: for (let i = 0; i < headers.length; i++) {
        const cur = headers[i];
        if (i === 0) {
            ret.push(cur);
        } else {
            for (let j = i - 1; j >= 0; j--) {
                const prev = headers[j];
                if (prev.level < cur.level) {
                    (prev.children || (prev.children = [])).push(cur);
                    continue outer;
                }
            }
            ret.push(cur);
        }
    }

    return ret;
}
