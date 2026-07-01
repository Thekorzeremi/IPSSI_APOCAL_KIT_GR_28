#!/usr/bin/env bash
# Benchmark Llama 3.1 8B via Ollama — compatible macOS ET Linux
# Cas d'usage réel : génération de QCM JSON depuis un texte de cours
# Auteur : James MBA FONGANG — Équipe 28 — Perturbation J2
#
# Usage :
#   1) Installer Ollama (https://ollama.com) puis : ollama pull llama3.1:8b
#   2) bash bench_model.sh
#
# Pour tester un autre modèle, change juste la variable MODEL ci-dessous.

set -euo pipefail

MODEL="llama3.1:8b"
N_RUNS=5
TIMEOUT_S=300
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESULTS_FILE="$SCRIPT_DIR/benchmark_results.txt"
OUTPUT_DIR="$SCRIPT_DIR/runs"
OLLAMA_URL="http://localhost:11434"

mkdir -p "$OUTPUT_DIR"
: > "$RESULTS_FILE"

# --- Vérifs préalables -------------------------------------------------------
command -v ollama >/dev/null 2>&1 || { echo "❌ Ollama n'est pas installé. Voir https://ollama.com"; exit 1; }
if ! curl -s "$OLLAMA_URL/api/tags" >/dev/null 2>&1; then
  echo "❌ Le serveur Ollama ne répond pas sur $OLLAMA_URL."
  echo "   Démarre-le (ouvre l'app Ollama, ou lance 'ollama serve') puis relance ce script."
  exit 1
fi
if ! ollama list | awk '{print $1}' | grep -q "^${MODEL}$"; then
  echo "ℹ️  Modèle '$MODEL' absent — téléchargement en cours..."
  ollama pull "$MODEL"
fi

# --- Infos machine (portable macOS / Linux) ----------------------------------
now_ms() { python3 -c 'import time; print(int(time.time()*1000))'; }

OS="$(uname -s)"
if [ "$OS" = "Darwin" ]; then
  CPU="$(sysctl -n machdep.cpu.brand_string 2>/dev/null || echo 'Apple Silicon')"
  CORES="$(sysctl -n hw.ncpu)"
  RAM_GB="$(python3 -c "import subprocess;print(round(int(subprocess.check_output(['sysctl','-n','hw.memsize']))/1024**3))")"
  RAM="${RAM_GB} Go"
  GPU="$(system_profiler SPDisplaysDataType 2>/dev/null | awk -F': ' '/Chipset Model/{print $2; exit}' || echo 'GPU intégré')"
else
  CPU="$(grep -m1 'model name' /proc/cpuinfo | cut -d: -f2 | xargs 2>/dev/null || echo 'CPU')"
  CORES="$(nproc 2>/dev/null || echo '?')"
  RAM="$(free -h 2>/dev/null | awk '/^Mem/{print $2}' || echo '?')"
  GPU="$(command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi --query-gpu=name --format=csv,noheader | head -1 || echo 'Aucun GPU dédié détecté')"
fi

# --- Prompt représentatif du cas d'usage réel --------------------------------
PROMPT='Tu es un assistant pédagogique. Génère exactement 3 questions QCM sur le cours suivant, en JSON strict uniquement. Format: {"questions": [{"prompt": "...", "options": ["...","...","...","..."], "correct_index": 0}]}

COURS : Le modèle OSI comprend 7 couches. La couche réseau utilise les adresses IP pour router les paquets. La couche transport gère TCP (fiable, connexion en 3 étapes SYN/SYN-ACK/ACK) et UDP (sans connexion, rapide). La couche liaison utilise les adresses MAC. La couche physique gère la transmission des bits sur le support physique.

GÉNÈRE LE JSON MAINTENANT :'

PROMPT_JSON=$(python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))' <<< "$PROMPT")

echo "=== Benchmark $MODEL ==="
echo "Modèle    : $MODEL"
echo "Runs      : $N_RUNS"
echo "Date      : $(date '+%Y-%m-%d %H:%M:%S')"
echo "Machine   : $(uname -n) ($OS)"
echo "CPU       : $CORES cœurs — $CPU"
echo "RAM       : $RAM"
echo "GPU       : $GPU"
echo "======================================="

for i in $(seq 1 "$N_RUNS"); do
  printf "Run %s/%s ... " "$i" "$N_RUNS"

  START="$(now_ms)"
  RESP="$(curl -s --max-time "$TIMEOUT_S" "$OLLAMA_URL/api/generate" \
      -H "Content-Type: application/json" \
      -d "{\"model\":\"$MODEL\",\"prompt\":$PROMPT_JSON,\"stream\":false}" 2>/dev/null || echo '{}')"
  END="$(now_ms)"
  WALL_MS=$((END - START))

  # On écrit la réponse brute dans un fichier, puis Python l'analyse (robuste)
  echo "$RESP" > "$OUTPUT_DIR/raw_${i}.json"

  read -r EVAL_MS TOKENS JSON_STATUS < <(python3 - "$OUTPUT_DIR/raw_${i}.json" "$WALL_MS" <<'PYEOF'
import json, sys, re
raw_path, wall = sys.argv[1], int(sys.argv[2])
try:
    d = json.load(open(raw_path, encoding="utf-8"))
except Exception:
    print(wall, 0, "API_ERR"); sys.exit()

eval_ms = int(d.get("eval_duration", 0) / 1e6) or wall
tokens = d.get("eval_count", 0)
text = d.get("response", "")

# Sauve juste le texte généré, lisible
open(raw_path.replace("raw_", "run_").replace(".json", ".txt"), "w", encoding="utf-8").write(text)

status = "NO_JSON"
m = re.search(r"\{.*\}", text, re.DOTALL)
if m:
    try:
        q = json.loads(m.group()).get("questions", [])
        ok = len(q) >= 2 and all(
            "prompt" in x and "options" in x and "correct_index" in x for x in q
        )
        status = "JSON_OK" if ok else "JSON_STRUCT_ERR"
    except Exception:
        status = "JSON_PARSE_ERR"
print(eval_ms, tokens, status)
PYEOF
)

  echo "${EVAL_MS}ms (wall: ${WALL_MS}ms) — ${TOKENS} tokens — $JSON_STATUS"
  echo "$EVAL_MS" >> "$RESULTS_FILE"
done

echo ""
echo "=== Métriques finales ==="
python3 - "$RESULTS_FILE" <<'PYEOF'
import statistics, sys
vals = sorted(int(l) for l in open(sys.argv[1]) if l.strip())
n = len(vals)
if not n:
    print("Aucun run valide."); sys.exit()
p95 = vals[max(0, int(0.95 * n) - 1)]
print(f"Runs      : {n}")
print(f"Min       : {min(vals)} ms ({min(vals)/1000:.1f}s)")
print(f"Max       : {max(vals)} ms ({max(vals)/1000:.1f}s)")
print(f"Moyenne   : {statistics.mean(vals):.0f} ms ({statistics.mean(vals)/1000:.1f}s)")
print(f"Médiane   : {statistics.median(vals):.0f} ms ({statistics.median(vals)/1000:.1f}s)  <- metrique principale")
print(f"P95       : {p95} ms ({p95/1000:.1f}s)         <- pire cas a 95%")
print(f"Valeurs   : {vals}")
PYEOF

echo ""
echo "Réponses générées : $OUTPUT_DIR/run_*.txt"
echo "Temps bruts       : $RESULTS_FILE"
