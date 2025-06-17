-- Insert products into the products table
INSERT INTO products (name, description, price, quantity, category_id, created_by) VALUES
-- Protein Powders
('Optimum Nutrition Gold Standard Whey', 'High-quality whey protein powder for muscle recovery and growth.', 29.99, 50, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('Dymatize ISO100 Hydrolyzed Protein', 'Fast-digesting hydrolyzed protein for post-workout recovery.', 34.99, 30, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('BSN Syntha-6 Protein Powder', 'Delicious protein blend for sustained muscle support.', 27.99, 40, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('MusclePharm Combat Protein Powder', 'Five-protein blend for extended amino acid release.', 32.99, 25, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('Isopure Zero Carb Protein Powder', 'Zero-carb protein powder for lean muscle building.', 39.99, 20, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('Rule NULL R1 Protein', 'Premium whey isolate and hydrolysate for clean nutrition.', 31.99, 35, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('Ghost Whey Protein', 'Unique flavors and high-quality protein for fitness enthusiasts.', 44.99, 15, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('MyProtein Impact Whey Isolate', 'Pure whey isolate for effective muscle recovery.', 24.99, 60, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('NitroTech Whey Gold', 'Advanced whey protein formula for muscle growth.', 28.99, 45, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),
('PEScience Select Protein', 'Blend of whey and casein for optimal muscle repair.', 34.99, 50, (SELECT id FROM categories WHERE name = 'Protein Powders'), NULL),

-- Pre-Workout
('C4 Original Pre-Workout', 'Explosive energy and focus for intense workouts.', 24.99, 40, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Alani Nu Pre-Workout', 'Balanced pre-workout formula with great taste.', 39.99, 25, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Pre JYM Pre-Workout', 'Scientifically advanced pre-workout for performance.', 37.99, 30, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Ghost Legend Pre-Workout', 'Legendary energy and focus for peak performance.', 44.99, 20, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Cellucor C4 Ripped', 'Pre-workout with fat-burning ingredients.', 29.99, 35, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Beyond Raw LIT Pre-Workout', 'Clinically dosed pre-workout for advanced athletes.', 39.99, 25, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Redcon1 Total War', 'Intense pre-workout for extreme energy and focus.', 34.99, 40, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Optimum Nutrition Amino Energy', 'Energy and amino acids for pre-workout or anytime.', 22.99, 50, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('Kaged Muscle Pre-Kaged', 'Premium pre-workout with organic caffeine.', 39.99, 30, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),
('RSP Nutrition AminoLean', 'Energy and focus with added amino acids.', 19.99, 60, (SELECT id FROM categories WHERE name = 'Pre-Workout'), NULL),

-- Post-Workout
('Xtend Original BCAA', 'BCAA formula for muscle recovery and hydration.', 19.99, 60, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('MuscleTech Cell-Tech Creatine', 'Advanced creatine formula for strength and recovery.', 29.99, 35, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Optimum Nutrition Glutamine Powder', 'Pure glutamine for muscle recovery and immune support.', 14.99, 50, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('BSN Amino X', 'Effervescent amino acid formula for recovery.', 21.99, 45, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Evlution Nutrition Recover Mode', 'Comprehensive recovery formula with BCAAs.', 24.99, 40, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Kaged Muscle Re-Kaged', 'Post-workout protein and recovery formula.', 39.99, 25, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Rule R1 Train BCAAs', 'BCAA blend for hydration and recovery.', 29.99, 30, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Ghost BCAA', 'Delicious BCAA formula for muscle recovery.', 34.99, 20, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('Scivation Xtend Elite', 'Elite BCAA formula with added performance ingredients.', 39.99, 15, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),
('NutraBio Reload Recovery Matrix', 'Advanced recovery matrix for post-workout.', 44.99, 10, (SELECT id FROM categories WHERE name = 'Post-Workout'), NULL),

-- Amino Acids
('Optimum Nutrition Essential Amino Energy', 'Boosts energy and recovery.', 24.99, 150, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('Scivation Xtend BCAA', 'Supports muscle recovery and hydration.', 29.99, 180, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('Cellucor Alpha Amino', 'Advanced BCAA and hydration formula.', 27.99, 140, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('BPI Sports Best BCAA', 'Unique peptide-linked BCAAs.', 26.99, 160, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('MuscleTech Amino Build Next Gen', 'Performance-enhancing amino acid formula.', 32.99, 120, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('EVLUTION NUTRITION BCAA5000', '5g BCAA per serving for recovery.', 23.99, 200, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('Gaspari AminoLast', 'Recovery and endurance BCAA super fuel.', 31.99, 100, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('Kaged Muscle BCAA 2:1:1', 'Fermented BCAAs for muscle repair.', 28.99, 130, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('Rule One R1 BCAA', 'Instantized BCAAs to support recovery.', 22.99, 170, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),
('NOW Sports BCAA Powder', 'Pure amino acid support.', 19.99, 190, (SELECT id FROM categories WHERE name = 'Amino Acids'), NULL),

-- Vitamin and Minerals
('Optimum Nutrition Opti-Men', 'High-potency multivitamin for men.', 26.99, 200, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Optimum Nutrition Opti-Women', 'Comprehensive multivitamin for women.', 25.99, 180, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Animal Pak Multivitamin', 'All-in-one vitamin and mineral complex.', 34.99, 120, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Garden of Life Vitamin Code', 'Raw whole food vitamins.', 39.99, 110, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('NOW Foods Adam Multivitamin', 'Superior men’s multi.', 22.99, 160, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Rainbow Light Men’s One', 'Once-daily multivitamin for men.', 19.99, 150, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Nature’s Way Alive!', 'High-potency, food-based vitamins.', 29.99, 140, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('MuscleTech Platinum Multivitamin', 'Essential daily nutrients for athletes.', 21.99, 130, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('MegaFood Men’s One Daily', 'Organic whole food multivitamin.', 43.99, 90, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),
('Centrum Adult Multivitamin', 'Complete multivitamin for adults.', 17.99, 250, (SELECT id FROM categories WHERE name = 'Vitamins & Minerals'), NULL),

-- Weight Gainers
('Optimum Nutrition Serious Mass', 'High-calorie mass gainer.', 49.99, 100, (SELECT id FROM categories WHERE name = 'Weight Gainers'), NULL),
('BSN True Mass', 'Mass gainer for athletes.', 59.99, 90, (SELECT id FROM categories WHERE name = 'Weight Gainers'), NULL),
('Dymatize Super Mass Gainer', 'Extreme mass-building formula.', 54.99, 85, (SELECT id FROM categories WHERE name = 'Weight Gainers'), NULL),
('MuscleTech Mass Tech', 'Advanced muscle mass gainer.', 62.99, 80, (SELECT id FROM categories WHERE name = 'Weight Gainers'), NULL),
('Mutant Mass Gainer', 'High-calorie gainer for muscle growth.', 57.99, 95, (SELECT id FROM categories WHERE name = 'Weight Gainers'), NULL),

-- Fat Burners
('MuscleTech Hydroxycut Hardcore', 'Weight loss and energy boost.', 29.99, 150, (SELECT id FROM categories WHERE name = 'Fat Burners'), NULL),
('Nutrex Lipo-6 Black', 'Potent fat burner.', 34.99, 140, (SELECT id FROM categories WHERE name = 'Fat Burners'), NULL),
('EVL LeanMode', 'Stimulant-free fat burner.', 24.99, 160, (SELECT id FROM categories WHERE name = 'Fat Burners'), NULL),
('RSP Quadralean Thermogenic', 'Fat burner and metabolism booster.', 31.99, 130, (SELECT id FROM categories WHERE name = 'Fat Burners'), NULL),
('Cellucor Super HD', 'Advanced thermogenic fat burner.', 27.99, 140, (SELECT id FROM categories WHERE name = 'Fat Burners'), NULL),

-- Energy Drinks
('C4 Energy', 'Performance energy drink.', 2.49, 400, (SELECT id FROM categories WHERE name = 'Energy Drinks'), NULL),
('Bang Energy', 'Potent energy drink with BCAAs.', 2.99, 450, (SELECT id FROM categories WHERE name = 'Energy Drinks'), NULL),
('Reign Total Body Fuel', 'Performance-enhancing energy drink.', 2.79, 420, (SELECT id FROM categories WHERE name = 'Energy Drinks'), NULL),
('Monster Energy Ultra', 'Zero sugar energy boost.', 4.99, 500, (SELECT id FROM categories WHERE name = 'Energy Drinks'), NULL),
('Red Bull Energy Drink', 'Classic energy boost.', 2.49, 600, (SELECT id FROM categories WHERE name = 'Energy Drinks'), NULL),

-- Meal Replacements
('Huel Powder', 'Nutritionally complete meal.', 34.99, 100, (SELECT id FROM categories WHERE name = 'Meal Replacements'), NULL),
('Soylent Original', 'Balanced meal replacement.', 39.99, 110, (SELECT id FROM categories WHERE name = 'Meal Replacements'), NULL),
('Labrada Lean Body', 'Delicious meal replacement shake.', 42.99, 90, (SELECT id FROM categories WHERE name = 'Meal Replacements'), NULL),
('Garden of Life Organic Meal', 'Organic meal replacement.', 46.99, 95, (SELECT id FROM categories WHERE name = 'Meal Replacements'), NULL),
('Kate Farms Komplete Meal', 'Plant-based nutrition shake.', 47.99, 85, (SELECT id FROM categories WHERE name = 'Meal Replacements'), NULL),

-- Creatine
('Optimum Nutrition Micronized Creatine', 'Pure creatine monohydrate.', 22.99, 150, (SELECT id FROM categories WHERE name = 'Creatine'), NULL),
('MuscleTech Platinum Creatine', 'Ultra-pure micronized creatine.', 18.99, 160, (SELECT id FROM categories WHERE name = 'Creatine'), NULL),
('BSN Cellmass 2.0', 'Post-workout creatine formula.', 34.99, 90, (SELECT id FROM categories WHERE name = 'Creatine'), NULL),
('Cellucor Cor-Performance Creatine', 'Creatine for strength and performance.', 27.99, 120, (SELECT id FROM categories WHERE name = 'Creatine'), NULL),
('Kaged Creatine HCl', 'Highly pure creatine hydrochloride.', 29.99, 100, (SELECT id FROM categories WHERE name = 'Creatine'), NULL),

-- Testosterone Boosters
('TestoFuel', 'Natural testosterone booster.', 65.99, 80, (SELECT id FROM categories WHERE name = 'Testosterone Boosters'), NULL),
('Prime Male', 'Testosterone support complex.', 69.99, 75, (SELECT id FROM categories WHERE name = 'Testosterone Boosters'), NULL),
('EVLTest', 'Testosterone enhancer.', 34.99, 90, (SELECT id FROM categories WHERE name = 'Testosterone Boosters'), NULL),
('Nugenix Total-T', 'Men vitality booster.', 54.99, 85, (SELECT id FROM categories WHERE name = 'Testosterone Boosters'), NULL),
('Animal Stak', 'Hormone booster and test enhancer.', 49.99, 80, (SELECT id FROM categories WHERE name = 'Testosterone Boosters'), NULL),

-- Joint Support
('Universal Nutrition Animal Flex', 'Joint support supplement.', 39.99, 100, (SELECT id FROM categories WHERE name = 'Joint Support'), NULL),
('NOW Glucosamine & Chondroitin', 'Joint health complex.', 29.99, 120, (SELECT id FROM categories WHERE name = 'Joint Support'), NULL),
('Move Free Advanced', 'Glucosamine and joint support.', 32.99, 110, (SELECT id FROM categories WHERE name = 'Joint Support'), NULL),
('Doctor’s Best Glucosamine Chondroitin MSM', 'Joint support blend.', 26.99, 130, (SELECT id FROM categories WHERE name = 'Joint Support'), NULL),
('Jarrow Formulas Joint Builder', 'Comprehensive joint support.', 27.99, 100, (SELECT id FROM categories WHERE name = 'Joint Support'), NULL),

-- Omega-3 & Fish Oils
('Nordic Naturals Ultimate Omega', 'High potency omega-3.', 39.99, 100, (SELECT id FROM categories WHERE name = 'Omega-3 & Fish Oils'), NULL),
('Optimum Nutrition Fish Oil', 'Softgels with essential omega-3s.', 15.99, 140, (SELECT id FROM categories WHERE name = 'Omega-3 & Fish Oils'), NULL),
('Viva Naturals Omega-3 Fish Oil', 'High concentration EPA and DHA.', 27.99, 120, (SELECT id FROM categories WHERE name = 'Omega-3 & Fish Oils'), NULL),
('Barlean’s Fish Oil', 'Fresh catch fish oil.', 29.99, 110, (SELECT id FROM categories WHERE name = 'Omega-3 & Fish Oils'), NULL),
('Dr. Tobias Omega-3 Fish Oil', 'Triple strength omega-3s.', 24.99, 125, (SELECT id FROM categories WHERE name = 'Omega-3 & Fish Oils'), NULL),

-- Probiotics
('Align Probiotic Supplement', 'Daily digestive support.', 32.99, 100, (SELECT id FROM categories WHERE name = 'Probiotics'), NULL),
('Culturelle Daily Probiotic', 'Supports digestive and immune health.', 28.99, 110, (SELECT id FROM categories WHERE name = 'Probiotics'), NULL),
('Garden of Life Dr. Formulated Probiotics', 'Men’s daily care.', 34.99, 90, (SELECT id FROM categories WHERE name = 'Probiotics'), NULL),
('Renew Life Ultimate Flora', 'Probiotic for digestive balance.', 36.99, 85, (SELECT id FROM categories WHERE name = 'Probiotics'), NULL),
('Bio-Kult Advanced Probiotic', 'Multi-strain probiotic.', 29.99, 95, (SELECT id FROM categories WHERE name = 'Probiotics'), NULL),

-- Herbal Supplements
('KSM-66 Ashwagandha', 'Stress relief and vitality.', 24.99, 130, (SELECT id FROM categories WHERE name = 'Herbal Supplements'), NULL),
('NOW Rhodiola', 'Adaptogenic herb.', 19.99, 140, (SELECT id FROM categories WHERE name = 'Herbal Supplements'), NULL),
('Ginseng Complex', 'Energy and vitality support.', 22.99, 120, (SELECT id FROM categories WHERE name = 'Herbal Supplements'), NULL),
('Gaia Herbs Ashwagandha Root', 'Organic stress support.', 29.99, 110, (SELECT id FROM categories WHERE name = 'Herbal Supplements'), NULL),
('Nature’s Way Holy Basil', 'Stress-relieving herb.', 21.99, 115, (SELECT id FROM categories WHERE name = 'Herbal Supplements'), NULL),

-- Hydration & Electrolytes
('Liquid I.V. Hydration Multiplier', 'Electrolyte drink mix.', 24.99, 200, (SELECT id FROM categories WHERE name = 'Hydration & Electrolytes'), NULL),
('Pedialyte Electrolyte Solution', 'Rehydration support.', 7.99, 250, (SELECT id FROM categories WHERE name = 'Hydration & Electrolytes'), NULL),
('Ultima Replenisher Electrolyte Powder', 'Zero sugar electrolyte mix.', 19.99, 220, (SELECT id FROM categories WHERE name = 'Hydration & Electrolytes'), NULL),
('Nuun Sport Electrolyte Tablets', 'Electrolytes and minerals.', 22.99, 210, (SELECT id FROM categories WHERE name = 'Hydration & Electrolytes'), NULL),
('DripDrop ORS Electrolyte Powder', 'Medical-grade hydration.', 29.99, 190, (SELECT id FROM categories WHERE name = 'Hydration & Electrolytes'), NULL),

-- Sleep Aids
('ZMA by Optimum Nutrition', 'Zinc, magnesium, and vitamin B6.', 22.99, 150, (SELECT id FROM categories WHERE name = 'Sleep Aids'), NULL),
('Natrol Melatonin', 'Sleep support tablets.', 12.99, 180, (SELECT id FROM categories WHERE name = 'Sleep Aids'), NULL),
('Onnit New Mood', 'Mood and relaxation support.', 34.99, 140, (SELECT id FROM categories WHERE name = 'Sleep Aids'), NULL),
('Dr. Emil Nutrition Sleep Aid', 'Natural sleeping pills.', 26.99, 160, (SELECT id FROM categories WHERE name = 'Sleep Aids'), NULL),
('OLLY Sleep Gummies', 'Melatonin, L-Theanine blend.', 17.99, 175, (SELECT id FROM categories WHERE name = 'Sleep Aids'), NULL),

-- Immune Support
('Emergen-C Immune+', 'Vitamin C immune support.', 13.99, 300, (SELECT id FROM categories WHERE name = 'Immune Support'), NULL),
('Airborne Immune Support Gummies', 'Vitamin C and zinc formula.', 17.99, 290, (SELECT id FROM categories WHERE name = 'Immune Support'), NULL),
('Nature Made Immune Max', 'Immune-boosting vitamins.', 19.99, 280, (SELECT id FROM categories WHERE name = 'Immune Support'), NULL),
('Zarbee’s Naturals Immune Support', 'Elderberry supplement.', 22.99, 270, (SELECT id FROM categories WHERE name = 'Immune Support'), NULL),
('WellPath Defense Immune Support', 'Herbal immune booster.', 24.99, 260, (SELECT id FROM categories WHERE name = 'Immune Support'), NULL),

-- Snacks & Bars
('Quest Protein Bar', 'High-protein low-sugar bar.', 2.49, 500, (SELECT id FROM categories WHERE name = 'Snacks & Bars'), NULL),
('ONE Protein Bar', 'Delicious high-protein snack.', 2.69, 480, (SELECT id FROM categories WHERE name = 'Snacks & Bars'), NULL),
('Grenade Carb Killa', 'Low sugar high protein bar.', 2.99, 470, (SELECT id FROM categories WHERE name = 'Snacks & Bars'), NULL),
('RXBAR Whole Food Protein Bar', 'Protein bar made with real ingredients.', 2.79, 460, (SELECT id FROM categories WHERE name = 'Snacks & Bars'), NULL),
('Pure Protein Bar', 'Great tasting protein bar.', 2.59, 450, (SELECT id FROM categories WHERE name = 'Snacks & Bars'), NULL),

-- Greens & Superfoods
('Athletic Greens AG1', 'Daily comprehensive greens formula.', 89.99, 70, (SELECT id FROM categories WHERE name = 'Greens & Superfoods'), NULL),
('Amazing Grass Green Superfood', 'Organic greens powder.', 29.99, 100, (SELECT id FROM categories WHERE name = 'Greens & Superfoods'), NULL),
('Vibrant Health Green Vibrance', 'Concentrated superfood.', 49.99, 80, (SELECT id FROM categories WHERE name = 'Greens & Superfoods'), NULL),
('Organifi Green Juice', 'Superfood blend for energy.', 69.99, 90, (SELECT id FROM categories WHERE name = 'Greens & Superfoods'), NULL),
('Garden of Life Raw Organic Perfect Food', 'Raw organic greens.', 39.99, 85, (SELECT id FROM categories WHERE name = 'Greens & Superfoods'), NULL);