# WEB TASTE PROFILE CONTRACT V1
*Schema and Type Contract for Brand and Experience Taste Profiles*

**Classification**: `CANONICAL_CONTRACT`  
**Contract ID**: `ABX-CONTRACT-WEB-TASTE-PROFILE-V1`  
**Owning Domain**: `YOD // Visual Intelligence`

---

## 1. Overview

A `TasteProfile` is a machine-readable, versioned specification that defines the aesthetic, typographic, material, interaction, and spatial criteria for a web experience.

YOD Visual Intelligence evaluates and selects Taste Profiles to compile downstream `DesignIntent` specifications for ABRAXAS public surfaces or external client brand experiences without code duplication or aesthetic dilution.

---

## 2. JSON Schema Specification

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "TasteProfile",
  "type": "object",
  "required": [
    "tasteProfileId",
    "version",
    "scope",
    "principles",
    "compositionPreferences",
    "typographyPreferences",
    "colorBehavior",
    "materialBehavior",
    "motionBehavior",
    "interactionBehavior",
    "mediaRouting",
    "spatialBehavior",
    "informationDensity",
    "luxuryVsUtilityBalance",
    "restraintRules",
    "antiPatterns",
    "performanceRequirements",
    "accessibilityRequirements"
  ],
  "properties": {
    "tasteProfileId": { "type": "string" },
    "version": { "type": "integer", "minimum": 1 },
    "scope": { "type": "string", "enum": ["GLOBAL_ABRAXAS", "CLIENT_BRAND", "PROJECT_SPECIFIC"] },
    "referenceSources": {
      "type": "array",
      "items": { "type": "string" }
    },
    "principles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "compositionPreferences": {
      "type": "object",
      "required": ["heroStyle", "negativeSpaceRatio", "maxContentWidth", "gridType"],
      "properties": {
        "heroStyle": { "type": "string" },
        "negativeSpaceRatio": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "maxContentWidth": { "type": "string" },
        "gridType": { "type": "string" }
      }
    },
    "typographyPreferences": {
      "type": "object",
      "required": ["headlineFont", "bodyFont", "monoFont", "scaleRatio"],
      "properties": {
        "headlineFont": { "type": "string" },
        "bodyFont": { "type": "string" },
        "monoFont": { "type": "string" },
        "scaleRatio": { "type": "number" }
      }
    },
    "colorBehavior": {
      "type": "object",
      "required": ["backgroundMode", "dominantRatio", "accentStrategy"],
      "properties": {
        "backgroundMode": { "type": "string", "enum": ["DARK_VOID", "LIGHT_EDITORIAL", "DYNAMIC_ADAPTIVE"] },
        "dominantRatio": { "type": "string" },
        "accentStrategy": { "type": "string" }
      }
    },
    "materialBehavior": {
      "type": "object",
      "required": ["pbrEnabled", "fresnelHighlighting", "surfaceFinishes"],
      "properties": {
        "pbrEnabled": { "type": "boolean" },
        "fresnelHighlighting": { "type": "boolean" },
        "surfaceFinishes": { "type": "array", "items": { "type": "string" } }
      }
    },
    "motionBehavior": {
      "type": "object",
      "required": ["cameraChoreography", "scrollTriggerEcosystem", "reducedMotionSnap"],
      "properties": {
        "cameraChoreography": { "type": "string" },
        "scrollTriggerEcosystem": { "type": "string" },
        "reducedMotionSnap": { "type": "boolean" }
      }
    },
    "interactionBehavior": {
      "type": "object",
      "required": ["pointerEventsRouting", "raycastSelection", "keyboardAccessibility"],
      "properties": {
        "pointerEventsRouting": { "type": "string" },
        "raycastSelection": { "type": "boolean" },
        "keyboardAccessibility": { "type": "boolean" }
      }
    },
    "mediaRouting": {
      "type": "object",
      "required": ["threeJsStrategy", "svgFallbackStrategy", "scrollVideoSupport"],
      "properties": {
        "threeJsStrategy": { "type": "string" },
        "svgFallbackStrategy": { "type": "string" },
        "scrollVideoSupport": { "type": "string" }
      }
    },
    "spatialBehavior": {
      "type": "object",
      "required": ["masterSymbols", "worldPlanetIntegration", "viewportsSupported"],
      "properties": {
        "masterSymbols": { "type": "array", "items": { "type": "string" } },
        "worldPlanetIntegration": { "type": "boolean" },
        "viewportsSupported": { "type": "array", "items": { "type": "string" } }
      }
    },
    "informationDensity": {
      "type": "string",
      "enum": ["SPARSE_MONUMENTAL", "EDITORIAL_BALANCED", "FORENSIC_HIGH_DENSITY"]
    },
    "luxuryVsUtilityBalance": {
      "type": "string"
    },
    "restraintRules": {
      "type": "array",
      "items": { "type": "string" }
    },
    "antiPatterns": {
      "type": "array",
      "items": { "type": "string" }
    },
    "performanceRequirements": {
      "type": "object",
      "required": ["dprCaps", "visibilityLoopPause", "resourceDisposal"],
      "properties": {
        "dprCaps": { "type": "object" },
        "visibilityLoopPause": { "type": "boolean" },
        "resourceDisposal": { "type": "boolean" }
      }
    },
    "accessibilityRequirements": {
      "type": "object",
      "required": ["wcagTarget", "ariaLandmarks", "instantReducedMotion"],
      "properties": {
        "wcagTarget": { "type": "string" },
        "ariaLandmarks": { "type": "boolean" },
        "instantReducedMotion": { "type": "boolean" }
      }
    },
    "allowedVariation": { "type": "string" },
    "forbiddenLiteralCopying": {
      "type": "array",
      "items": { "type": "string" }
    },
    "clientOverrides": { "type": "object" }
  }
}
```

