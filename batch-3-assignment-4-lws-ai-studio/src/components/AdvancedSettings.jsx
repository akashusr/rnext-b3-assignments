import React from "react";
import CustomSelect from "./CustomSelect";

const AdvancedSettings = ({
  model,
  setModel,
  availableModels,
  modelsLoading,
  seed,
  setSeed,
  width,
  height,
  setDimensions,
  noLogo,
  setNoLogo,
}) => {
  const ratioPresets = {
    "1:1": { width: 1024, height: 1024 },
    "16:9": { width: 1920, height: 1080 },
    "4:3": { width: 1440, height: 1080 },
    "3:2": { width: 1620, height: 1080 },
  };

  const handlePresetClick = (val) => {
    setDimensions(val.width, val.height);
  };

  return (
    <div className="border border-zinc-700/70 mb-6 rounded-lg p-4">
      <h4 className="font-medium mb-4">Advanced Settings</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomSelect
          label="Model"
          options={availableModels}
          value={model}
          onChange={setModel}
          disabled={modelsLoading}
        />

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Seed (Optional)
          </label>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Random"
            className="w-full bg-zinc-900/10 px-3 py-2 border border-zinc-700/70 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Width
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) =>
              setDimensions(
                e.target.value === "" ? "" : Number(e.target.value),
                height,
              )
            }
            className="w-full bg-zinc-900/10 px-3 py-2 border border-zinc-700/70 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Height
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) =>
              setDimensions(
                width,
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full bg-zinc-900/10 px-3 py-2 border border-zinc-700/70 rounded-md text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1">
            Aspect Ratio Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ratioPresets).map(([label, val]) => {
              const isActive = width === val.width && height === val.height;
              return (
                <button
                  key={label}
                  onClick={() => handlePresetClick(val)}
                  className={`px-3 py-2 text-xs rounded transition-colors border font-medium ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-zinc-900/10 text-zinc-300 border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Remove Watermark
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={noLogo}
              onChange={() => setNoLogo(!noLogo)}
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;
