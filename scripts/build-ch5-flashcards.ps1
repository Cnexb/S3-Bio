# Build Ch 5 flashcardData.js from extracted source + answer key
$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path "$PSScriptRoot\..\public\food-nutrition")) {
  $root = "C:\Users\user\Downloads\S3-Bio"
}
$base = Join-Path $root "public\food-nutrition"
$assets = Join-Path $base "assets"
$docx = Join-Path $base "sources\Ch5_Food_and_human_Summer.docx"
$outJs = Join-Path $base "js\flashcardData.js"

New-Item -ItemType Directory -Force -Path $assets | Out-Null

# Extract images
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docx)
$i = 1
foreach ($e in ($zip.Entries | Where-Object { $_.FullName -match '^word/media/' } | Sort-Object FullName)) {
  $ext = [IO.Path]::GetExtension($e.Name)
  $fname = "doc_img{0:D2}{1}" -f $i, $ext
  $outPath = Join-Path $assets $fname
  $stream = $e.Open()
  $fs = [IO.File]::Create($outPath)
  $stream.CopyTo($fs)
  $fs.Close(); $stream.Close()
  $i++
}
$zip.Dispose()
Write-Host "Extracted $($i - 1) images"

function Esc-Js([string]$s) {
  if ($null -eq $s) { return '""' }
  $s = $s -replace '\\', '\\\\' -replace '"', '\"' -replace "`r", '' -replace "`n", ' '
  return "`"$s`""
}

function Card($id, $subtopic, $front, $back, $image = $null, $imageAlt = "") {
  $imgLine = if ($image) { ",`n    image: $(Esc-Js $image),`n    imageAlt: $(Esc-Js $imageAlt)" } else { "" }
  return @"
  {
    id: $id,
    subtopic: $(Esc-Js $subtopic),
    front: $(Esc-Js $front),
    back: $(Esc-Js $back)$imgLine
  }
"@
}

$cards = @()
$id = 1

function Add-Card($sub, $front, $back, $img = $null, $alt = "") {
  script:Cards = $script:cards + ,@($sub, $front, $back, $img, $alt)
}

# --- Organic & Inorganic ---
$organic = "Organic & Inorganic Molecules"
$cards += ,@($organic, 'What does "<strong>organic</strong>" mean in "organic products" (food labelling)?', 'Food produced under the rules of <strong>organic farming</strong>有機農業, e.g. without artificial fertilizers.')
$cards += ,@($organic, 'Define <strong>organic molecules</strong> (有機).', 'Compounds with carbon, typically produced by living organisms; include <strong>C-C & C-H bonds</strong>. Examples: carbohydrates, lipids, proteins, nucleic acids (DNA), vitamins.')
$cards += ,@($organic, 'Give examples of <strong>organic molecules</strong>.', '<strong>Carbohydrates</strong>碳水化合物, <strong>lipids</strong>脂質, <strong>proteins</strong>蛋白質, <strong>nucleic acids</strong>核酸 (e.g. DNA), <strong>vitamins</strong>維生素.')
$cards += ,@($organic, 'Define <strong>inorganic molecules</strong> (無機).', "Doesn't include C-C & C-H bonds. Examples: <strong>water</strong> H₂O, <strong>minerals</strong>礦物質 (e.g. calcium鈣, iron鐵).")
$cards += ,@($organic, 'Is <strong>water</strong> organic or inorganic?', '<strong>Inorganic</strong> — water H₂O is an inorganic molecule.')
$cards += ,@($organic, 'Which is NOT an organic molecule? A. Carbohydrate B. Protein C. Lipid D. Water', '<strong>D. Water</strong> — inorganic molecule.')

# --- Hydrolysis & Condensation ---
$hydro = "Hydrolysis & Condensation"
$cards += ,@($hydro, 'Two glucoses (葡萄糖) combine to form one maltose (麥芽糖). Condensation or hydrolysis?', '<strong>Condensation</strong> — water is <strong>lost</strong>.')
$cards += ,@($hydro, 'One maltose (麥芽糖) breaks down into two glucose molecules (葡萄糖). Condensation or hydrolysis?', '<strong>Hydrolysis</strong> — water is <strong>gained</strong>.')
$cards += ,@($hydro, 'One glycerol (甘油) + three fatty acids (脂肪酸) → one triglyceride (甘油三酯). Reaction type?', '<strong>Condensation</strong> — water is lost.')
$cards += ,@($hydro, 'A triglyceride (甘油三酯) → one glycerol (甘油) + three fatty acids (脂肪酸). Reaction type?', '<strong>Hydrolysis</strong> — water is gained.')
$cards += ,@($hydro, 'Amino acids (氨基酸) combine to form a dipeptide (二肽). Reaction type?', '<strong>Condensation</strong> — water is lost.')
$cards += ,@($hydro, 'A dipeptide (二肽) breaks down into two amino acids (氨基酸). Reaction type?', '<strong>Hydrolysis</strong> — water is gained.')
$cards += ,@($hydro, 'Starch (澱粉) breaks down into maltose (麥芽糖) molecules. Reaction type?', '<strong>Hydrolysis</strong>.')
$cards += ,@($hydro, 'Cellulose (纖維素) breaks down into glucose (葡萄糖) molecules. Reaction type?', '<strong>Hydrolysis</strong>.')
$cards += ,@($hydro, 'DNA nucleotides (核苷酸) combine to form a DNA strand (DNA鏈). Reaction type?', '<strong>Condensation</strong>.')
$cards += ,@($hydro, 'Maltose麥芽糖 + ___ water → glucose葡萄糖 + glucose葡萄糖. How many water molecules?', '<strong>1</strong> water molecule (hydrolysis).')
$cards += ,@($hydro, 'glucose葡萄糖 + glucose葡萄糖 → Maltose麥芽糖 + ___ water. How many water molecules?', '<strong>1</strong> water molecule (condensation).')
$cards += ,@($hydro, 'Triglyceride甘油三酯 + __ water → glycerol甘油 + 3 fatty acids脂肪酸. How many water?', '<strong>3</strong> water molecules (hydrolysis).')
$cards += ,@($hydro, 'Glycerol甘油 + 3 fatty acids脂肪酸 → Triglyceride甘油三酯 + __ water. How many water?', '<strong>3</strong> water molecules (condensation).')
$cards += ,@($hydro, '2 amino acids → Dipeptide + ___ water (condensation). How many water produced?', '<strong>1</strong> water molecule.')
$cards += ,@($hydro, 'Dipeptide + 1 water → 2 amino acids. How many bonds broken (hydrolysis)?', '<strong>1</strong> bond.')
$cards += ,@($hydro, 'Polypeptide多肽 breakdown into 6 amino acids — how many bonds broken?', '<strong>5</strong> bonds (hydrolysis).')
$cards += ,@($hydro, '5 amino acids form polypeptide — how many bonds formed?', '<strong>4</strong> bonds (condensation).')
$cards += ,@($hydro, 'Polypeptide多肽 breakdown into 22 amino acids — how many bonds broken?', '<strong>21</strong> bonds (hydrolysis).')
$cards += ,@($hydro, 'What is the role of water in <strong>hydrolysis</strong>?', 'Water <strong>breaks bonds</strong> in molecules.')
$cards += ,@($hydro, 'Which reaction produces water as a by-product?', '<strong>Condensation</strong> — water is lost when smaller molecules join.')

# --- Proteins ---
$prot = "Proteins"
$cards += ,@($prot, 'How many types of amino acids (胺基酸) are there?', '<strong>20 types</strong> (20 types of side chain側鏈).')
$cards += ,@($prot, 'Polypeptide fold 折疊 into protein — what determines 3D conformation 構象?', '<strong>Amino acid sequence</strong>胺基酸序列.')
$cards += ,@($prot, 'What holds polypeptide folding together?', '<strong>Hydrogen bonds</strong> between amino acids.')
$cards += ,@($prot, 'Denature 變性 — is it reversible?', '<strong>Irreversible!</strong> 不可逆轉！')
$cards += ,@($prot, 'Common causes of <strong>denaturation</strong> 變性?', '<strong>Non-optimal pH</strong>非最優 pH, <strong>high temperature</strong> (boiling).')
$cards += ,@($prot, 'Denature = loss of ___ → loss of ___', 'Loss of specific <strong>3D conformation</strong> → loss of <strong>specific function</strong>.')
$cards += ,@($prot, 'What happens during denaturation of a protein?', 'It <strong>loses its specific shape and function</strong>.')
$cards += ,@($prot, 'What happens to protein function when it denatures?', 'It <strong>loses its specific function</strong>.')
$cards += ,@($prot, 'Smallest unit of a protein?', '<strong>Amino acid</strong>.')

# --- Carbohydrates ---
$carb = "Carbohydrates"
$cards += ,@($carb, 'Glucose 葡萄糖 — function and where found?', 'Main <strong>respiratory</strong>呼吸作用 fuel for quick energy. Found in: candy.')
$cards += ,@($carb, 'Fructose 果糖 — function and where found?', '<strong>Sweetener</strong>甜味劑. Found in: fruit.')
$cards += ,@($carb, 'Galactose 半乳糖 — function and where found?', 'Component of <strong>lactose</strong>乳糖. Found in: milk.')
$cards += ,@($carb, 'Maltose 麥芽糖 — function and where found?', 'Provides energy (提供能量). Found in: malt麥芽.')
$cards += ,@($carb, 'Sucrose 蔗糖 — where found?', '<strong>Sweetener</strong>. Sugarcane蔗, fruits.')
$cards += ,@($carb, 'Lactose 乳糖 — where found?', 'Sugar in milk. Found in: <strong>milk</strong>.')
$cards += ,@($carb, 'Starch 澱粉 — function and where found?', '<strong>Energy storage in plants</strong>. Potato, grains穀物.')
$cards += ,@($carb, 'Cellulose 纖維素 — function and where found?', '<strong>Structural component in plant cell wall</strong>細胞壁. Vegetables.')
$cards += ,@($carb, 'Glycogen 肝醣 — function and where found?', '<strong>Energy storage in animals</strong>. Liver肝 and muscles.')
$cards += ,@($carb, 'Stored form of carbohydrates in plants?', '<strong>Starch</strong>澱粉.')
$cards += ,@($carb, 'Stored form of energy in animals?', '<strong>Glycogen</strong>肝醣 — liver and muscles.')
$cards += ,@($carb, 'Structural component in plant cell walls?', '<strong>Cellulose</strong>纖維素.')

# --- Lipids ---
$lip = "Lipids"
$cards += ,@($lip, 'What is a <strong>triglyceride</strong> (三酸甘油酯 / 甘油三酯)?', '<strong>Glycerol</strong> (甘油) + <strong>3 fatty acids</strong> (脂肪酸). Functions: <strong>energy storage</strong>, <strong>insulation</strong>, <strong>organ protection</strong>. Found in <strong>fats</strong> and <strong>oils</strong>.')
$cards += ,@($lip, 'What is a <strong>phospholipid</strong> (磷脂質)?', '<strong>Phosphate</strong> + <strong>glycerol</strong> + <strong>2 fatty acids</strong>. <strong>Main component of cell membranes</strong>.')
$cards += ,@($lip, 'What are <strong>steroids</strong> (類固醇)?', 'e.g. <strong>Cholesterol</strong> — <strong>sex hormones</strong>, <strong>cell membranes</strong>; found in <strong>body tissues</strong>.')
$cards += ,@($lip, 'Are lipids (脂質) <strong>hydrophilic</strong> or <strong>hydrophobic</strong>?', '<strong>Hydrophobic</strong> — lipids are <strong>insoluble in water</strong> and used for energy storage.')
$cards += ,@($lip, 'What lipid is used to form <strong>cell membranes</strong> (細胞膜)?', '<strong>Phospholipids</strong> (磷脂質) — main component of cell membranes.')

# Concept-check cards (MCQ, T/F, fill-in-blanks) are intentionally excluded — deck stays 52 concept cards.

# Build JS
$lines = @(
  '/** Ch 5 Food and Nutrition — flashcard deck (52 concept cards) */',
  'export const FLASHCARD_TAGS = ["Biology", "FoodNutrition", "Biomolecules"];',
  '',
  'export const FLASHCARD_DECK = ['
)
$cid = 1
foreach ($c in $cards) {
  $lines += (Card $cid $c[0] $c[1] $c[2] $c[3] $c[4])
  if ($cid -lt $cards.Count) { $lines += ',' }
  $cid++
}
$lines += '];'
$lines += ''
$content = $lines -join "`n"
[System.IO.File]::WriteAllText($outJs, $content, [Text.UTF8Encoding]::new($false))
Write-Host "Wrote $($cards.Count) cards to $outJs"
