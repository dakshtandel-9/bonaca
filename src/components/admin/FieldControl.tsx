"use client";

import { useId, useState } from "react";

import ImageField from "@/components/admin/ImageField";
import { moveItem, uniqueId } from "@/lib/cms/path";
import type { Field } from "@/lib/cms/schema";

/**
 * One schema field, drawn.
 *
 * `value` and `onChange` are deliberately untyped: the editor holds the whole
 * site as plain JSON and the schema is what says how a given leaf behaves, so
 * this component stays the single place that maps a `kind` to a control.
 */
export default function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = useId();

  const label = (
    <label className="admin-label" htmlFor={id}>
      {field.label}
    </label>
  );

  const help = field.help ? <p className="admin-help">{field.help}</p> : null;

  switch (field.kind) {
    case "text":
    case "url":
      return (
        <div className="admin-field" data-half={field.half ? "" : undefined}>
          {label}
          <input
            id={id}
            className="admin-input"
            type={field.kind === "url" ? "url" : "text"}
            value={typeof value === "string" ? value : ""}
            placeholder={field.placeholder}
            spellCheck={field.kind !== "url"}
            onChange={(event) => onChange(event.target.value)}
          />
          {help}
        </div>
      );

    case "textarea":
      return (
        <div className="admin-field" data-half={field.half ? "" : undefined}>
          {label}
          <textarea
            id={id}
            className="admin-textarea"
            rows={field.rows ?? 3}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
          />
          {help}
        </div>
      );

    case "number":
      return (
        <div className="admin-field" data-half={field.half ? "" : undefined}>
          {label}
          <input
            id={id}
            className="admin-input"
            type="number"
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={typeof value === "number" || typeof value === "string" ? String(value) : ""}
            onChange={(event) => {
              /* Empty means "being cleared", not zero — writing 0 back on the
                 way through would fight the cursor on every keystroke. */
              const raw = event.target.value;
              if (raw === "") return onChange(0);
              const parsed = Number(raw);
              onChange(Number.isFinite(parsed) ? parsed : 0);
            }}
          />
          {help}
        </div>
      );

    case "boolean":
      return (
        <div className="admin-field" data-half={field.half ? "" : undefined}>
          <div className="admin-check">
            <input
              id={id}
              type="checkbox"
              checked={value === true}
              onChange={(event) => onChange(event.target.checked)}
            />
            <label htmlFor={id}>{field.label}</label>
          </div>
          {help}
        </div>
      );

    case "select":
      return (
        <div className="admin-field" data-half={field.half ? "" : undefined}>
          {label}
          <select
            id={id}
            className="admin-select"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );

    case "image":
      return (
        <div className="admin-field">
          {label}
          <ImageField
            id={id}
            value={typeof value === "string" ? value : ""}
            onChange={onChange}
          />
          {help}
        </div>
      );

    case "stringList":
      return (
        <StringListControl
          field={field}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );

    case "objectList":
      return (
        <ObjectListControl
          field={field}
          value={Array.isArray(value) ? (value as Record<string, unknown>[]) : []}
          onChange={onChange}
        />
      );
  }
}

/* ------------------------------------------------------------ string list */

function StringListControl({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "stringList" }>;
  value: string[];
  onChange: (next: unknown) => void;
}) {
  const update = (index: number, next: string) =>
    onChange(value.map((item, i) => (i === index ? next : item)));

  return (
    <div className="admin-field">
      <span className="admin-label">{field.label}</span>

      {value.length === 0 ? (
        <p className="admin-empty">Nothing here yet.</p>
      ) : (
        <div className="admin-list">
          {value.map((item, index) => (
            <div className="admin-list-row" key={index}>
              {field.multiline ? (
                <textarea
                  className="admin-textarea"
                  rows={3}
                  value={item}
                  aria-label={`${field.itemLabel ?? "Item"} ${index + 1}`}
                  onChange={(event) => update(index, event.target.value)}
                />
              ) : (
                <input
                  className="admin-input"
                  value={item}
                  aria-label={`${field.itemLabel ?? "Item"} ${index + 1}`}
                  onChange={(event) => update(index, event.target.value)}
                />
              )}

              <div className="admin-row-tools">
                <button
                  type="button"
                  className="admin-btn"
                  data-size="sm"
                  data-variant="ghost"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => onChange(moveItem(value, index, index - 1))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  data-size="sm"
                  data-variant="ghost"
                  aria-label="Move down"
                  disabled={index === value.length - 1}
                  onClick={() => onChange(moveItem(value, index, index + 1))}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  data-size="sm"
                  data-variant="danger"
                  aria-label="Remove"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-list-foot">
        <button
          type="button"
          className="admin-btn"
          data-size="sm"
          onClick={() => onChange([...value, ""])}
        >
          Add {(field.itemLabel ?? "item").toLowerCase()}
        </button>
      </div>

      {field.help ? <p className="admin-help">{field.help}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------ object list */

function ObjectListControl({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: "objectList" }>;
  value: Record<string, unknown>[];
  onChange: (next: unknown) => void;
}) {
  /* Rows start collapsed: a nine-item gallery with six fields each is 54
     controls, and only one of them is usually being edited. */
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const setRow = (index: number, next: Record<string, unknown>) =>
    onChange(value.map((item, i) => (i === index ? next : item)));

  const rowTitle = (row: Record<string, unknown>, index: number) => {
    const raw = row[field.titleKey];
    const text = typeof raw === "string" && raw.trim() ? raw.trim() : "";
    return text.length > 64 ? `${text.slice(0, 64)}…` : text || `${field.itemLabel} ${index + 1}`;
  };

  /* The first image-ish field, so a collapsed photo row still shows which
     photograph it is. */
  const thumbKey = field.fields.find((child) => child.kind === "image")?.name;

  function addRow() {
    const template = structuredClone(field.template);

    if (typeof template.id === "string") {
      const taken = value
        .map((row) => row.id)
        .filter((id): id is string => typeof id === "string");
      template.id = uniqueId(template.id, taken);
    }

    onChange([...value, template]);
    setOpenIndex(value.length);
  }

  function removeRow(index: number) {
    if (!window.confirm(`Delete this ${field.itemLabel.toLowerCase()}? This cannot be undone once published.`)) {
      return;
    }
    onChange(value.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  const atMinimum = typeof field.min === "number" && value.length <= field.min;

  return (
    <div className="admin-field">
      <span className="admin-label">{field.label}</span>

      {value.length === 0 ? (
        <p className="admin-empty">
          Nothing here yet — this part of the page will not render.
        </p>
      ) : (
        <div>
          {value.map((row, index) => {
            const open = openIndex === index;
            const thumb = thumbKey ? row[thumbKey] : undefined;

            return (
              <div className="admin-item" key={index} data-open={open ? "" : undefined}>
                <div className="admin-item-head">
                  <button
                    type="button"
                    className="admin-item-toggle"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <span className="admin-item-caret" aria-hidden="true">
                      ▶
                    </span>
                    <span className="admin-item-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {typeof thumb === "string" && thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="admin-item-thumb" src={thumb} alt="" loading="lazy" />
                    ) : null}
                    <span>{rowTitle(row, index)}</span>
                  </button>

                  <div className="admin-row-tools">
                    <button
                      type="button"
                      className="admin-btn"
                      data-size="sm"
                      data-variant="ghost"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => {
                        onChange(moveItem(value, index, index - 1));
                        setOpenIndex(open ? index - 1 : openIndex);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-btn"
                      data-size="sm"
                      data-variant="ghost"
                      aria-label="Move down"
                      disabled={index === value.length - 1}
                      onClick={() => {
                        onChange(moveItem(value, index, index + 1));
                        setOpenIndex(open ? index + 1 : openIndex);
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-btn"
                      data-size="sm"
                      data-variant="danger"
                      aria-label={`Delete ${field.itemLabel.toLowerCase()}`}
                      disabled={atMinimum}
                      title={
                        atMinimum
                          ? `At least ${field.min} needed for this section to render.`
                          : undefined
                      }
                      onClick={() => removeRow(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {open ? (
                  <div className="admin-item-body">
                    <div className="admin-fields">
                      {field.fields.map((child) => (
                        <FieldControl
                          key={child.name}
                          field={child}
                          value={row[child.name]}
                          onChange={(next) => setRow(index, { ...row, [child.name]: next })}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <div className="admin-list-foot">
        <button type="button" className="admin-btn" data-size="sm" onClick={addRow}>
          {field.addLabel}
        </button>
        <span className="admin-help">
          {value.length} {value.length === 1 ? field.itemLabel.toLowerCase() : "items"}
        </span>
      </div>

      {field.help ? <p className="admin-help">{field.help}</p> : null}
    </div>
  );
}
