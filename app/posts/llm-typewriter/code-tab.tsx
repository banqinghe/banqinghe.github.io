import { Tabs } from '@base-ui-components/react/tabs';

export interface CodeTabProps {
    tabs: Array<{
        label: string;
        code: string;
    }>;
}

export default function CodeTab({ tabs }: CodeTabProps) {
    return (
        <Tabs.Root className="w-full mt-2 border border-gray-100">
            <Tabs.List className="border-b border-gray-100 bg-gray-50">
                {tabs.map((tab, index) => (
                    <Tabs.Tab
                        key={tab.label}
                        value={index}
                        className="text-sm px-4 py-2 relative border-r border-gray-100 data-[active]:bg-white data-[active]:after:content-[''] data-[active]:after:absolute data-[active]:after:left-0 data-[active]:after:right-0 data-[active]:after:bottom-[-1px] data-[active]:after:h-[3px] data-[active]:after:bg-white data-[active]:after:z-10"
                    >
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            {tabs.map((tab, index) => (
                <Tabs.Panel
                    key={tab.label}
                    className="overflow-auto max-h-[400px] p-4 font-mono text-sm"
                    value={index}
                    dangerouslySetInnerHTML={{ __html: tab.code }}
                />
            ))}
        </Tabs.Root>
    );
}
