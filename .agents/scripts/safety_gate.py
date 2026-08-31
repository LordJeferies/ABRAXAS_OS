#!/usr/bin/env python3
import json
import re
import sys

raw_input = ""
try:
    raw_input = sys.stdin.read()
except Exception:
    pass

payload = {}
if raw_input.strip():
    try:
        payload = json.loads(raw_input)
    except Exception:
        pass

def extract_cmd(obj):
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        for k in ["CommandLine", "commandLine", "command", "cmd", "CommandLineString"]:
            if k in obj and isinstance(obj[k], str):
                return obj[k]
        for v in obj.values():
            found = extract_cmd(v)
            if found:
                return found
    if isinstance(obj, list):
        for item in obj:
            found = extract_cmd(item)
            if found:
                return found
    return ""

cmd = extract_cmd(payload)

# 1. BLOCKED (DENY) - Dangerous / Destructive / Out-of-Scope Operations
blocked_patterns = [
    r"\bgit\s+commit\b",
    r"\bgit\s+push\b",
    r"\bgit\s+add\b",
    r"\bgit\s+reset\s+--hard\b",
    r"\bgit\s+clean\b",
    r"\bgit\s+checkout\s+--\s+\.",
    r"\bgit\s+restore\b[^\n]*\s+\.(?:\s|$)",
    r"\bgit\s+restore\s+--staged\b",
    r"\bgit\s+(?:merge|rebase|cherry-pick)\b",
    r"\bgit\s+branch\s+-D\b",
    r"\bgit\s+stash\s+(?:drop|clear)\b",
    r"\brm\s+",
    r"\brmdir\s+",
    r"\bmv\s+",
    r"\bsudo\b",
    r"\bchmod\s+-R\b",
    r"\bbrew\s+(?:install|uninstall|upgrade)\b",
    r"\b(?:pnpm|npm|yarn|pip|pip3|cargo)\s+(?:install|add|remove|uninstall|update|upgrade)\b",
    r"\bdocker\s+(?:run|build|pull|push|compose)\b",
    r"\bollama\s+(?:serve|pull|run)\b",
]

# 2. ASK (FORCE_ASK) - Remote Git Network Synchronization
ask_patterns = [
    r"\bgit\s+fetch\b",
    r"\bgit\s+pull\b",
    r"\bgit\s+clone\b",
    r"\bgit\s+submodule\s+update\b",
    r"\bgit\s+remote\s+set-url\b",
]

for pattern in blocked_patterns:
    if re.search(pattern, cmd):
        print(json.dumps({
            "decision": "deny",
            "reason": "ABRAXAS safety policy: This destructive, mutating, or out-of-scope command is blocked."
        }))
        raise SystemExit(0)

for pattern in ask_patterns:
    if re.search(pattern, cmd):
        print(json.dumps({
            "decision": "force_ask",
            "reason": "ABRAXAS safety policy: Network Git synchronization requires explicit user authorization."
        }))
        raise SystemExit(0)

# 3. ALLOW - Default for read, audit, python, test, build, and diagnostic commands
print(json.dumps({
    "decision": "allow",
    "reason": "ABRAXAS safety policy: Local read, audit, test, build, and diagnostic commands are automatically allowed."
}))
