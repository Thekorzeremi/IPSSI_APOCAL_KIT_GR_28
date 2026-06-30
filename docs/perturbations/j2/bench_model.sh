#!/usr/bin/env bash
# Benchmark Gemma 3 4B via Ollama — Windows / Git Bash
# Cas d'usage : génération de QCM JSON depuis un texte de cours

set -euo pipefail

MODEL="gemma3:4b"
N_RUNS=5
BASE_DIR="$(dirname "$0")"
RESULTS_FILE="$BASE_DIR/benchmark_results.txt"
OUTPUT_DIR="$BASE_DIR/runs"
TIMEOUT_S=300

mkdir -p "$OUTPUT_DIR"
> "$RESULTS_FILE"

PROMPT='Tu es un assistant pédagogique. Génère exactement 3 questions QCM sur le cours suivant, en JSON strict uniquement.
Format attendu :
{"questions": [{"prompt": "...", "options": ["...","...","...","..."], "correct_index": 0}]}

COURS :
Le modèle OSI comprend 7 couches. La couche réseau utilise les adresses IP pour router les paquets.
La couche transport gère TCP, fiable, avec une connexion en 3 étapes SYN/SYN-ACK/ACK.
UDP est sans connexion et plus rapide.
La couche liaison utilise les adresses MAC.
La couche physique gère la transmission des bits sur le support physique.

GÉNÈRE LE JSON MAINTENANT :'

PROMPT_JSON=$(py -c "import json,sys; print(json.dumps(sys.stdin.read()))" <<< "$PROMPT")

echo "=== Benchmark Gemma 3 4B ==="
echo "Modèle    : $MODEL"
echo "Runs      : $N_RUNS"
echo "Date      : $(date '+%Y-%m-%d %H:%M:%S')"
echo "Machine   : DESKTOP-OPIH76J"
echo "CPU       : AMD Ryzen 7 7435HS — 16 threads"
echo "RAM       : à compléter"
echo "GPU       : NVIDIA RTX 4060 Laptop"
echo "======================================="

for i in $(seq 1 "$N_RUNS"); do
    echo -n "Run $i/$N_RUNS ... "

    START=$(date +%s%3N)

    RESP=$(curl -s --max-time "$TIMEOUT_S" http://localhost:11434/api/generate \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"$MODEL\",\"prompt\":$PROMPT_JSON,\"stream\":false}" 2>/dev/null)

    END=$(date +%s%3N)
    WALL_MS=$((END - START))

    EVAL_MS=$(echo "$RESP" | py -c "import json,sys; d=json.load(sys.stdin); print(int(d.get('eval_duration',0)/1e6))" 2>/dev/null || echo "$WALL_MS")
    RAW=$(echo "$RESP" | py -c "import json,sys; d=json.load(sys.stdin); print(d.get('response',''))" 2>/dev/null || echo "")
    TOKENS=$(echo "$RESP" | py -c "import json,sys; d=json.load(sys.stdin); print(d.get('eval_count',0))" 2>/dev/null || echo "0")

    echo "$RAW" > "$OUTPUT_DIR/run_${i}.txt"

    JSON_STATUS=$(RAW_FILE="$OUTPUT_DIR/run_${i}.txt" py - <<'PYEOF'
import json
import os
import re

path = os.environ["RAW_FILE"]

with open(path, "r", encoding="utf-8") as f:
    raw = f.read()

match = re.search(r"\{.*\}", raw, re.DOTALL)

if not match:
    print("NO_JSON")
else:
    try:
        data = json.loads(match.group())
        questions = data.get("questions", [])
        valid = (
            len(questions) >= 2
            and all(
                "prompt" in q
                and "options" in q
                and "correct_index" in q
                for q in questions
            )
        )
        print("JSON_OK" if valid else "JSON_STRUCT_ERR")
    except Exception:
        print("JSON_PARSE_ERR")
PYEOF
)

    echo "${EVAL_MS}ms (wall: ${WALL_MS}ms) — ${TOKENS} tokens — $JSON_STATUS"
    echo "$EVAL_MS" >> "$RESULTS_FILE"
done

echo ""
echo "=== Métriques finales ==="

RESULTS_PATH="$RESULTS_FILE" py - <<'PYEOF'
import os
import statistics

path = os.environ["RESULTS_PATH"]

with open(path, "r", encoding="utf-8") as f:
    vals = [int(line.strip()) for line in f if line.strip()]

vals_sorted = sorted(vals)
n = len(vals_sorted)

median = statistics.median(vals_sorted)
mean = statistics.mean(vals_sorted)

# Pour 5 runs, on prend la valeur max comme approximation prudente du p95
p95 = vals_sorted[-1]

print(f"Runs      : {n}")
print(f"Min       : {min(vals_sorted)} ms ({min(vals_sorted)/1000:.1f}s)")
print(f"Max       : {max(vals_sorted)} ms ({max(vals_sorted)/1000:.1f}s)")
print(f"Moyenne   : {mean:.0f} ms ({mean/1000:.1f}s)")
print(f"Médiane   : {median:.0f} ms ({median/1000:.1f}s)  ← métrique principale")
print(f"P95       : {p95} ms ({p95/1000:.1f}s)         ← pire cas observé")
print(f"Valeurs   : {vals_sorted}")
PYEOF

echo ""
echo "Réponses brutes : $OUTPUT_DIR/"