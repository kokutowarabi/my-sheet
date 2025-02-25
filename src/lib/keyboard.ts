// Enter + Cmd or Enter + Ctrlでフォーカスを外す
// inputを使う時、必ずこの関数を使う
export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    e.currentTarget.blur();
  }
};