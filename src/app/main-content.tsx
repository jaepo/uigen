"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-[#08080e]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-[#0d0d14]">
                {/* Chat Header */}
                <div className="h-14 flex items-center px-5 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 4h10M2 7h7M2 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-zinc-100 tracking-tight">UIGen</span>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-px bg-white/5 hover:bg-violet-500/30 transition-colors" />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-[#08080e]">
                {/* Top Bar */}
                <div className="h-14 border-b border-white/5 px-5 flex items-center justify-between shrink-0">
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-white/5 border border-white/5 p-0.5 h-8 gap-0.5">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none text-zinc-500 px-4 py-1 text-xs font-medium transition-all rounded-sm">Preview</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-white/10 data-[state=active]:text-zinc-100 data-[state=active]:shadow-none text-zinc-500 px-4 py-1 text-xs font-medium transition-all rounded-sm">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                  {activeView === "preview" ? (
                    <div className="h-full bg-white">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                      {/* File Tree */}
                      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                        <div className="h-full bg-[#0d0d14] border-r border-white/5">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-px bg-white/5 hover:bg-violet-500/30 transition-colors" />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-[#08080e]">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
