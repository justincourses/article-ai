'use client'

import { useState } from 'react'
import { useWriterConfig } from '../../store/writerConfig'

export default function WriterConfigPanel() {
  const {
    config,
    setFontSize,
    setFontFamily,
    setTheme,
    setLineSpacing,
    toggleAutoSave,
    toggleSpellCheck,
    toggleWordCount,
    toggleFocusMode,
    resetConfig
  } = useWriterConfig()

  const [newFontSize, setNewFontSize] = useState(config.fontSize)

  const fontFamilies = ['Inter', 'Roboto', 'Merriweather', 'Courier New', 'Arial']

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Writer Configuration</h2>

      <div className="space-y-4">
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font Size: {config.fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="24"
            value={newFontSize}
            onChange={(e) => setNewFontSize(Number(e.target.value))}
            onMouseUp={() => setFontSize(newFontSize)}
            className="w-full mt-1"
          />
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Font Family
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <div className="mt-2 space-x-2">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`px-3 py-1 rounded ${
                  config.theme === themeOption
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Line Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Line Spacing: {config.lineSpacing}
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={config.lineSpacing}
            onChange={(e) => setLineSpacing(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        {/* Toggle Options */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="autoSave"
              type="checkbox"
              checked={config.autoSave}
              onChange={toggleAutoSave}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-900">
              Auto Save
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="spellCheck"
              type="checkbox"
              checked={config.spellCheck}
              onChange={toggleSpellCheck}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="spellCheck" className="ml-2 block text-sm text-gray-900">
              Spell Check
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="wordCount"
              type="checkbox"
              checked={config.wordCount}
              onChange={toggleWordCount}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="wordCount" className="ml-2 block text-sm text-gray-900">
              Show Word Count
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="focusMode"
              type="checkbox"
              checked={config.focusMode}
              onChange={toggleFocusMode}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="focusMode" className="ml-2 block text-sm text-gray-900">
              Focus Mode
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            onClick={resetConfig}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}
