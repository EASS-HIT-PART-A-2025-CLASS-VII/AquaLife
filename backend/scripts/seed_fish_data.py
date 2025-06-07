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
    {"name": "Neon Tetra", "image_url": "/static/images/fish/freshwater/tetras/neon_tetra.jpg"},
    {"name": "Cardinal Tetra", "image_url": "/static/images/fish/freshwater/tetras/cardinal_tetra.jpg"},
    {"name": "Black Skirt Tetra", "image_url": "/static/images/fish/freshwater/tetras/black_skirt_tetra.jpg"},
    {"name": "Serpae Tetra", "image_url": "/static/images/fish/freshwater/tetras/serpae_tetra.jpg"},
    
    # Livebearers
    {"name": "Guppy", "image_url": "/static/images/fish/freshwater/livebearers/guppy.jpg"},
    {"name": "Molly", "image_url": "/static/images/fish/freshwater/livebearers/molly.jpg"},
    {"name": "Platy", "image_url": "/static/images/fish/freshwater/livebearers/platy.jpg"},
    {"name": "Swordtail", "image_url": "/static/images/fish/freshwater/livebearers/swordtail.jpg"},
    
    # Bettas
    {"name": "Betta Fish", "image_url": "/static/images/fish/freshwater/bettas/betta_fish.jpg"},
    {"name": "Crown Tail Betta", "image_url": "/static/images/fish/freshwater/bettas/crown_tail_beta.jpg"},
    
    # Cichlids
    {"name": "Angelfish", "image_url": "/static/images/fish/freshwater/cichlids/angelfish.jpg"},
    {"name": "Discus", "image_url": "/static/images/fish/freshwater/cichlids/discus.jpg"},
    {"name": "German Blue Ram", "image_url": "/static/images/fish/freshwater/cichlids/german_blue_ram.jpg"},
    
    # Catfish
    {"name": "Corydoras Catfish", "image_url": "/static/images/fish/freshwater/catfish/corydoras_catfish.jpg"},
    {"name": "Bristlenose Pleco", "image_url": "/static/images/fish/freshwater/catfish/bristlenose_pleco.jpg"},
    {"name": "Glass Catfish", "image_url": "/static/images/fish/freshwater/catfish/glass_catfish.jpg"},
    
    # Danios and Barbs
    {"name": "Zebra Danio", "image_url": "/static/images/fish/freshwater/danios/zebra_danio.jpg"},
    {"name": "Pearl Danio", "image_url": "/static/images/fish/freshwater/danios/pearl_danio.jpg"},
    {"name": "Tiger Barb", "image_url": "/static/images/fish/freshwater/barbs/tiger_barb.jpg"},
    {"name": "Cherry Barb", "image_url": "/static/images/fish/freshwater/barbs/cherry_barb.jpg"},
    
    # Goldfish
    {"name": "Goldfish", "image_url": "/static/images/fish/freshwater/goldfish/goldfish.jpg"},
    {"name": "Fancy Goldfish", "image_url": "/static/images/fish/freshwater/goldfish/fancy_goldfish.jpg"},
]

# Popular Saltwater Fish
SALTWATER_FISH = [
    # Clownfish
    {"name": "Ocellaris Clownfish", "image_url": "/static/images/fish/saltwater/clownfish/ocellaris_clownfish.jpg"},
    {"name": "Percula Clownfish", "image_url": "/static/images/fish/saltwater/clownfish/percula_clownfish.jpg"},
    {"name": "Maroon Clownfish", "image_url": "/static/images/fish/saltwater/clownfish/maroon_clownfish.jpg"},
    
    # Tangs
    {"name": "Blue Tang", "image_url": "/static/images/fish/saltwater/tangs/blue_tang.jpg"},
    {"name": "Yellow Tang", "image_url": "/static/images/fish/saltwater/tangs/yellow_tang.jpg"},
    {"name": "Powder Blue Tang", "image_url": "/static/images/fish/saltwater/tangs/powder_blue_tang.jpg"},
    
    # Marine Angelfish
    {"name": "Queen Angelfish", "image_url": "/static/images/fish/saltwater/angelfish/queen_angelfish.jpg"},
    {"name": "French Angelfish", "image_url": "/static/images/fish/saltwater/angelfish/french_angelfish.jpg"},
    {"name": "Flame Angelfish", "image_url": "/static/images/fish/saltwater/angelfish/flame_angelfish.jpg"},
    
    # Gobies
    {"name": "Mandarin Goby", "image_url": "/static/images/fish/saltwater/gobies/mandarin_goby.jpg"},
    {"name": "Yellow Watchman Goby", "image_url": "/static/images/fish/saltwater/gobies/yellow_watchman_goby.jpg"},
    {"name": "Firefish Goby", "image_url": "/static/images/fish/saltwater/gobies/firefish_goby.jpg"},
    
    # Wrasses
    {"name": "Six Line Wrasse", "image_url": "/static/images/fish/saltwater/wrasses/six_line_wrasse.jpg"},
    {"name": "Fairy Wrasse", "image_url": "/static/images/fish/saltwater/wrasses/fairy_wrasse.jpg"},
    {"name": "Cleaner Wrasse", "image_url": "/static/images/fish/saltwater/wrasses/cleaner_wrasse.jpg"},
    
    # Damsels
    {"name": "Blue Damsel", "image_url": "/static/images/fish/saltwater/damsels/blue_damsel.jpg"},
    {"name": "Yellowtail Damsel", "image_url": "/static/images/fish/saltwater/damsels/yellowtail_damsel.jpg"},
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
        print(f"\n🎉 Database seeding completed!")
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