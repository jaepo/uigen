"use client";

import { Loader2 } from "lucide-react";

interface ToolCallDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  if (toolName === "str_replace_editor") {
    const path = args.path as string | undefined;
    const command = args.command as string | undefined;

    switch (command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
      case "insert":
      case "undo_edit":
        return `Editing ${path}`;
      case "view":
        return `Reading ${path}`;
    }
  }

  if (toolName === "file_manager") {
    const path = args.path as string | undefined;
    const newPath = args.new_path as string | undefined;
    const command = args.command as string | undefined;

    if (command === "rename") return `Renaming ${path} to ${newPath}`;
    if (command === "delete") return `Deleting ${path}`;
  }

  return toolName;
}

export function ToolCallDisplay({ toolName, args, state }: ToolCallDisplayProps) {
  const label = getLabel(toolName, args);
  const done = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
