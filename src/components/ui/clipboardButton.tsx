import { Button } from "./button";

export const ClipboardButton = ({ clipboardText, children, ...props } : { clipboardText: string, children: React.ReactNode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(clipboardText);
  };

  return (
    <Button onClick={handleCopy} {...props}>{children}</Button>
  );
};
