/**
 * Review Queue — teacher review interface for student evidence
 *
 * Shows students whose evidence needs review (flagged items, interventions).
 */

import type { JSX } from 'react';

export interface QueueItem {
  studentId: string;
  studentName: string;
  itemId: string;
  itemContent: string;
  response: number;
  flaggedReason: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ReviewQueueProps {
  items: QueueItem[];
  onApprove: (itemId: string) => void;
  onFlag: (itemId: string, reason: string) => void;
  onDismiss: (itemId: string) => void;
}

export function ReviewQueue(props: ReviewQueueProps): JSX.Element {
  const sortedItems = [...props.items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (props.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <span className="text-4xl mb-4 block">✅</span>
        <h2 className="text-xl font-semibold text-gray-800">Hàng đợi trống</h2>
        <p className="text-gray-600 mt-2">
          Không có mục nào cần xem xét.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Hàng đợi xem xét ({props.items.length} mục)
        </h2>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
            Ưu tiên cao: {props.items.filter((i) => i.priority === 'high').length}
          </span>
        </div>
      </div>

      {sortedItems.map((item) => (
        <ReviewItemCard
          key={`${item.studentId}-${item.itemId}-${item.timestamp}`}
          item={item}
          onApprove={() => props.onApprove(`${item.studentId}-${item.itemId}`)}
          onFlag={(reason) => props.onFlag(`${item.studentId}-${item.itemId}`, reason)}
          onDismiss={() => props.onDismiss(`${item.studentId}-${item.itemId}`)}
        />
      ))}
    </div>
  );
}

function ReviewItemCard(props: {
  item: QueueItem;
  onApprove: () => void;
  onFlag: (reason: string) => void;
  onDismiss: () => void;
}): JSX.Element {
  const [showFlagForm, setShowFlagForm] = React.useState(false);
  const [flagReason, setFlagReason] = React.useState('');

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-blue-500',
  };

  return (
    <div
      className={`bg-white border rounded-lg p-4 border-l-4 ${priorityColors[props.item.priority]}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium">{props.item.studentName}</div>
          <div className="text-sm text-gray-500">
            {new Date(props.item.timestamp).toLocaleString('vi-VN')}
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            props.item.priority === 'high'
              ? 'bg-red-100 text-red-700'
              : props.item.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-blue-100 text-blue-700'
          }`}
        >
          {props.item.priority === 'high'
            ? 'Cao'
            : props.item.priority === 'medium'
              ? 'TB'
              : 'Thấp'}
        </span>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-3">
        <div className="text-sm text-gray-600 mb-1">Câu hỏi:</div>
        <div className="font-medium">{props.item.itemContent}</div>
        <div className="mt-2 text-sm">
          <span className="text-gray-600">Trả lời: </span>
          <span
            className={`font-semibold ${
              props.item.response === 1 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {props.item.response === 1 ? 'Đúng' : 'Sai'}
          </span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
        <span className="text-yellow-800 text-sm">{props.item.flaggedReason}</span>
      </div>

      {showFlagForm ? (
        <div className="mb-3">
          <textarea
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Nhập lý do..."
            className="w-full border rounded p-2 text-sm mb-2"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                props.onFlag(flagReason);
                setShowFlagForm(false);
                setFlagReason('');
              }}
              disabled={!flagReason.trim()}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
            >
              Gửi
            </button>
            <button
              onClick={() => setShowFlagForm(false)}
              className="px-3 py-1 border rounded text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={props.onApprove}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            ✅ Xác nhận
          </button>
          <button
            onClick={() => setShowFlagForm(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 text-sm"
          >
            🚩 Báo cáo
          </button>
          <button
            onClick={props.onDismiss}
            className="px-4 py-2 border rounded hover:bg-gray-50 text-sm ml-auto"
          >
            Bỏ qua
          </button>
        </div>
      )}
    </div>
  );
}

// Need React import for useState
import React from 'react';
