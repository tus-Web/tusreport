'use client';

const CopyClipboardButton = () => {
    const text = "Hello, World!";

    const clickHandler = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error: any) {
            console.error(`CopyClipboardButton Error: ${error}`);
        }
    };

    return (
        <button className="btn m-5" onClick={(e) => clickHandler()}>
            コピー
        </button>
    )
};

export default CopyClipboardButton;