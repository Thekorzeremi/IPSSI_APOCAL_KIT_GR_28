#!/usr/bin/env bash
# Benchmark modèle via Ollama — CPU only
set -euo pipefail

MODEL="${1:-mistral:7b-instruct}"
N_RUNS=5
SAFE_NAME=$(echo "$MODEL" | tr ':/' '__')
RESULTS_FILE="$(dirname "$0")/benchmark_results_${SAFE_NAME}.txt"
OUTPUT_DIR="$(dirname "$0")/runs_${SAFE_NAME}"
TIMEOUT_S=300

mkdir -p "$OUTPUT_DIR"
> "$RESULTS_FILE"

PROMPT='Tu es un assistant pédagogique. Génère exactement 3 questions QCM sur le cours suivant, en JSON strict uniquement. Format: {"questions": [{"prompt": "...", "options": ["...","...","...","..."], "correct_index": 0}]}

COURS : Le modèle OSI comprend 7 couches. La couche réseau utilise les adresses IP pour router les paquets. La couche transport gère TCP (fiable, connexion en 3 étapes SYN/SYN-ACK/ACK) et UDP (sans connexion, rapide). La couche liaison utilise les adresses MAC. La couche physique gère la transmission des bits sur le support physique.

GÉNÈRE LE JSON MAINTENANT :'

PROMPT_JSON=$(python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' <<< "$PROMPT")

echo "=== Benchmark $MODEL ==="
echo "Modèle    : $MODEL"
echo "Runs      : $N_RUNS"
echo "Date      : $(date '+%Y-%m-%d %H:%M:%S')"
echo "Machine   : $(uname -n)"
echo "CPU       : $(sysctl -n hw.ncpu) cœurs — $(sysctl -n machdep.cpu.brand_string)"
echo "RAM       : $(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 )) Go"
echo "GPU       : Aucun GPU dédié"
echo "======================================="

declare -a TIMES=()

for i in $(seq 1 $N_RUNS); do
    echo -n "Run $i/$N_RUNS ... "

    START=$(python3 -c 'import time; print(int(time.time()*1000))')

    RESP=$(curl -s --max-time "$TIMEOUT_S" http://localhost:11434/api/generate \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"$MODEL\",\"prompt\":$PROMPT_JSON,\"stream\":false}" 2>/dev/null)

    END=$(python3 -c 'import time; print(int(time.time()*1000))')
    WALL_MS=$((END - START))

    EVAL_MS=$(echo "$RESP" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(int(d.get("eval_duration",0)/1e6))' 2>/dev/null || echo "$WALL_MS")

    RAW=$(echo "$RESP" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("response",""))' 2>/dev/null || echo "")
    TOKENS=$(echo "$RESP" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("eval_count",0))' 2>/dev/null || echo "0")

    # Écriture de la réponse brute dans un fichier
    echo "$RAW" > "$OUTPUT_DIR/run_${i}.txt"

    # ✅ FIX : lecture depuis le fichier au lieu de la variable bash (évite les bugs avec quotes/backslashes/newlines)
    JSON_STATUS=$(python3 - "$OUTPUT_DIR/run_${i}.txt" <<'PYEOF'
import json, sys, re

with open(sys.argv[1]) as f:
    raw = f.read()

match = re.search(r'\{.*\}', raw, re.DOTALL)
if match:
    try:
        d = json.loads(match.group())
        q = d.get('questions', [])
        if len(q) >= 2 and all('prompt' in x and 'options' in x and 'correct_index' in x for x in q):
            print('JSON_OK')
        else:
            print('JSON_STRUCT_ERR')
    except:
        print('JSON_PARSE_ERR')
else:
    print('NO_JSON')
PYEOF
)

    echo "${EVAL_MS}ms (wall: ${WALL_MS}ms) — ${TOKENS} tokens — $JSON_STATUS"
    echo "$EVAL_MS" >> "$RESULTS_FILE"
    TIMES+=("$EVAL_MS")
done

echo ""
echo "=== Métriques finales ($MODEL) ==="

python3 << PYEOF
import statistics

with open("$RESULTS_FILE") as f:
    vals = [int(l.strip()) for l in f if l.strip()]

vals_sorted = sorted(vals)
n = len(vals_sorted)
median = statistics.median(vals_sorted)
p95_idx = max(0, int(0.95 * n) - 1)
p95 = vals_sorted[p95_idx]
mean = statistics.mean(vals_sorted)

print(f"Runs      : {n}")
print(f"Min       : {min(vals_sorted)} ms ({min(vals_sorted)/1000:.1f}s)")
print(f"Max       : {max(vals_sorted)} ms ({max(vals_sorted)/1000:.1f}s)")
print(f"Moyenne   : {mean:.0f} ms ({mean/1000:.1f}s)")
print(f"Médiane   : {median:.0f} ms ({median/1000:.1f}s)  ← métrique principale")
print(f"P95       : {p95} ms ({p95/1000:.1f}s)         ← pire cas à 95%")
print(f"Valeurs   : {vals_sorted}")
PYEOF

echo ""
echo "Réponses brutes : $OUTPUT_DIR/"
