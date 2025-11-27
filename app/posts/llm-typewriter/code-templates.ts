export const commonStyles = /* css */`
    body {
        margin: 0;
    }

    .plain-output {
        font-family: monospace;
        white-space: pre;
        padding: 12px 16px;
    }

    .markdown-output {
        h1 {
            font-size: 20px;
            margin: 8px 0;
        }
        p,
        li,
        strong {
            font-size: 14px;
        }
        padding: 0 16px;
    }

    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
