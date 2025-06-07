# 🐠 Fish Image Storage

This directory contains fish images for the AquaLife catalog.

## 📁 Directory Structure

```
fish/
├── freshwater/          # Freshwater fish images
│   ├── tetras/         # Tetra family fish
│   ├── cichlids/       # Cichlid family fish
│   ├── livebearers/    # Guppies, mollies, platies, etc.
│   ├── catfish/        # Corydoras, plecos, etc.
│   └── bettas/         # Betta fish varieties
├── saltwater/          # Saltwater/marine fish images
│   ├── tangs/          # Tang fish
│   ├── angelfish/      # Marine angelfish
│   ├── clownfish/      # Clownfish varieties
│   ├── gobies/         # Goby fish
│   └── wrasses/        # Wrasse fish
└── README.md           # This file
```

## 🖼️ Image Guidelines

### File Naming Convention
- Use lowercase letters
- Replace spaces with underscores
- Use descriptive names
- Format: `species_name.jpg`

**Examples:**
- `neon_tetra.jpg`
- `cardinal_tetra.jpg`
- `blue_tang.jpg`
- `clown_fish.jpg`

### Image Requirements
- **Format**: JPG or PNG (JPG preferred for smaller file size)
- **Size**: Recommended 400x300px (4:3 aspect ratio)
- **Quality**: Good resolution, clear fish image
- **Background**: Preferably aquarium environment
- **File Size**: < 500KB per image

## 🔗 URL Structure

Images are accessible via HTTP at:
```
http://localhost:8000/static/images/fish/{category}/{filename}

Examples:
- http://localhost:8000/static/images/fish/freshwater/tetras/neon_tetra.jpg
- http://localhost:8000/static/images/fish/saltwater/clownfish/clown_fish.jpg
```

## 📊 Database Integration

When adding fish to the database, the `image_url` field should contain the relative path:
```
/static/images/fish/freshwater/tetras/neon_tetra.jpg
```

The fish service will automatically generate this URL format if no image_url is provided.

## 🎯 Popular Fish Categories

### Freshwater Fish
1. **Tetras**: Neon, Cardinal, Black Skirt, Serpae
2. **Cichlids**: Angelfish, Discus, African Cichlids
3. **Livebearers**: Guppies, Mollies, Platies, Swordtails
4. **Catfish**: Corydoras, Plecos, Glass Catfish
5. **Bettas**: Various tail types and colors
6. **Goldfish**: Varieties and fancy types
7. **Danios**: Zebra, Pearl, Giant
8. **Barbs**: Tiger, Cherry, Rosy

### Saltwater Fish
1. **Clownfish**: Ocellaris, Percula, Maroon
2. **Tangs**: Blue, Yellow, Powder Blue, Achilles
3. **Angelfish**: Queen, French, Grey, Flame
4. **Gobies**: Mandarin, Yellow Watchman, Firefish
5. **Wrasses**: Six Line, Fairy, Cleaner
6. **Damsels**: Blue, Yellowtail, Domino
7. **Butterflyfish**: Copperband, Raccoon, Longnose

## 🛠️ Maintenance

To add new images:
1. Place image in appropriate category folder
2. Follow naming convention
3. Update database with fish entry
4. Test image URL accessibility

## 📝 Notes

- Images should be copyright-free or properly licensed
- Consider using placeholder images during development
- Optimize images for web use (compress if needed)
- Backup images regularly 