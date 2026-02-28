import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../hooks/useSettings";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SettingContainer } from "../ui/SettingContainer";
import type { SymbolMapping } from "@/bindings";

interface SymbolMappingsProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const SymbolMappings: React.FC<SymbolMappingsProps> = React.memo(
  ({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();
    const [newPhrase, setNewPhrase] = useState("");
    const [newSymbol, setNewSymbol] = useState("");
    const symbolMappings: SymbolMapping[] = getSetting("symbol_mappings") || [];

    const handleAdd = () => {
      const trimmedPhrase = newPhrase.trim().toLowerCase();
      const trimmedSymbol = newSymbol.trim();
      if (
        trimmedPhrase &&
        trimmedSymbol &&
        trimmedPhrase.length <= 50 &&
        trimmedSymbol.length <= 10 &&
        !symbolMappings.some(
          (m) => m.phrase.toLowerCase() === trimmedPhrase,
        )
      ) {
        updateSetting("symbol_mappings", [
          ...symbolMappings,
          { phrase: trimmedPhrase, symbol: trimmedSymbol },
        ]);
        setNewPhrase("");
        setNewSymbol("");
      }
    };

    const handleRemove = (phraseToRemove: string) => {
      updateSetting(
        "symbol_mappings",
        symbolMappings.filter((m) => m.phrase !== phraseToRemove),
      );
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    };

    return (
      <>
        <SettingContainer
          title={t("settings.advanced.symbolMappings.title")}
          description={t("settings.advanced.symbolMappings.description")}
          descriptionMode={descriptionMode}
          grouped={grouped}
        >
          <div className="flex items-center gap-2">
            <Input
              type="text"
              className="max-w-32"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t(
                "settings.advanced.symbolMappings.phrasePlaceholder",
              )}
              variant="compact"
              disabled={isUpdating("symbol_mappings")}
            />
            <span className="text-secondary-text">→</span>
            <Input
              type="text"
              className="max-w-16"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t(
                "settings.advanced.symbolMappings.symbolPlaceholder",
              )}
              variant="compact"
              disabled={isUpdating("symbol_mappings")}
            />
            <Button
              onClick={handleAdd}
              disabled={
                !newPhrase.trim() ||
                !newSymbol.trim() ||
                newPhrase.trim().length > 50 ||
                newSymbol.trim().length > 10 ||
                isUpdating("symbol_mappings")
              }
              variant="primary"
              size="md"
            >
              {t("settings.advanced.symbolMappings.add")}
            </Button>
          </div>
        </SettingContainer>
        {symbolMappings.length > 0 && (
          <div
            className={`px-4 p-2 ${grouped ? "" : "rounded-lg border border-mid-gray/20"} flex flex-wrap gap-1`}
          >
            {symbolMappings.map((mapping) => (
              <Button
                key={mapping.phrase}
                onClick={() => handleRemove(mapping.phrase)}
                disabled={isUpdating("symbol_mappings")}
                variant="secondary"
                size="sm"
                className="inline-flex items-center gap-1 cursor-pointer"
                aria-label={t(
                  "settings.advanced.symbolMappings.remove",
                  { phrase: mapping.phrase },
                )}
              >
                <span>
                  {mapping.phrase} → {mapping.symbol}
                </span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            ))}
          </div>
        )}
      </>
    );
  },
);
