export default function Footer() {
    return (
        <footer className="w-[640px] max-w-[90%] flex justify-between pt-16 pb-16 mx-auto text-xs md:text-sm text-gray-400">
            <div>
                <abbr
                    className="cursor-help decoration-dotted"
                    title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
                >
                    CC BY-NC 4.0
                </abbr>
                <time dateTime={new Date().getFullYear().toString()} className="mx-2">2019-PRESENT</time>
                © Ban Qinghe.
            </div>
            <a className="text-gray-600 hover:text-gray-400" href="https://github.com/banqinghe/banqinghe.github.io/">GitHub</a>
        </footer>
    );
}
