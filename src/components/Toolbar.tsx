import React from 'react'
import type { ToolbarProps, DrawingTool } from '../types'

const tools: { id: DrawingTool; icon: string; label: string }[] = [
  { id: 'pen', icon: '✏️', label: 'Pen' },
  { id: 'brush', icon: '🖌️', label: 'Brush' },
  { id: 'eraser', icon: '🧹', label: 'Eraser' },
  { id: 'select', icon: '👆', label: 'Select' },
  { id: 'text', icon: '📝', label: 'Text' }
]

const colors = [
  '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'
]

const strokeSizes = [2, 4, 8, 12, 20]

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  activeColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}) => {
  return (
    <div className="canvas-toolbar">
      <div className="toolbar-section tools">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => onToolChange(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section colors">
        {colors.map(color => (
          <button
            key={color}
            className={`color-btn ${activeColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section stroke-sizes">
        {strokeSizes.map(size => (
          <button
            key={size}
            className={`size-btn ${strokeWidth === size ? 'active' : ''}`}
            onClick={() => onStrokeWidthChange(size)}
            title={`${size}px`}
          >
            <span 
              className="size-preview" 
              style={{ 
                width: Math.min(size, 16), 
                height: Math.min(size, 16),
                backgroundColor: activeColor 
              }} 
            />
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <div className="toolbar-section actions">
        <button 
          className="action-btn" 
          onClick={onUndo} 
          disabled={!canUndo}
          title="Undo"
        >
          ↩️
        </button>
        <button 
          className="action-btn" 
          onClick={onRedo} 
          disabled={!canRedo}
          title="Redo"
        >
          ↪️
        </button>
        <button 
          className="action-btn danger" 
          onClick={onClear}
          title="Clear canvas"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default Toolbar
