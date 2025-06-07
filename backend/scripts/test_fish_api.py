#!/usr/bin/env python3
"""
Fish API Test Script

This script tests the fish catalog API endpoints to ensure they're working correctly.

Usage (from project root):
    python backend/scripts/test_fish_api.py
"""

import requests
import json
import sys


BASE_URL = "http://localhost:8000/api/fish"


def test_fish_endpoints():
    """Test all fish API endpoints"""
    print("🧪 Testing Fish Catalog API Endpoints...")
    
    try:
        # Test 1: Get all fish
        print("\n1️⃣ Testing GET /api/fish/")
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            fish_list = response.json()
            print(f"   ✅ Success! Found {len(fish_list)} fish in catalog")
            if fish_list:
                print(f"   📝 Sample fish: {fish_list[0]['name']}")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text}")
        
        # Test 2: Get fish count
        print("\n2️⃣ Testing GET /api/fish/count")
        response = requests.get(f"{BASE_URL}/count")
        if response.status_code == 200:
            count_data = response.json()
            print(f"   ✅ Success! Fish count: {count_data['count']}")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text}")
        
        # Test 3: Search fish
        print("\n3️⃣ Testing GET /api/fish/search?q=tetra")
        response = requests.get(f"{BASE_URL}/search", params={"q": "tetra"})
        if response.status_code == 200:
            search_results = response.json()
            print(f"   ✅ Success! Found {len(search_results)} fish matching 'tetra'")
            for fish in search_results[:3]:  # Show first 3 results
                print(f"      - {fish['name']}")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text}")
        
        # Test 4: Get specific fish by name
        print("\n4️⃣ Testing GET /api/fish/name/Neon Tetra")
        fish_name = "Neon Tetra"
        response = requests.get(f"{BASE_URL}/name/{fish_name}")
        if response.status_code == 200:
            fish_data = response.json()
            print(f"   ✅ Success! Found fish: {fish_data['name']}")
            print(f"      Image URL: {fish_data['image_url']}")
        elif response.status_code == 404:
            print(f"   ⚠️  Fish '{fish_name}' not found (404)")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text}")
        
        # Test 5: Get fish by ID
        print("\n5️⃣ Testing GET /api/fish/1")
        response = requests.get(f"{BASE_URL}/1")
        if response.status_code == 200:
            fish_data = response.json()
            print(f"   ✅ Success! Fish ID 1: {fish_data['name']}")
        elif response.status_code == 404:
            print(f"   ⚠️  Fish with ID 1 not found (404)")
        else:
            print(f"   ❌ Failed: {response.status_code} - {response.text}")
        
        # Test 6: Create new fish (POST)
        print("\n6️⃣ Testing POST /api/fish/")
        test_fish = {
            "name": "Test Fish API",
            "image_url": "/static/images/fish/test_fish.jpg"
        }
        response = requests.post(BASE_URL, json=test_fish)
        if response.status_code == 200:
            created_fish = response.json()
            test_fish_id = created_fish['id']
            print(f"   ✅ Success! Created fish: {created_fish['name']} (ID: {test_fish_id})")
            
            # Test 7: Update the test fish (PUT)
            print(f"\n7️⃣ Testing PUT /api/fish/{test_fish_id}")
            updated_fish_data = {
                "name": "Updated Test Fish API",
                "image_url": "/static/images/fish/updated_test_fish.jpg"
            }
            response = requests.put(f"{BASE_URL}/{test_fish_id}", json=updated_fish_data)
            if response.status_code == 200:
                updated_fish = response.json()
                print(f"   ✅ Success! Updated fish: {updated_fish['name']}")
            else:
                print(f"   ❌ Failed: {response.status_code} - {response.text}")
            
            # Test 8: Delete the test fish (DELETE)
            print(f"\n8️⃣ Testing DELETE /api/fish/{test_fish_id}")
            response = requests.delete(f"{BASE_URL}/{test_fish_id}")
            if response.status_code == 200:
                delete_result = response.json()
                print(f"   ✅ Success! Deleted fish: {delete_result['status']}")
            else:
                print(f"   ❌ Failed: {response.status_code} - {response.text}")
        else:
            print(f"   ❌ Failed to create test fish: {response.status_code} - {response.text}")
        
        print("\n🎉 Fish API testing completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the backend server running on http://localhost:8000?")
        print("   Start the server with: uvicorn main:app --reload")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        sys.exit(1)


def test_static_file_access():
    """Test if static files are accessible"""
    print("\n🖼️ Testing Static File Access...")
    
    # Test accessing a fish image (may not exist, but should not return 404 for /static path)
    test_image_url = "http://localhost:8000/static/images/fish/freshwater/tetras/neon_tetra.jpg"
    
    try:
        response = requests.get(test_image_url)
        if response.status_code == 200:
            print(f"   ✅ Static file access working! Image found.")
        elif response.status_code == 404:
            print(f"   ⚠️  Static file path working, but image not found (expected for now)")
            print(f"   📝 To add images, place them in: backend/static/images/fish/")
        else:
            print(f"   ❌ Static file access issue: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error testing static files: {str(e)}")


if __name__ == "__main__":
    print("🐠 AquaLife Fish Catalog API Tester")
    print("=" * 50)
    
    # Test API endpoints
    test_fish_endpoints()
    
    # Test static file access
    test_static_file_access()
    
    print("\n📚 Next Steps:")
    print("1. Add actual fish images to backend/static/images/fish/")
    print("2. Run the seeding script: python scripts/seed_fish_data.py")
    print("3. Test the frontend fish selection component")
    print("4. Integrate with AI service for compatibility analysis") 