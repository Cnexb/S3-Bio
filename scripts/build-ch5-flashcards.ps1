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
$cards += ,@($lip, 'Triglycerides 三酸甘油酯 — composition and functions?', 'Glycerol甘油 + 3 fatty acids脂肪酸. <strong>Energy storage</strong>, insulation保溫, organ protection器官保護. Fats脂肪 and oils油.')
$cards += ,@($lip, 'Phospholipids 磷脂質 — composition and function?', 'Phosphate磷 + glycerol甘油 + 2 fatty acids. <strong>Main component of cell membranes</strong>細胞膜.')
$cards += ,@($lip, 'Steroids 類固醇 — examples and functions?', 'e.g. <strong>Cholesterol</strong>膽固醇, sex hormones性荷爾蒙. Found in cell membranes, body tissues.')
$cards += ,@($lip, 'Main component of butter?', '<strong>Lipid</strong> (triglyceride / fat).')
$cards += ,@($lip, 'Which reaction forms a triglyceride?', '<strong>Condensation</strong> — glycerol + 3 fatty acids.')

# --- MCQ Set 1 (basics) ---
$mcq = "Concept Checks — MCQ"
$mcq1 = @(
  @('Which of the following is an example of a carbohydrate? A. Glucose B. Glycerol C. Amino acid D. Triglyceride', 'A. Glucose'),
  @('Which food is rich in lipids? A. Rice B. Butter C. Fish D. Eggs', 'B. Butter'),
  @('Which process breaks down a polypeptide into amino acids? A. Condensation B. Hydrolysis C. Denaturation D. Polymerization', 'B. Hydrolysis'),
  @('Product of condensation between two amino acids? A. Polypeptide B. Dipeptide C. Glucose D. Triglyceride', 'B. Dipeptide'),
  @('Which is a protein-rich food? A. Bread B. Cheese C. Avocado D. Honey', 'B. Cheese'),
  @('What happens during denaturation of a protein? A. Gains 3D conformation B. Loses shape and function C. Forms dipeptide D. Hydrolysis', 'B. It loses its specific shape and function.'),
  @('Which is a lipid molecule? A. Maltose B. Polypeptide C. Triglyceride D. Amino acid', 'C. Triglyceride'),
  @('Role of water in hydrolysis? A. Creates bonds B. Breaks bonds C. Forms triglycerides D. Denatures proteins', 'B. It breaks bonds.'),
  @('Which food contains carbohydrates? A. Butter B. Rice C. Chicken D. Salmon', 'B. Rice'),
  @('Which reaction forms a triglyceride? A. Hydrolysis B. Condensation C. Denaturation D. Oxidation', 'B. Condensation'),
  @('Characteristic of proteins? A. Made of amino acids B. Plants have more protein than animals C. Needed in small amounts D. Simple sugars', 'A. They are made of amino acids.'),
  @('Which food is rich in carbohydrates? A. Milk B. Bread C. Meat D. Fish', 'B. Bread'),
  @('Molecule formed between two glucose molecules by condensation? A. Dipeptide B. Protein C. Starch D. Maltose', 'D. Maltose'),
  @('Process breaking down triglyceride into glycerol and fatty acids? A. Condensation B. Hydrolysis C. Denaturation D. Polymerization', 'B. Hydrolysis'),
  @('Protein exposed to high temperatures? A. Forms polypeptide B. Denatures C. Condensation D. Hydrolyzes', 'B. It denatures.'),
  @('Which is a protein? A. Maltose B. Polypeptide C. Triglyceride D. Glucose', 'B. Polypeptide'),
  @('Which food is rich in protein? A. Butter B. Chicken C. Potato D. Rice', 'B. Chicken'),
  @('Which food is rich in lipids? A. Apple B. Fish C. Rice D. Bread', 'B. Fish'),
  @('Main component of butter? A. Protein B. Carbohydrate C. Lipid D. Amino acid', 'C. Lipid'),
  @('Which is NOT an organic molecule? A. Carbohydrate B. Protein C. Lipid D. Water', 'D. Water'),
  @('Smallest unit of a protein? A. Glucose B. Amino acid C. Triglyceride D. Polypeptide', 'B. Amino acid'),
  @('Which reaction produces water as a by-product? A. Hydrolysis B. Condensation C. Denaturation D. Oxidation', 'B. Condensation'),
  @('3D structure of a protein called? A. Polypeptide B. Primary structure C. 3D conformation D. Dipeptide', 'C. 3D conformation'),
  @('Stored form of carbohydrates in plants? A. Starch B. Glycogen C. Triglyceride D. Protein', 'A. Starch'),
  @('Which food is rich in carbohydrates? A. Avocado B. Bread C. Salmon D. Butter', 'B. Bread'),
  @('Which is an organic biomolecule? A. Protein B. Water C. Oxygen D. Carbon dioxide', 'A. Protein'),
  @('Product of hydrolysis of a dipeptide? A. Polypeptide B. Amino acids C. Lipids D. Glucose', 'B. Amino acids'),
  @('Which is a carbohydrate? A. Triglyceride B. Maltose C. Polypeptide D. Amino acid', 'B. Maltose'),
  @('Which food is rich in proteins? A. Chicken breast B. Rice C. Orange D. Honey', 'A. Chicken breast'),
  @('Function of protein when it denatures? A. More efficient B. Loses specific function C. Forms amino acids D. Produces glucose', 'B. It loses its specific function.')
)
foreach ($q in $mcq1) { $cards += ,@($mcq, $q[0], $q[1]) }

# --- MCQ Set 2 (functions) ---
$mcq2 = @(
  @('Which is a monosaccharide? A. Starch B. Glucose C. Lactose D. Sucrose', 'B. Glucose'),
  @('Stored in liver and muscles as energy reserve? A. Cellulose B. Glycogen C. Starch D. Fructose', 'B. Glycogen'),
  @('Main component of cell membranes? A. Proteins B. Lipids C. Carbohydrates D. Nucleic acids', 'B. Lipids'),
  @('Main function of proteins in the human body? A. Energy storage B. Growth and repair C. Insulation D. Hormone regulation', 'B. Growth and repair of tissues'),
  @('Which is a disaccharide? A. Glucose B. Maltose C. Cellulose D. Glycogen', 'B. Maltose'),
  @('Why should a diabetic patient avoid glucose directly? A. Dehydration B. Raises blood sugar rapidly C. Hard to digest D. Damages liver', 'B. It raises blood sugar levels rapidly.'),
  @('Biomolecule for quick energy? A. Proteins B. Lipids C. Carbohydrates D. Steroids', 'C. Carbohydrates'),
  @('Structural component in plant cell walls? A. Glycogen B. Cellulose C. Starch D. Fructose', 'B. Cellulose'),
  @('Starving patient: glucose vs bread? A. Glucose digested slower B. Glucose immediate energy C. Bread dehydration D. Bread absorbed faster', 'B. Glucose provides immediate energy.'),
  @('Lipid essential for cell membrane structure? A. Triglycerides B. Phospholipids C. Steroids D. Fatty acids', 'B. Phospholipids'),
  @('Carbohydrate sweetener in fruits? A. Glucose B. Fructose C. Sucrose D. Maltose', 'B. Fructose'),
  @('Stored form of energy in animals? A. Starch B. Cellulose C. Glycogen D. Glucose', 'C. Glycogen'),
  @('Speeds up reactions in the human body? A. Triglycerides B. Glucose C. Hormones D. Enzymes', 'D. Enzymes'),
  @('Main energy source for respiration in humans? A. Proteins B. Glucose C. Lipids D. Vitamins', 'B. Glucose'),
  @('NOT a function of proteins? A. Growth and repair B. Enzyme production C. Energy storage D. Hormone regulation', 'C. Energy storage'),
  @('Where is glycogen stored? A. Brain B. Liver and muscles C. Heart D. Kidneys', 'B. Liver and muscles'),
  @('Lipid that regulates body functions as hormone? A. Cholesterol B. Glycerol C. Phospholipid D. Triglyceride', 'A. Cholesterol'),
  @('Carbohydrate used as respiratory substrate in humans? A. Lactose B. Starch C. Glucose D. Cellulose', 'C. Glucose'),
  @('Why is milk good energy for infants? A. Proteins only B. Contains lactose (disaccharide) C. Contains starch D. Contains cellulose', 'B. It contains lactose, a disaccharide.'),
  @('Why do athletes eat starch before a match? A. Build muscle B. Long-term storage C. Provide glucose steadily during race D. Repair tissues', 'C. To provide glucose steadily for energy during the race.')
)
foreach ($q in $mcq2) { $cards += ,@($mcq, $q[0], $q[1]) }

# --- True/False Set 1 ---
$tf = "Concept Checks — True/False"
$tf1 = @(
  @('True or False: Hydrolysis breaks bonds in molecules.', '<strong>True</strong> ✔'),
  @('True or False: Denaturation is a reversible process.', '<strong>False</strong> ✘ — Denaturation is <strong>irreversible</strong>.'),
  @('True or False: Proteins are made of amino acids.', '<strong>True</strong> ✔'),
  @('True or False: Lipids are hydrophilic molecules.', '<strong>False</strong> ✘ — Lipids are <strong>hydrophobic</strong>.'),
  @('True or False: Triglycerides are formed by condensation reactions.', '<strong>True</strong> ✔'),
  @('True or False: Carbohydrates provide energy for the body.', '<strong>True</strong> ✔'),
  @('True or False: Proteins are usually absent in the human body.', '<strong>False</strong> ✘'),
  @('True or False: Butter is rich in carbohydrates.', '<strong>False</strong> ✘ — Butter is rich in <strong>lipids</strong>.'),
  @('True or False: Hydrolysis requires water to break bonds.', '<strong>True</strong> ✔'),
  @('True or False: Lipids are used to form cell membranes.', '<strong>True</strong> ✔'),
  @('True or False: Condensation produces water as a by-product.', '<strong>True</strong> ✔'),
  @('True or False: Amino acids are the building blocks of proteins.', '<strong>True</strong> ✔'),
  @('True or False: Starch is a form of stored glucose in plants.', '<strong>True</strong> ✔'),
  @('True or False: Triglycerides are broken down into glycerol and fatty acids.', '<strong>True</strong> ✔'),
  @('True or False: Proteins are inactive when denatured.', '<strong>True</strong> ✔')
)
foreach ($q in $tf1) { $cards += ,@($tf, $q[0], $q[1]) }

# --- True/False Set 2 ---
$tf2 = @(
  @('True or False: Glucose is a monosaccharide.', '<strong>True</strong> ✔'),
  @('True or False: Proteins are used for energy storage in the body.', '<strong>False</strong> ✘'),
  @('True or False: Cellulose is found in the cell walls of plants.', '<strong>True</strong> ✔'),
  @('True or False: Glycogen is stored in the liver and muscles.', '<strong>True</strong> ✔'),
  @('True or False: Lipids are the main source of quick energy in humans.', '<strong>False</strong> ✘ — <strong>Carbohydrates</strong> are the main quick energy source.'),
  @('True or False: Enzymes are proteins that speed up chemical reactions.', '<strong>True</strong> ✔'),
  @('True or False: Fructose is a disaccharide found in fruits.', '<strong>False</strong> ✘ — Fructose is a <strong>monosaccharide</strong>.'),
  @('True or False: Starch is a storage carbohydrate in plants.', '<strong>True</strong> ✔'),
  @('True or False: Phospholipids are the main components of cell membranes.', '<strong>True</strong> ✔'),
  @('True or False: Proteins are required for growth and repair in humans.', '<strong>True</strong> ✔'),
  @('True or False: Steroids are a type of lipid that acts as a hormone.', '<strong>True</strong> ✔'),
  @('True or False: Maltose is a monosaccharide.', '<strong>False</strong> ✘ — Maltose is a <strong>disaccharide</strong>.'),
  @('True or False: Glycogen is the stored form of glucose in plants.', '<strong>False</strong> ✘ — Glycogen is stored in <strong>animals</strong>; plants store <strong>starch</strong>.'),
  @('True or False: Non-green parts of plants, like potatoes, store starch.', '<strong>True</strong> ✔'),
  @('True or False: Lactose is a carbohydrate found in milk.', '<strong>True</strong> ✔')
)
foreach ($q in $tf2) { $cards += ,@($tf, $q[0], $q[1]) }

# --- Fill in the Blanks Set 1 ---
$fib = "Concept Checks — Fill in the Blanks"
$fib1 = @(
  @('________ is the process that breaks down a molecule using water.', '<strong>Hydrolysis</strong>'),
  @('________ reactions join smaller molecules to form larger ones.', '<strong>Condensation</strong>'),
  @('________ are the main energy source for the body.', '<strong>Carbohydrates</strong>'),
  @('________ are made up of amino acids.', '<strong>Proteins</strong>'),
  @('A ________ is formed by three fatty acids and glycerol.', '<strong>Triglyceride</strong>'),
  @('A ________ is a chain of amino acids.', '<strong>Polypeptide</strong>'),
  @('Proteins lose their ________ when they denature.', '<strong>3D conformation</strong>'),
  @('________ is the building block of proteins.', '<strong>Amino acid</strong>'),
  @('________ are insoluble in water and used for energy storage.', '<strong>Lipids</strong>'),
  @("A protein's specific function depends on its ________.", '<strong>3D conformation</strong>'),
  @('________ reactions are required to break down triglycerides.', '<strong>Hydrolysis</strong>'),
  @('________ is the process that forms a dipeptide from two amino acids.', '<strong>Condensation</strong>'),
  @('________ are organic molecules that include sugars and starches.', '<strong>Carbohydrates</strong>'),
  @('________ refers to the loss of a protein's functional shape.', '<strong>Denature</strong>'),
  @('________ are used to build tissues and enzymes in the body.', '<strong>Proteins</strong>')
)
foreach ($q in $fib1) { $cards += ,@($fib, $q[0], $q[1]) }

# --- Fill in the Blanks Set 2 ---
$fib2 = @(
  @('The main carbohydrate stored in animals is ________.', '<strong>Glycogen</strong>'),
  @('________ is the carbohydrate stored in plant cell walls.', '<strong>Cellulose</strong>'),
  @('Milk contains ________, a disaccharide.', '<strong>Lactose</strong>'),
  @('________ are used to speed up chemical reactions in the body.', '<strong>Enzymes</strong>'),
  @('The stored form of glucose in plants is ________.', '<strong>Starch</strong>'),
  @('________ is a monosaccharide that provides quick energy.', '<strong>Glucose</strong>'),
  @('The main lipid component of cell membranes is ________.', '<strong>Phospholipids</strong>'),
  @('________ is a carbohydrate found in fruits.', '<strong>Fructose</strong>'),
  @('Proteins are essential for ________ and repair of tissues.', '<strong>Growth</strong>'),
  @('________ is a lipid used for energy storage and insulation.', '<strong>Triglycerides</strong>'),
  @('________ is a carbohydrate used by athletes for quick energy.', '<strong>Glucose</strong>'),
  @('________ is the storage carbohydrate in the liver and muscles.', '<strong>Glycogen</strong>'),
  @('________ is the carbohydrate found in milk.', '<strong>Lactose</strong>'),
  @('________ are the building blocks of proteins.', '<strong>Amino acids</strong>')
)
foreach ($q in $fib2) { $cards += ,@($fib, $q[0], $q[1]) }

# Build JS
$lines = @(
  '/** Ch 5 Food and Nutrition — flashcard deck (from desktop teaching sources) */',
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
