/**
 * Form Builder Component
 * 表单构建器组件 - 支持拖拽字段、配置验证规则
 */

'use client';

import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'number';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[];
  conditional?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains';
    value: string;
  };
}

interface FormBuilderProps {
  fields: FormField[];
  setFields: (fields: FormField[]) => void;
}

// Field Types available for drag
const fieldTypes: Array<{ type: FormField['type']; label: string; icon: string }> = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'tel', label: 'Phone', icon: '📞' },
  { type: 'number', label: 'Number', icon: '🔢' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'textarea', label: 'Textarea', icon: '📄' },
  { type: 'select', label: 'Dropdown', icon: '📋' },
  { type: 'radio', label: 'Radio Buttons', icon: '🔘' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'file', label: 'File Upload', icon: '📎' },
];

function SortableFieldItem({ field, onEdit, onDelete }: { field: FormField; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="cursor-move" {...attributes} {...listeners}>
            ⋮⋮
          </div>
          <span className="font-semibold">{field.label}</span>
          <span className="text-xs text-gray-500">({field.type})</span>
          {field.required && <span className="text-xs text-red-600">*</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-red-600 hover:text-red-700 font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {field.placeholder && <span>Placeholder: {field.placeholder}</span>}
      </div>
    </div>
  );
}

function FieldEditor({ field, onSave, onCancel }: { field: FormField | null; onSave: (field: FormField) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<FormField>(
    field || {
      id: `field-${Date.now()}`,
      type: 'text',
      label: '',
      name: '',
      required: false,
    }
  );

  const handleSave = () => {
    if (!formData.label.trim() || !formData.name.trim()) {
      toast.error('Please fill in label and name');
      return;
    }

    // Generate name from label if not provided
    if (!formData.name) {
      formData.name = formData.label.toLowerCase().replace(/\s+/g, '_');
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Edit Field</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as FormField['type'] })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {fieldTypes.map((ft) => (
                <option key={ft.type} value={ft.type}>
                  {ft.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Label *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => {
                setFormData({ ...formData, label: e.target.value });
                // Auto-generate name from label
                if (!formData.name || formData.name === formData.label.toLowerCase().replace(/\s+/g, '_')) {
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                  }));
                }
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Used as the field identifier (lowercase, underscores)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
            <input
              type="text"
              value={formData.placeholder || ''}
              onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 text-primary-600"
            />
            <label htmlFor="required" className="ml-2 text-sm text-gray-700">
              Required field
            </label>
          </div>

          {/* Options for select, radio, checkbox */}
          {(formData.type === 'select' || formData.type === 'radio' || formData.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Options (one per line)</label>
              <textarea
                value={formData.options?.join('\n') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    options: e.target.value.split('\n').filter((o) => o.trim()),
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Option 1&#10;Option 2&#10;Option 3"
              />
            </div>
          )}

          {/* Validation Rules */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Validation Rules</h4>
            <div className="space-y-2">
              {formData.type === 'text' || formData.type === 'textarea' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min length"
                      value={formData.validation?.minLength || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: { ...formData.validation, minLength: e.target.value ? parseInt(e.target.value) : undefined },
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Max length"
                      value={formData.validation?.maxLength || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validation: { ...formData.validation, maxLength: e.target.value ? parseInt(e.target.value) : undefined },
                        })
                      }
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pattern (regex)"
                    value={formData.validation?.pattern || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation: { ...formData.validation, pattern: e.target.value || undefined },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </>
              ) : formData.type === 'number' ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min value"
                    value={formData.validation?.min || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation: { ...formData.validation, min: e.target.value ? parseFloat(e.target.value) : undefined },
                      })
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Max value"
                    value={formData.validation?.max || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validation: { ...formData.validation, max: e.target.value ? parseFloat(e.target.value) : undefined },
                      })
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
          >
            Save Field
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormBuilder({ fields, setFields }: FormBuilderProps) {
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [showFieldEditor, setShowFieldEditor] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      name: type.toLowerCase().replace(/\s+/g, '_'),
      required: false,
    };
    setEditingField(newField);
    setShowFieldEditor(true);
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setShowFieldEditor(true);
  };

  const handleSaveField = (field: FormField) => {
    const existingIndex = fields.findIndex((f) => f.id === field.id);
    if (existingIndex >= 0) {
      // Update existing
      setFields([...fields.slice(0, existingIndex), field, ...fields.slice(existingIndex + 1)]);
    } else {
      // Add new
      setFields([...fields, field]);
    }
    setShowFieldEditor(false);
    setEditingField(null);
  };

  const handleDeleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  return (
    <div>
      {/* Field Types Palette */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Add Field</h3>
        <div className="grid grid-cols-5 gap-2">
          {fieldTypes.map((ft) => (
            <button
              key={ft.type}
              onClick={() => handleAddField(ft.type)}
              className="flex flex-col items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <span className="text-2xl">{ft.icon}</span>
              <span className="text-xs text-gray-700">{ft.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fields List */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Fields ({fields.length})</h3>
        {fields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <p>No fields added yet. Click on a field type above to add one.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {fields.map((field) => (
                  <SortableFieldItem
                    key={field.id}
                    field={field}
                    onEdit={() => handleEditField(field)}
                    onDelete={() => handleDeleteField(field.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Field Editor Modal */}
      {showFieldEditor && editingField && (
        <FieldEditor
          field={editingField}
          onSave={handleSaveField}
          onCancel={() => {
            setShowFieldEditor(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
}

