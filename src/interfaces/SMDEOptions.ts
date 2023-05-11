export interface SMDEOptions {
  spellChecker: boolean;
  maxHeight: string;
  autofocus: boolean;
  placeholder: string;
  status: boolean;
  autosave?: {
    enabled: boolean;
    delay: number;
    uniqueId?: string;
  } | undefined;
}