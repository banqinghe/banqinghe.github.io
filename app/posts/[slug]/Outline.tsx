'use client';

import { Fragment, MouseEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { getHeaders, MenuItem } from '@/lib/markdown/outline';

export default function Outline() {
    const [headers, setHeaders] = useState<MenuItem[]>([]);

    useEffect(() => {
        setHeaders(getHeaders());
    }, []);

    if (!headers.length) {
        return false;
    }

    return (
        <nav
            className={cn(
                'fixed left-8 top-24 bottom-16 w-64 min-h-[400px] overflow-auto hidden xl:block',
                { hidden: headers.length === 0 },
            )}
        >
            <OutlineItem headers={headers} />
        </nav>
    );
}

function OutlineItem({ headers, className = '' }: { headers: MenuItem[]; className?: string }) {
    const handleClickLink = ({ target: el }: MouseEvent) => {
        const id = (el as HTMLAnchorElement).href!.split('#')[1];
        const heading = document.getElementById(decodeURIComponent(id));
        heading?.focus({ preventScroll: true });
    };

    const LinkItem = ({ header }: { header: MenuItem }) => (
        <li className="text-slate-500 hover:text-slate-950 transition-colors">
            <a href={header.link} onClick={handleClickLink}>
                {header.element.innerText}
            </a>
        </li>
    );

    return (
        <ul className={cn(className, 'space-y-2')}>
            {headers.map(header => {
                if (header.children?.length) {
                    return (
                        <Fragment key={header.link}>
                            <LinkItem header={header} />
                            <OutlineItem className="pl-6" headers={header.children} />
                        </Fragment>
                    );
                } else {
                    return <LinkItem key={header.link} header={header} />;
                }
            })}
        </ul>
    );
}
