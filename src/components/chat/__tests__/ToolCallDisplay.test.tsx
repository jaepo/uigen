import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallDisplay } from "../ToolCallDisplay";

describe("ToolCallDisplay", () => {
  describe("str_replace_editor", () => {
    it("shows 'Creating' for create command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Creating /App.jsx")).toBeTruthy();
    });

    it("shows 'Editing' for str_replace command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "str_replace", path: "/components/Card.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Editing /components/Card.jsx")).toBeTruthy();
    });

    it("shows 'Editing' for insert command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "insert", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Editing /App.jsx")).toBeTruthy();
    });

    it("shows 'Reading' for view command", () => {
      render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "view", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Reading /App.jsx")).toBeTruthy();
    });
  });

  describe("file_manager", () => {
    it("shows rename message with old and new path", () => {
      render(
        <ToolCallDisplay
          toolName="file_manager"
          args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Renaming /old.jsx to /new.jsx")).toBeTruthy();
    });

    it("shows delete message with path", () => {
      render(
        <ToolCallDisplay
          toolName="file_manager"
          args={{ command: "delete", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(screen.getByText("Deleting /App.jsx")).toBeTruthy();
    });
  });

  describe("unknown tool", () => {
    it("falls back to tool name", () => {
      render(
        <ToolCallDisplay
          toolName="some_unknown_tool"
          args={{}}
          state="result"
        />
      );
      expect(screen.getByText("some_unknown_tool")).toBeTruthy();
    });
  });

  describe("loading state", () => {
    it("shows spinner when not done", () => {
      const { container } = render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          state="call"
        />
      );
      expect(container.querySelector(".animate-spin")).toBeTruthy();
    });

    it("shows green dot when done", () => {
      const { container } = render(
        <ToolCallDisplay
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          state="result"
        />
      );
      expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
    });
  });
});
