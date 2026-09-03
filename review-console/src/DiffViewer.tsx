/**
 * Diff Viewer — compare two versions of mastery/evidence data
 *
 * Used by teachers to review changes in student data over time.
 */

import type { JSX } from 'react';

export interface DiffItem {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changeType: 'added' | 'removed' | 'changed';
}

export interface DiffRecord {
  recordId: string;
  studentId: string;
  skillId: string;
  timestamp: string;
  diffs: DiffItem[];
}

export interface DiffViewerProps {
  diff: DiffRecord;
  onClose: () => void;
}

export function DiffViewer(props: DiffViewerProps): JSX.Element {
  const addedCount = props.diff.diffs.filter((d) => d.changeType === 'added').length;
  const removedCount = props.diff.diffs.filter((d) => d.changeType === 'removed').length;
  const changedCount = props.diff.diffs.filter((d) => d.changeType === 'changed').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">So sánh thay đổi</h2>
            <p className="text-sm text-gray-500">
              {props.diff.skillId} • {new Date(props.diff.timestamp).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={props.onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="p-4 bg-gray-50 border-b flex gap-4 text-sm">
          {addedCount > 0 && (
            <span className="text-green-600">+{addedCount} mới</span>
          )}
          {removedCount > 0 && (
            <span className="text-red-600">-{removedCount} xóa</span>
          )}
          {changedCount > 0 && (
            <span className="text-blue-600">~{changedCount} thay đổi</span>
          )}
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {props.diff.diffs.map((diff, i) => (
            <DiffLine key={i} diff={diff} />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={props.onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function DiffLine(props: { diff: DiffItem }): JSX.Element {
  const { diff } = props;

  const bgColor =
    diff.changeType === 'added'
      ? 'bg-green-50'
      : diff.changeType === 'removed'
        ? 'bg-red-50'
        : 'bg-blue-50';

  const borderColor =
    diff.changeType === 'added'
      ? 'border-l-green-500'
      : diff.changeType === 'removed'
        ? 'border-l-red-500'
        : 'border-l-blue-500';

  const icon =
    diff.changeType === 'added'
      ? '+'
      : diff.changeType === 'removed'
        ? '-'
        : '~';

  const iconColor =
    diff.changeType === 'added'
      ? 'text-green-600'
      : diff.changeType === 'removed'
        ? 'text-red-600'
        : 'text-blue-600';

  return (
    <div className={`flex border-l-4 ${borderColor} ${bgColor} p-3 mb-2 rounded-r`}>
      <span className={`font-bold w-6 ${iconColor}`}>{icon}</span>
      <div className="flex-1">
        <div className="font-medium text-sm">{diff.field}</div>
        {diff.changeType === 'changed' ? (
          <div className="flex gap-4 mt-1">
            <span className="text-red-600 text-sm line-through">
              {String(diff.oldValue)}
            </span>
            <span className="text-gray-400">→</span>
            <span className="text-green-600 text-sm">
              {String(diff.newValue)}
            </span>
          </div>
        ) : diff.changeType === 'added' ? (
          <div className="text-green-600 text-sm mt-1">
            {String(diff.newValue)}
          </div>
        ) : (
          <div className="text-red-600 text-sm mt-1">
            {String(diff.oldValue)}
          </div>
        )}
      </div>
    </div>
  );
}
