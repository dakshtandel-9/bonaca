/** A single quick fact about the property (e.g. "3 Bedrooms"). */
export interface PropertyHighlight {
  id: string;
  /** Short headline fact. */
  label: string;
  /** One-line supporting detail. */
  description: string;
}

/** Core, reusable descriptive details of the property. */
export interface Property {
  name: string;
  /** Short descriptor, e.g. "Private villa". */
  type: string;
  /** Human-readable location line. */
  locality: string;
  /** Single-sentence positioning line. */
  tagline: string;
  /** Paragraphs used by the overview and story sections. */
  intro: string[];
}
