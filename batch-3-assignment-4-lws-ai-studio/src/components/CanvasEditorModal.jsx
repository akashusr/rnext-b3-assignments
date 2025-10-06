import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  PencilIcon,
  ChatBubbleBottomCenterTextIcon,
  StarIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// ✅ We define the ToolButton component outside the main component
// so it can have its own hooks (useState, useEffect, useRef).
const ToolButton = ({
  icon,
  label,
  toolName,
  children,
  onClick,
  activeTool,
  setActiveTool,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    // If there's a direct onClick action (like for 'Rotate'), execute it.
    if (onClick) {
      onClick();
      return;
    }

    // Otherwise, handle the popover.
    // If this tool is already active, clicking again closes its popover.
    if (activeTool === toolName && isPopoverOpen) {
      setIsPopoverOpen(false);
    } else {
      // Otherwise, open it and set its position next to the button.
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPopoverPos({ top: rect.top, left: rect.right });
      }
      setIsPopoverOpen(true);
      setActiveTool(toolName); // Tell the parent component this tool is now active.
    }
  };

  // This effect ensures that if another tool is selected, this one's popover closes.
  useEffect(() => {
    if (activeTool !== toolName) {
      setIsPopoverOpen(false);
    }
  }, [activeTool, toolName]);

  return (
    <div className="relative flex flex-col items-center group" ref={buttonRef}>
      <button
        onClick={handleButtonClick}
        className={`p-3 rounded-lg transition-all duration-200 ${
          activeTool === toolName
            ? "bg-purple-600 text-white shadow-lg"
            : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
        }`}
      >
        {icon}
      </button>
      <span className="mt-1 text-xs text-zinc-400">{label}</span>
      {/* ✅ The popover is now positioned with 'fixed' to break out of the sidebar */}
      {isPopoverOpen && children && (
        <div
          className="fixed ml-4 p-4 bg-zinc-800 rounded-lg shadow-xl w-64 z-20"
          style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const CanvasEditorModal = ({ image, onClose }) => {
  const canvasRef = useRef(null);
  const baseImage = useRef(null);
  const [ctx, setCtx] = useState(null);

  const [drawing, setDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ff0000");
  const [lineWidth, setLineWidth] = useState(5);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [textInput, setTextInput] = useState("");
  // ✅ This state is now the single source of truth for which tool is active.
  const [activeTool, setActiveTool] = useState("draw");

  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const emojis = ["🔥", "🌟", "❤️", "😎", "🎨", "👍"];

  const [rotation, setRotation] = useState(0);
  const [filter, setFilter] = useState("none");

  const drawCanvas = useCallback(() => {
    if (!ctx || !baseImage.current) return;
    const canvas = canvasRef.current;
    const img = baseImage.current;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, [ctx, filter, rotation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image?.displayUrl || image?.permanentUrl || "";
    if (!img.src) return;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      context.drawImage(img, 0, 0);
      setCtx(context);
      baseImage.current = img;
      saveState(canvas);
    };
  }, [image]);

  useEffect(() => {
    if (ctx) {
      drawCanvas();
    }
  }, [rotation, filter, ctx, drawCanvas]);

  const saveState = (canvas = canvasRef.current) => {
    const dataUrl = canvas.toDataURL();
    const newHistory = [...history.slice(0, historyIndex + 1), dataUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const restoreState = (dataUrl) => {
    if (!ctx) return;
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    if (activeTool !== "draw" || !ctx) return;
    setDrawing(true);
    const { x, y } = getMousePosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!drawing || activeTool !== "draw" || !ctx) return;
    e.preventDefault();
    const { x, y } = getMousePosition(e);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (drawing) {
      setDrawing(false);
      ctx.closePath();
      saveState();
    }
  };

  const handleCanvasClick = (e) => {
    if (!ctx) return;
    const { x, y } = getMousePosition(e);
    if (activeTool === "text" && textInput.trim()) {
      ctx.fillStyle = strokeColor;
      ctx.font = `${lineWidth * 8}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(textInput, x, y);
      saveState();
    } else if (activeTool === "emoji") {
      ctx.font = `${lineWidth * 12}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(selectedEmoji, x, y);
      saveState();
    }
  };

  const clearCanvas = () => {
    if (!ctx || !baseImage.current) return;
    setRotation(0);
    setFilter("none");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(baseImage.current, 0, 0);
    saveState();
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = `edited-image-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 text-white w-full h-full md:max-w-6xl md:max-h-[90vh] md:rounded-lg shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-2 border-b border-zinc-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-zinc-200 ml-2">
            Canvas Editor
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUturnLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-md hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUturnRightIcon className="w-5 h-5" />
            </button>
            <button
              onClick={downloadImage}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-500 flex items-center gap-2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-zinc-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-grow min-h-0">
          <aside className="w-24 p-4 bg-zinc-800/50 border-r border-zinc-700 flex flex-col">
            <div className="flex-grow overflow-y-auto custom-scrollbar -mr-4 pr-4">
              <div className="flex flex-col items-center gap-6">
                {/* ✅ Each button now receives the activeTool state and the setter function */}
                <ToolButton
                  icon={<PencilIcon className="w-6 h-6" />}
                  label="Draw"
                  toolName="draw"
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                >
                  <div className="space-y-4">
                    <label className="flex flex-col text-sm text-zinc-300">
                      Color
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => setStrokeColor(e.target.value)}
                        className="w-full h-10 p-0 mt-1 border-none rounded cursor-pointer"
                      />
                    </label>
                    <label className="flex flex-col text-sm text-zinc-300">
                      Size ({lineWidth}px)
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        className="w-full mt-1"
                      />
                    </label>
                  </div>
                </ToolButton>

                <ToolButton
                  icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />}
                  label="Text"
                  toolName="text"
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                >
                  <div className="space-y-4">
                    <label className="flex flex-col text-sm text-zinc-300">
                      Text
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text..."
                        className="px-2 py-1 mt-1 rounded bg-zinc-700 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                    <p className="text-xs text-zinc-400">
                      Click on canvas to place text.
                    </p>
                  </div>
                </ToolButton>

                <ToolButton
                  icon={<StarIcon className="w-6 h-6" />}
                  label="Emoji"
                  toolName="emoji"
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                >
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-300">Select Emoji</p>
                    <div className="grid grid-cols-4 gap-2">
                      {emojis.map((em) => (
                        <button
                          key={em}
                          onClick={() => setSelectedEmoji(em)}
                          className={`text-2xl p-1 rounded-md hover:bg-zinc-600 transition ${selectedEmoji === em ? "bg-purple-600 ring-2 ring-purple-400" : "bg-zinc-700"}`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </ToolButton>

                <div className="border-t border-zinc-700 w-full my-2"></div>

                <ToolButton
                  icon={<ArrowPathIcon className="w-6 h-6" />}
                  label="Rotate"
                  toolName="rotate"
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                  onClick={handleRotate}
                />

                <ToolButton
                  icon={<SparklesIcon className="w-6 h-6" />}
                  label="Filters"
                  toolName="filters"
                  activeTool={activeTool}
                  setActiveTool={setActiveTool}
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange("none")}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-700"
                    >
                      None
                    </button>
                    <button
                      onClick={() => handleFilterChange("grayscale(100%)")}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-700"
                    >
                      Grayscale
                    </button>
                    <button
                      onClick={() => handleFilterChange("sepia(100%)")}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-700"
                    >
                      Sepia
                    </button>
                    <button
                      onClick={() => handleFilterChange("invert(100%)")}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-700"
                    >
                      Invert
                    </button>
                  </div>
                </ToolButton>
              </div>
            </div>

            <div className="flex-shrink-0 pt-4 mt-4 border-t border-zinc-700">
              <button
                onClick={clearCanvas}
                className="flex flex-col items-center p-3 rounded-lg text-zinc-300 hover:bg-red-600 hover:text-white transition-colors duration-200 w-full"
              >
                <TrashIcon className="w-6 h-6" />
                <span className="mt-1 text-xs">Clear</span>
              </button>
            </div>
          </aside>

          <main className="flex-grow flex items-center justify-center p-4 bg-zinc-900/50 overflow-auto">
            <canvas
              ref={canvasRef}
              className={`rounded-md shadow-lg object-contain max-w-full max-h-full ${
                activeTool === "draw"
                  ? "cursor-crosshair"
                  : activeTool === "text" && textInput.trim()
                    ? "cursor-text"
                    : activeTool === "emoji"
                      ? "cursor-copy"
                      : "cursor-default"
              }`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onClick={handleCanvasClick}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditorModal;
