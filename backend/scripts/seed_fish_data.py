#!/usr/bin/env python3
"""
Fish Catalog Database Seeder

This script populates the fish_catalog table with popular aquarium fish species.
Run this script to seed your database with initial fish data.

Usage (from project root):
    python backend/scripts/seed_fish_data.py
"""

import sys
import os

# Add the project root to Python path
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, project_root)

from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models.fish_model import Fish, FishCreate
from backend.services.fish_service import FishService
from backend.config import settings

# Create a local database session for scripts
def get_local_db_session():
    """Get database session with localhost connection for local script execution"""
    # Replace docker hostname with localhost for local script execution
    local_db_url = settings.DATABASE_URL.replace("postgres-db", "localhost")
    
    print(f"🔗 Connecting to database: {local_db_url.replace(settings.POSTGRES_PASSWORD, '***')}")
    
    engine = create_engine(local_db_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables if they don't exist
    from backend.db.base import Base
    Base.metadata.create_all(bind=engine)
    
    return SessionLocal()

# Popular Freshwater Fish
FRESHWATER_FISH = [
    # Tetras
    {"name": "Neon Tetra", "image_url": "/static/images/fish/freshwater/neon_tetra.jpg", "water_type": "freshwater"},
    {"name": "Cardinal Tetra", "image_url": "/static/images/fish/freshwater/cardinal_tetra.jpg", "water_type": "freshwater"},
    {"name": "Black Skirt Tetra", "image_url": "/static/images/fish/freshwater/black_skirt_tetra.jpg", "water_type": "freshwater"},
    {"name": "Serpae Tetra", "image_url": "/static/images/fish/freshwater/serpae_tetra.jpg", "water_type": "freshwater"},
    
    # Livebearers
    {"name": "Guppy", "image_url": "/static/images/fish/freshwater/guppy.jpg", "water_type": "freshwater"},
    {"name": "Molly", "image_url": "/static/images/fish/freshwater/black_molly.jpg", "water_type": "freshwater"},
    {"name": "Platy", "image_url": "/static/images/fish/freshwater/southern_platy.jpg", "water_type": "freshwater"},
    {"name": "Swordtail", "image_url": "/static/images/fish/freshwater/green_swordtail.jpg", "water_type": "freshwater"},
    
    # Bettas
    {"name": "Betta Fish", "image_url": "/static/images/fish/freshwater/veiltail_betta.jpg", "water_type": "freshwater"},
    {"name": "Crown Tail Betta", "image_url": "/static/images/fish/freshwater/crown_tail_betta.jpg", "water_type": "freshwater"},
    
    # Cichlids
    {"name": "Angelfish", "image_url": "/static/images/fish/freshwater/freshwater_angelfish.jpg", "water_type": "freshwater"},
    {"name": "Discus", "image_url": "/static/images/fish/freshwater/discus.jpg", "water_type": "freshwater"},
    {"name": "German Blue Ram", "image_url": "/static/images/fish/freshwater/german_blue_ram.jpg", "water_type": "freshwater"},
    
    # Catfish
    {"name": "Corydoras Catfish", "image_url": "/static/images/fish/freshwater/corydoras_catfish.jpg", "water_type": "freshwater"},
    {"name": "Bristlenose Pleco", "image_url": "/static/images/fish/freshwater/bristlenose_pleco.jpg", "water_type": "freshwater"},
    {"name": "Glass Catfish", "image_url": "/static/images/fish/freshwater/glass_catfish.jpg", "water_type": "freshwater"},
    
    # Danios and Barbs
    {"name": "Zebra Danio", "image_url": "/static/images/fish/freshwater/zebra_danio.jpg", "water_type": "freshwater"},
    {"name": "Pearl Danio", "image_url": "/static/images/fish/freshwater/pearl_danio.jpg", "water_type": "freshwater"},
    {"name": "Tiger Barb", "image_url": "/static/images/fish/freshwater/tiger_barb.jpg", "water_type": "freshwater"},
    {"name": "Cherry Barb", "image_url": "/static/images/fish/freshwater/cherry_barb.jpg", "water_type": "freshwater"},
    
    # Goldfish
    {"name": "Goldfish", "image_url": "/static/images/fish/freshwater/goldfish.jpg", "water_type": "freshwater"},
    {"name": "Fancy Goldfish", "image_url": "/static/images/fish/freshwater/fancy_goldfish.jpg", "water_type": "freshwater"},
]

# Popular Saltwater Fish
SALTWATER_FISH = [
    # Clownfish
    {"name": "Ocellaris Clownfish", "image_url": "/static/images/fish/saltwater/ocellaris_clownfish.jpg", "water_type": "saltwater"},
    {"name": "Percula Clownfish", "image_url": "/static/images/fish/saltwater/percula_cownfish.jpg", "water_type": "saltwater"},
    {"name": "Maroon Clownfish", "image_url": "/static/images/fish/saltwater/maroon_clownfish.jpg", "water_type": "saltwater"},
    
    # Tangs
    {"name": "Blue Tang", "image_url": "/static/images/fish/saltwater/blue_tang.jpg", "water_type": "saltwater"},
    {"name": "Yellow Tang", "image_url": "/static/images/fish/saltwater/yellow_tang.webp", "water_type": "saltwater"},
    {"name": "Powder Blue Tang", "image_url": "/static/images/fish/saltwater/powder_blue_tang.jpg", "water_type": "saltwater"},
    
    # Marine Angelfish
    {"name": "Queen Angelfish", "image_url": "/static/images/fish/saltwater/queen_angelfish.jpg", "water_type": "saltwater"},
    {"name": "French Angelfish", "image_url": "/static/images/fish/saltwater/french_angelfish.jpg", "water_type": "saltwater"},
    {"name": "Flame Angelfish", "image_url": "/static/images/fish/saltwater/flame_angelfish.jpg", "water_type": "saltwater"},
    
    # Gobies
    {"name": "Mandarin Goby", "image_url": "/static/images/fish/saltwater/mandarin_goby.jpg", "water_type": "saltwater"},
    {"name": "Yellow Watchman Goby", "image_url": "/static/images/fish/saltwater/yellow_watchman_goby.jpg", "water_type": "saltwater"},
    {"name": "Firefish Goby", "image_url": "/static/images/fish/saltwater/firefish_goby.jpg", "water_type": "saltwater"},
    
    # Wrasses
    {"name": "Six Line Wrasse", "image_url": "/static/images/fish/saltwater/six_line_wrasse.jpg", "water_type": "saltwater"},
    {"name": "Fairy Wrasse", "image_url": "/static/images/fish/saltwater/fairy_wrasse.jpg", "water_type": "saltwater"},
    {"name": "Cleaner Wrasse", "image_url": "/static/images/fish/saltwater/cleaner_wrasse.jpg", "water_type": "saltwater"},
    
    # Damsels
    {"name": "Blue Damsel", "image_url": "/static/images/fish/saltwater/blue_damsel.jpg", "water_type": "saltwater"},
    {"name": "Yellowtail Damsel", "image_url": "/static/images/fish/saltwater/yellowtail_damsel.jpg", "water_type": "saltwater"},
]


def seed_fish_database():
    """Seed the database with popular fish species"""
    print("🐠 Starting Fish Catalog Database Seeding...")
    
    # Get database session
    db: Session = get_local_db_session()
    
    try:
        fish_service = FishService(db)
        
        # Check if database already has fish
        existing_count = fish_service.get_count()
        if existing_count > 0:
            print(f"⚠️  Database already contains {existing_count} fish. Skipping seeding.")
            print("   Delete existing fish first if you want to re-seed.")
            return
        
        # Seed freshwater fish
        print("\n🌊 Adding Freshwater Fish...")
        for fish_data in FRESHWATER_FISH:
            try:
                fish_create = FishCreate(**fish_data)
                created_fish = fish_service.create(fish_create)
                print(f"   ✅ Added: {created_fish.name}")
            except Exception as e:
                print(f"   ❌ Failed to add {fish_data['name']}: {str(e)}")
        
        # Seed saltwater fish
        print("\n🌊 Adding Saltwater Fish...")
        for fish_data in SALTWATER_FISH:
            try:
                fish_create = FishCreate(**fish_data)
                created_fish = fish_service.create(fish_create)
                print(f"   ✅ Added: {created_fish.name}")
            except Exception as e:
                print(f"   ❌ Failed to add {fish_data['name']}: {str(e)}")
        
        # Print summary
        final_count = fish_service.get_count()
        print("\n🎉 Database seeding completed!")
        print(f"   Total fish in catalog: {final_count}")
        print(f"   Freshwater fish: {len(FRESHWATER_FISH)}")
        print(f"   Saltwater fish: {len(SALTWATER_FISH)}")
        
    except Exception as e:
        print(f"❌ Database seeding failed: {str(e)}")
        raise
    finally:
        db.close()


def clear_fish_database():
    """Clear all fish from the database (for development use)"""
    print("🗑️  Clearing Fish Catalog Database...")
    
    # Get database session
    db: Session = get_local_db_session()
    
    try:
        # Delete all fish
        deleted_count = db.query(Fish).delete()
        db.commit()
        
        print(f"✅ Deleted {deleted_count} fish from database")
        
    except Exception as e:
        print(f"❌ Failed to clear database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Fish Catalog Database Seeder")
    parser.add_argument("--clear", action="store_true", help="Clear existing fish data before seeding")
    parser.add_argument("--clear-only", action="store_true", help="Only clear existing fish data (don't seed)")
    
    args = parser.parse_args()
    
    try:
        if args.clear or args.clear_only:
            clear_fish_database()
        
        if not args.clear_only:
            seed_fish_database()
            
    except Exception as e:
        print(f"\n💥 Script failed: {str(e)}")
        sys.exit(1) 