import { PanelRightIcon } from "lucide-react";

export default function Panel(): JSX.Element {
  return (
    <div className="flex items-center">
      <PanelRightIcon />
      <h1>Dev Tools Panel</h1>
    </div>
  );
}
