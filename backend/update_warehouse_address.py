from app.modules.delivery.delhivery_client import delhivery_client
import json

def fix_warehouse():
    print("Attempting to update warehouse 'sevenxt' with Chennai GPO (600001) address for TESTING...")
    
    # Using Chennai GPO Pincode 600001 which is usually supported in staging
    try:
        response = delhivery_client.create_warehouse(
            name="sevenxt",
            address="No 1, Rajaji Salai, George Town",
            city="Chennai",
            state="Tamil Nadu",
            pin="600001",
            phone="9363286257",
            email="loguloges77@gmail.com",
            contact_person="Manager"
        )
        
        print("\n✅ API Response:")
        print(json.dumps(response, indent=2))
        
        if response.get('success') or response.get('data', {}).get('success'):
            print("\nSUCCESS! Warehouse 'sevenxt' updated with Test Chennai Address (600001).")
            print("Please try generating a new AWB label now.")
        else:
            print("\nWARNING: Response does not indicate clear success. Check message above.")
            
    except Exception as e:
        print(f"\n❌ Error updating warehouse: {e}")

if __name__ == "__main__":
    fix_warehouse()
