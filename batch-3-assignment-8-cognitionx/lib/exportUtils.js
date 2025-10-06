export const exportFormats = {
  JSON: "json",
  MARKDOWN: "markdown",
  TXT: "txt",
  CSV: "csv",
};

export function formatConversationForExport(conversation, messages, format) {
  // Safety checks
  if (!conversation || !conversation.title) {
    throw new Error("Invalid conversation data");
  }
  if (!Array.isArray(messages)) {
    throw new Error("Invalid messages data");
  }

  const timestamp = new Date().toISOString().split("T")[0];
  const safeTitle = String(conversation.title)
    .replace(/[^a-zA-Z0-9\s]/g, "_")
    .replace(/\s+/g, "_");
  const filename = `${safeTitle}_${timestamp}`;

  switch (format) {
    case exportFormats.JSON:
      return {
        content: JSON.stringify(
          {
            conversation,
            messages,
            exportedAt: new Date().toISOString(),
            format: "JSON",
          },
          null,
          2,
        ),
        filename: `${filename}.json`,
        mimeType: "application/json",
      };

    case exportFormats.MARKDOWN:
      let markdown = `# ${conversation.title}\n\n`;
      markdown += `**Model:** ${conversation.model || "Unknown"}\n`;
      markdown += `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n`;
      if (conversation.systemPrompt) {
        markdown += `**System Prompt:** ${conversation.systemPrompt}\n`;
      }
      markdown += `**Exported:** ${new Date().toLocaleString()}\n\n---\n\n`;

      messages.forEach((message, index) => {
        const role = message.role === "user" ? "User" : "Assistant";
        const time = new Date(message.createdAt).toLocaleString();

        markdown += `## ${role} (${time})\n\n`;

        if (message.imageUrl) {
          markdown += `*[Image attached]*\n\n`;
        }

        markdown += `${message.content || ""}\n\n`;

        if (index < messages.length - 1) {
          markdown += `---\n\n`;
        }
      });

      return {
        content: markdown,
        filename: `${filename}.md`,
        mimeType: "text/markdown",
      };

    case exportFormats.TXT:
      let text = `${conversation.title}\n${"=".repeat(conversation.title.length)}\n\n`;
      text += `Model: ${conversation.model || "Unknown"}\n`;
      text += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
      if (conversation.systemPrompt) {
        text += `System Prompt: ${conversation.systemPrompt}\n`;
      }
      text += `Exported: ${new Date().toLocaleString()}\n\n`;

      messages.forEach((message, index) => {
        const role = message.role === "user" ? "USER" : "ASSISTANT";
        const time = new Date(message.createdAt).toLocaleString();

        text += `[${role}] ${time}\n`;

        if (message.imageUrl) {
          text += `[Image attached]\n`;
        }

        text += `${message.content || ""}\n\n`;

        if (index < messages.length - 1) {
          text += `${"-".repeat(50)}\n\n`;
        }
      });

      return {
        content: text,
        filename: `${filename}.txt`,
        mimeType: "text/plain",
      };

    case exportFormats.CSV:
      let csv = "Timestamp,Role,Content,HasImage\n";

      messages.forEach((message) => {
        const timestamp = new Date(message.createdAt).toISOString();
        const role = message.role;
        const content = `"${(message.content || "").replace(/"/g, '""')}"`;
        const hasImage = message.imageUrl ? "true" : "false";

        csv += `${timestamp},${role},${content},${hasImage}\n`;
      });

      return {
        content: csv,
        filename: `${filename}.csv`,
        mimeType: "text/csv",
      };

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
