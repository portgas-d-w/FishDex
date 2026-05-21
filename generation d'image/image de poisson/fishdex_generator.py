"""
╔══════════════════════════════════════════════════════════════╗
║              🎣 FishDex Image Generator                      ║
║        gpt-image-1 + Remove.bg — 2 images par poisson       ║
╚══════════════════════════════════════════════════════════════╝

INSTALLATION (une seule fois) :
  pip install requests python-dotenv

CONFIGURATION :
  Crée un fichier .env dans ce dossier avec :
    OPENAI_API_KEY=sk-...
    REMOVEBG_API_KEY=xxx...
  Puis lance : python fishdex_generator.py

REPRISE :
  Si le script est interrompu, relance-le simplement.
  Les fichiers déjà générés sont automatiquement ignorés.
"""

import os
import time
import json
import random
import base64
import requests
from pathlib import Path
from datetime import datetime

# ─────────────────────────────────────────────
#  🔑 CONFIGURATION — via .env ou directement
# ─────────────────────────────────────────────

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass  # python-dotenv optionnel

OPENAI_API_KEY   = os.getenv("OPENAI_API_KEY",   "")
REMOVEBG_API_KEY = os.getenv("REMOVEBG_API_KEY", "")

# ─────────────────────────────────────────────
#  🐟 LISTE DES POISSONS — 92 espèces visibles du FishDex
#  Format : ("Nom commun", "Nom latin", "numero")
#
#  Le numéro = champ numero_dex dans la base de données.
#  Il sert aussi de préfixe dans les noms de fichiers
#  (ex : 001_ablette_v1.jpg, 001_ablette_v2.jpg).
#  Les numéros 53-57 et 92-96 sont les Mirages (espèces
#  cachées, is_hidden_in_dex = true) — non inclus ici.
# ─────────────────────────────────────────────

FISH_LIST = [

    # ── CYPRINIDES COMMUNS / PAISIBLES (001-013) ───────────────
    ("Ablette",                    "Alburnus alburnus",                            "001"),
    ("Breme bordeliere",           "Blicca bjoerkna",                              "002"),
    ("Breme bronze",               "Abramis brama (forme bronze)",                 "003"),
    ("Breme commune",              "Abramis brama",                                "004"),
    ("Carassin commun",            "Carassius carassius",                          "005"),
    ("Chevesne",                   "Squalius cephalus",                            "006"),
    ("Gardon",                     "Rutilus rutilus",                              "007"),
    ("Gardon rouge",               "Rutilus rutilus f. rubra",                     "008"),
    ("Gobie",                      "Neogobius melanostomus",                       "009"),
    ("Goujon",                     "Gobio gobio",                                  "010"),
    ("Rotengle",                   "Scardinius erythrophthalmus",                  "011"),
    ("Tanche commune",             "Tinca tinca",                                  "012"),
    ("Vairon",                     "Phoxinus phoxinus",                            "013"),

    # ── PREDATEURS ET GRANDES ESPECES (014-027) ────────────────
    ("Anguille europeenne",        "Anguilla anguilla",                            "014"),
    ("Barbeau",                    "Barbus barbus",                                "015"),
    ("Black-bass a grande bouche", "Micropterus salmoides",                        "016"),
    ("Brochet",                    "Esox lucius",                                  "017"),
    ("Carassin dore",              "Carassius carassius var. auratus",             "018"),
    ("Carpe commune",              "Cyprinus carpio",                              "019"),
    ("Ide dore",                   "Leuciscus idus var. orfe",                     "020"),
    ("Ide melanote",               "Leuciscus idus",                               "021"),
    ("Lotte de riviere",           "Lota lota",                                    "022"),
    ("Perche commune",             "Perca fluviatilis",                            "023"),
    ("Perche soleil",              "Lepomis gibbosus",                             "024"),
    ("Sandre",                     "Sander lucioperca",                            "025"),
    ("Tanche doree",               "Tinca tinca var. aurea",                       "026"),
    ("Truite arc-en-ciel",         "Oncorhynchus mykiss",                          "027"),

    # ── CARPES ET VARIANTES (028-052) ──────────────────────────
    ("Aspe",                       "Leuciscus aspius",                             "028"),
    ("Carpe cuir",                 "Cyprinus carpio var. nudus",                   "029"),
    ("Carpe koi",                  "Cyprinus rubrofuscus",                         "030"),
    ("Carpe koi Kohaku",           "Cyprinus rubrofuscus var. kohaku",             "031"),
    ("Carpe koi Ogon",             "Cyprinus rubrofuscus var. ogon",               "032"),
    ("Carpe koi Sanke",            "Cyprinus rubrofuscus var. sanke",              "033"),
    ("Carpe koi Showa",            "Cyprinus rubrofuscus var. showa",              "034"),
    ("Carpe fully scaled",         "Cyprinus carpio var. squamosus",               "035"),
    ("Carpe lineaire",             "Cyprinus carpio var. linearis",                "036"),
    ("Carpe miroir",               "Cyprinus carpio var. specularis",              "037"),
    ("Esturgeon diamant",          "Acipenser gueldenstaedtii",                    "038"),
    ("Esturgeon siberien",         "Acipenser baerii",                             "039"),
    ("Truite fario",               "Salmo trutta",                                 "040"),
    ("Truite jaune gold",          "Oncorhynchus mykiss f. xanthica",              "041"),
    ("Ombre commun",               "Thymallus thymallus",                          "042"),
    ("Carpe amour argente",        "Hypophthalmichthys molitrix",                  "043"),
    ("Carpe amour blanc",          "Ctenopharyngodon idella",                      "044"),
    ("Carpe marbre",               "Hypophthalmichthys nobilis",                   "045"),
    ("Carpe koi Platinum",         "Cyprinus rubrofuscus var. platinum",           "046"),
    ("Esturgeon baeri",            "Acipenser baerii baerii",                      "047"),
    ("Esturgeon gold",             "Acipenser baerii f. xanthica",                 "048"),
    ("Silure glane",               "Silurus glanis",                               "049"),
    ("Silure gold",                "Silurus glanis f. xanthica",                   "050"),
    ("Silure mandarin",            "Leiocassis longirostris",                      "051"),
    ("Truite tiger",               "Oncorhynchus mykiss x Salvelinus fontinalis",  "052"),

    # ── ESPECES ENRICHIES — VAGUE 2 (058-091) ──────────────────
    ("Nase commun",                "Chondrostoma nasus",                           "058"),
    ("Spirlin",                    "Alburnoides bipunctatus",                      "059"),
    ("Bouviere",                   "Rhodeus amarus",                               "060"),
    ("Poisson chat",               "Ameiurus melas",                               "061"),
    ("Vandoise",                   "Leuciscus leuciscus",                          "062"),
    ("Loche franche",              "Barbatula barbatula",                          "063"),
    ("Chabot commun",              "Cottus gobio",                                 "064"),
    ("Carpe herbivore",            "Ctenopharyngodon idella",                      "065"),
    ("Carassin argente",           "Carassius gibelio",                            "066"),
    ("Hotu",                       "Chondrostoma nasus",                           "067"),
    ("Toxostome",                  "Parachondrostoma toxostoma",                   "068"),
    ("Soufie",                     "Leuciscus souffia",                            "069"),
    ("Black-bass a petite bouche", "Micropterus dolomieu",                         "070"),
    ("Omble de fontaine",          "Salvelinus fontinalis",                        "071"),
    ("Lavaret",                    "Coregonus lavaretus",                          "072"),
    ("Grande alose",               "Alosa alosa",                                  "073"),
    ("Alose feinte",               "Alosa fallax",                                 "074"),
    ("Saumon atlantique",          "Salmo salar",                                  "075"),
    ("Truite de mer",              "Salmo trutta trutta",                          "076"),
    ("Truite lacustre",            "Salmo trutta lacustris",                       "077"),
    ("Huchon du Danube",           "Hucho hucho",                                  "078"),
    ("Omble chevalier",            "Salvelinus alpinus",                           "079"),
    ("Eperlan",                    "Osmerus eperlanus",                            "080"),
    ("Barbeau meridional",         "Barbus meridionalis",                          "081"),
    ("Perche fluviatile",          "Perca fluviatilis f. rivularis",               "082"),
    ("Sandre dore",                "Sander vitreus",                               "083"),
    ("Coregone palee",             "Coregonus palaea",                             "084"),
    ("Lamproie fluviatile",        "Lampetra fluviatilis",                         "085"),
    ("Esturgeon europeen",         "Acipenser sturio",                             "086"),
    ("Silure record",              "Silurus glanis f. grandis",                    "087"),
    ("Brochet trophee",            "Esox lucius f. maximus",                       "088"),
    ("Carpe record",               "Cyprinus carpio f. robustus",                  "089"),
    ("Sandre geant",               "Sander lucioperca f. maximus",                 "090"),
    ("Saumon royal",               "Oncorhynchus tshawytscha",                     "091"),

    # ── ESPECES RARES RECENTES (097-102) ───────────────────────
    ("Blageon",                    "Telestes souffia",                             "097"),
    ("Apron du Rhone",             "Zingel asper",                                 "098"),
    ("Pseudorasbora",              "Pseudorasbora parva",                          "099"),
    ("Mulet porc",                 "Chelon ramada",                                "100"),
    ("Cristivomer",                "Salvelinus namaycush",                         "101"),
    ("Lamproie de Planer",         "Lampetra planeri",                             "102"),
]

IMAGES_PER_FISH = 2     # 2 images par poisson
OUTPUT_DIR      = Path("fishdex_images")
PROGRESS_FILE   = OUTPUT_DIR / "progress.json"
MAX_RETRIES     = 3     # tentatives max si erreur API

# Prix gpt-image-1 high 1024x1024 (en dollars)
PRICE_PER_IMAGE_USD = 0.04
# Prix Remove.bg par image (plan gratuit : 50/mois, plan payant : ~0.01$)
PRICE_REMOVEBG_USD  = 0.01

# ─────────────────────────────────────────────
#  🎲 POSITIONS ALEATOIRES
# ─────────────────────────────────────────────

POSITIONS = [
    "LATERAL VIEW — classic side profile, swimming horizontally from left to right, slightly tilted upward (+10 degrees), fins naturally spread",
    "DIAGONAL ASCENT — fish angled at 30 degrees upward, as if rising toward the surface, body slightly arched, pectoral fins extended",
    "DIAGONAL DESCENT — fish angled at 30 degrees downward, diving posture, tail fin raised, body in gentle curve",
    "THREE-QUARTER FRONT — slight front-facing angle (45 degrees), showing depth and volume of the body, eye in full detail",
    "DYNAMIC CURVE — body in a fluid S-curve, mid-swim motion captured, all fins fully extended and in motion",
    "LATERAL MIRROR — classic side profile swimming right to left, tail slightly raised, body in subtle upward arc",
]

# ─────────────────────────────────────────────
#  🖼️ PROMPT TEMPLATE
# ─────────────────────────────────────────────

def build_prompt(fish_name, latin_name, position):
    return f"""Generate a hyper-realistic illustration of a {fish_name} ({latin_name}) on a pure white (#FFFFFF) background, square 1:1 format.

POSITION: {position}

STYLE REQUIREMENTS:
- The fish must look alive and in motion, as if actively swimming through water
- Subtle motion blur on the tail fin and pectoral fins to convey movement
- Realistic water light refraction on scales (caustic light effect, soft highlights)
- Fine scale detail, realistic eye with depth and wet-glass reflection
- Natural, species-accurate coloration and body shape
- Soft drop shadow directly beneath the fish
- Background: pure white (#FFFFFF), absolutely no water, no scenery, no plants, no decorations
- The fish occupies 70-80% of the frame, centered
- Studio-quality lighting, soft and directional from top-left
- Photorealistic digital art style, suitable for a clean mobile app UI card"""


# ─────────────────────────────────────────────
#  💾 GESTION DE LA PROGRESSION
# ─────────────────────────────────────────────

def load_progress():
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE, "r") as f:
            return set(json.load(f))
    return set()

def save_progress(done_set):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(list(done_set), f)


# ─────────────────────────────────────────────
#  🤖 GENERATION gpt-image-1 avec retry
# ─────────────────────────────────────────────

def generate_image(prompt, output_path, attempt=1):
    if attempt > MAX_RETRIES:
        print(f"    Abandon apres {MAX_RETRIES} tentatives.")
        return False

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "high",
    }

    try:
        response = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers=headers,
            json=payload,
            timeout=120,
        )
        response.raise_for_status()
        b64_data = response.json()["data"][0]["b64_json"]
        output_path.write_bytes(base64.b64decode(b64_data))
        return True

    except requests.exceptions.HTTPError as e:
        code = e.response.status_code
        print(f"    Erreur OpenAI : {code} — {e.response.text[:120]}")
        if code == 429:
            wait = 30 * attempt
            print(f"    Rate limit — attente {wait}s avant retry {attempt}/{MAX_RETRIES}...")
            time.sleep(wait)
            return generate_image(prompt, output_path, attempt + 1)
        if code >= 500:
            print(f"    Erreur serveur — retry {attempt}/{MAX_RETRIES} dans 10s...")
            time.sleep(10)
            return generate_image(prompt, output_path, attempt + 1)
        return False

    except Exception as e:
        print(f"    Erreur inattendue : {e}")
        if attempt < MAX_RETRIES:
            print(f"    Retry {attempt}/{MAX_RETRIES} dans 5s...")
            time.sleep(5)
            return generate_image(prompt, output_path, attempt + 1)
        return False


# ─────────────────────────────────────────────
#  ✂️ SUPPRESSION DU FOND — REMOVE.BG
# ─────────────────────────────────────────────

def remove_background(input_path, output_path):
    try:
        with open(input_path, "rb") as f:
            response = requests.post(
                "https://api.remove.bg/v1.0/removebg",
                files={"image_file": f},
                data={"size": "auto"},
                headers={"X-Api-Key": REMOVEBG_API_KEY},
                timeout=30,
            )

        if response.status_code == 200:
            output_path.write_bytes(response.content)
            return True
        else:
            print(f"    Remove.bg erreur : {response.status_code} — {response.text[:100]}")
            return False

    except Exception as e:
        print(f"    Remove.bg exception : {e}")
        return False


# ─────────────────────────────────────────────
#  🚀 PIPELINE PRINCIPAL
# ─────────────────────────────────────────────

def main():
    # Vérification des clés
    if not OPENAI_API_KEY:
        print("\nERREUR : OPENAI_API_KEY manquante.")
        print("Crée un fichier .env dans ce dossier avec :")
        print("  OPENAI_API_KEY=sk-...")
        print("  REMOVEBG_API_KEY=xxx...")
        return

    print("\n==========================================")
    print("       FishDex Image Generator v2")
    print("==========================================\n")

    # Création des dossiers
    raw_dir         = OUTPUT_DIR / "raw"
    transparent_dir = OUTPUT_DIR / "transparent"
    raw_dir.mkdir(parents=True, exist_ok=True)
    transparent_dir.mkdir(parents=True, exist_ok=True)

    # Chargement de la progression
    done = load_progress()

    # Calcul du nombre d'images restantes
    total_images    = len(FISH_LIST) * IMAGES_PER_FISH
    already_done    = len(done)
    remaining       = total_images - already_done

    # Estimation du coût
    cost_dalle    = remaining * PRICE_PER_IMAGE_USD
    cost_removebg = remaining * PRICE_REMOVEBG_USD
    cost_total    = cost_dalle + cost_removebg

    print(f"Poissons : {len(FISH_LIST)}")
    print(f"Images / poisson : {IMAGES_PER_FISH}")
    print(f"Total images : {total_images}")
    print(f"Deja generes : {already_done}")
    print(f"Restant : {remaining}\n")
    print(f"Cout estime (gpt-image-1 high) : ${cost_dalle:.2f}")
    print(f"Cout estime (Remove.bg)   : ${cost_removebg:.2f}")
    print(f"TOTAL estime              : ${cost_total:.2f}")
    print(f"\nFichier progression : {PROGRESS_FILE.resolve()}")
    print("==========================================\n")

    if remaining == 0:
        print("Toutes les images sont deja generees !")
        return

    confirm = input("Lancer la generation ? (o/n) : ").strip().lower()
    if confirm not in ("o", "oui", "y", "yes"):
        print("Annule.")
        return

    print()
    start_time    = datetime.now()
    success_count = 0
    skip_count    = 0
    error_count   = 0

    for fish_name, latin_name, number in FISH_LIST:
        print(f"[{number}] {fish_name} ({latin_name})")

        selected_positions = random.sample(POSITIONS, IMAGES_PER_FISH)

        for i, position in enumerate(selected_positions, start=1):
            safe_name        = fish_name.lower().replace(" ", "_").replace("-", "_")
            progress_key     = f"{number}_{safe_name}_v{i}"
            raw_path         = raw_dir / f"{progress_key}.png"
            transparent_path = transparent_dir / f"{progress_key}.png"

            # Skip si deja fait
            if progress_key in done:
                print(f"  Image {i}/{IMAGES_PER_FISH} — deja generee, ignoree.")
                skip_count += 1
                continue

            # Skip si le fichier existe mais n'est pas dans progress.json
            if transparent_path.exists():
                print(f"  Image {i}/{IMAGES_PER_FISH} — fichier existant detecte, ignoree.")
                done.add(progress_key)
                save_progress(done)
                skip_count += 1
                continue

            print(f"  Image {i}/{IMAGES_PER_FISH} — {position[:50]}...")

            prompt = build_prompt(fish_name, latin_name, position)
            ok = generate_image(prompt, raw_path)

            if ok:
                print(f"  Generee -> {raw_path.name}")
                if REMOVEBG_API_KEY:
                    print(f"  Suppression du fond...")
                    ok_bg = remove_background(raw_path, transparent_path)
                    if ok_bg:
                        print(f"  PNG transparent -> {transparent_path.name}")
                        success_count += 1
                    else:
                        print(f"  Fond non supprime, image brute conservee.")
                        error_count += 1
                else:
                    print(f"  REMOVEBG_API_KEY absente — image brute conservee sans suppression de fond.")
                    success_count += 1
                done.add(progress_key)
                save_progress(done)
            else:
                error_count += 1

            time.sleep(4)

        print()

    duration = datetime.now() - start_time
    print("==========================================")
    print(f"Succes  : {success_count} images")
    print(f"Ignores : {skip_count} images")
    print(f"Erreurs : {error_count} images")
    print(f"Duree   : {str(duration).split('.')[0]}")
    print(f"Dossier : {OUTPUT_DIR.resolve()}")
    print("==========================================\n")


if __name__ == "__main__":
    main()
