// src/components/ui.js
// Headless UI primitives in plain JS (no JSX) to avoid .jsx requirement
import React from "react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className = "", children }) {
  return React.createElement(
    "div",
    { className: cx("bg-white ring-1 ring-gray-200 rounded-lg", className) },
    children
  );
}

export function CardHeader({ title, subtitle, actions }) {
  return React.createElement(
    "div",
    { className: "p-4 border-b border-gray-200 flex items-center justify-between gap-4" },
    React.createElement(
      "div",
      null,
      title && React.createElement("h2", { className: "text-base font-semibold text-gray-900" }, title),
      subtitle && React.createElement("p", { className: "mt-0.5 text-sm text-gray-600" }, subtitle)
    ),
    actions || null
  );
}

export function CardBody({ children, className = "p-4" }) {
  return React.createElement("div", { className }, children);
}

export function Button({ variant = "solid", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-semibold px-3 py-2";
  const variants = {
    solid: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-500",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
  };
  return React.createElement("button", { className: cx(base, variants[variant], className), ...props });
}

export function Input({ label, error, className = "", variant = "default", ...props }) {
  const variants = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
    success: "border-green-300 focus:border-green-500 focus:ring-green-500/20",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500/20",
  };

  return React.createElement(
    "label",
    { className: "block" },
    label && React.createElement("span", { className: "text-sm font-medium text-gray-700 mb-1 block" }, label),
    React.createElement("input", {
      className: cx(
        "block w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200",
        "bg-white shadow-sm",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        variants[variant],
        error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
        className
      ),
      ...props,
    }),
    error && React.createElement("span", { className: "mt-1.5 text-xs text-red-600 flex items-center gap-1" },
      React.createElement("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20" },
        React.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" })
      ),
      error
    )
  );
}

export function Select({ label, error, className = "", children, ...props }) {
  return React.createElement(
    "label",
    { className: "block" },
    label && React.createElement("span", { className: "text-sm font-medium text-gray-700 mb-1 block" }, label),
    React.createElement(
      "div",
      { className: "relative" },
      React.createElement(
        "select",
        {
          className: cx(
            "block w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 appearance-none",
            "bg-white shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
            className
          ),
          ...props,
        },
        children
      ),
      React.createElement(
        "div",
        { className: "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" },
        React.createElement(
          "svg",
          { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
          React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
        )
      )
    ),
    error && React.createElement("span", { className: "mt-1.5 text-xs text-red-600 flex items-center gap-1" },
      React.createElement("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20" },
        React.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" })
      ),
      error
    )
  );
}

export function Table({ head = [], rows = [], renderRow, emptyText = "Aucune donnée" }) {
  return React.createElement(
    "div",
    { className: "overflow-x-auto" },
    React.createElement(
      "table",
      { className: "min-w-full divide-y divide-gray-200" },
      React.createElement(
        "thead",
        { className: "bg-gray-50" },
        React.createElement(
          "tr",
          null,
          ...head.map((h, i) =>
            React.createElement(
              "th",
              { key: i, className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" },
              h
            )
          )
        )
      ),
      React.createElement(
        "tbody",
        { className: "bg-white divide-y divide-gray-200" },
        rows && rows.length
          ? rows.map((row) => renderRow(row))
          : React.createElement(
              "tr",
              null,
              React.createElement(
                "td",
                { className: "px-4 py-4 text-sm text-gray-500", colSpan: head.length || 1 },
                emptyText
              )
            )
      )
    )
  );
}

export function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  return React.createElement(
    "div",
    { className: "flex items-center justify-between text-sm text-gray-700" },
    React.createElement("span", null, `Page ${page} / ${totalPages}`),
    React.createElement(
      "div",
      { className: "flex gap-2" },
      React.createElement(Button, { variant: "outline", disabled: page <= 1, onClick: () => onChange(page - 1) }, "Précédent"),
      React.createElement(Button, { variant: "outline", disabled: page >= totalPages, onClick: () => onChange(page + 1) }, "Suivant")
    )
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return React.createElement(
    "div",
    { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" },
    React.createElement(
      "div",
      { className: "w-full max-w-md rounded-lg bg-white ring-1 ring-gray-200" },
      React.createElement(
        "div",
        { className: "flex items-center justify-between p-4 border-b border-gray-200" },
        React.createElement("h3", { className: "text-base font-semibold text-gray-900" }, title),
        React.createElement(
          "button",
          {
            onClick: onClose,
            className: "text-gray-400 hover:text-gray-600 transition-colors"
          },
          React.createElement(
            "svg",
            { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
          )
        )
      ),
      React.createElement("div", { className: "p-4" }, children)
    )
  );
}

export function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return React.createElement(
    "div",
    { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" },
    React.createElement(
      "div",
      { className: "w-full max-w-sm rounded-lg bg-white p-4 ring-1 ring-gray-200" },
      React.createElement("h3", { className: "text-base font-semibold text-gray-900" }, title),
      React.createElement("p", { className: "mt-1 text-sm text-gray-700" }, message),
      React.createElement(
        "div",
        { className: "mt-4 flex justify-end gap-2" },
        React.createElement(Button, { variant: "outline", onClick: onCancel }, "Annuler"),
        React.createElement(Button, { variant: "danger", onClick: onConfirm }, "Confirmer")
      )
    )
  );
}

export function Textarea({ label, error, className = "", rows = 3, ...props }) {
  return React.createElement(
    "label",
    { className: "block" },
    label && React.createElement("span", { className: "text-sm font-medium text-gray-700 mb-1 block" }, label),
    React.createElement("textarea", {
      className: cx(
        "block w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200",
        "bg-white shadow-sm",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        error && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
        className
      ),
      rows,
      ...props,
    }),
    error && React.createElement("span", { className: "mt-1.5 text-xs text-red-600 flex items-center gap-1" },
      React.createElement("svg", { className: "w-3 h-3", fill: "currentColor", viewBox: "0 0 20 20" },
        React.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" })
      ),
      error
    )
  );
}
