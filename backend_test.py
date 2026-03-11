#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, date, timedelta

class BarberShopAPITester:
    def __init__(self, base_url="https://marcoss-chamberil.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.text
                    print(f"   Error: {error_data[:200]}...")
                    self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                except:
                    self.failed_tests.append(f"{name}: Status code mismatch")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET", 
            "",
            200
        )

    def test_services_endpoint(self):
        """Test get services endpoint"""
        success, response = self.run_test(
            "Get Services",
            "GET",
            "services",
            200
        )
        
        if success and 'services' in response:
            services = response['services']
            print(f"   Found {len(services)} services")
            # Verify service structure
            required_fields = ['id', 'name', 'price', 'duration']
            if services and all(all(field in service for field in required_fields) for service in services):
                print("   ✅ Service structure is valid")
            else:
                print("   ❌ Invalid service structure")
                return False, response
                
        return success, response

    def test_available_slots(self, test_date=None):
        """Test available slots endpoint"""
        if not test_date:
            # Use tomorrow's date (Monday-Saturday)
            tomorrow = datetime.now().date() + timedelta(days=1)
            # If tomorrow is Sunday (weekday 6), use Monday instead
            if tomorrow.weekday() == 6:
                tomorrow = tomorrow + timedelta(days=1)
            test_date = tomorrow.strftime("%Y-%m-%d")
        
        success, response = self.run_test(
            f"Get Available Slots for {test_date}",
            "GET",
            f"available-slots/{test_date}",
            200
        )
        
        if success:
            if 'available_slots' in response:
                slots = response['available_slots']
                print(f"   Found {len(slots)} available slots")
                if response.get('is_closed'):
                    print("   Business is closed on this day")
                return True, response
            else:
                print("   ❌ Missing 'available_slots' in response")
                return False, response
        
        return success, response

    def test_sunday_closed(self):
        """Test that Sunday returns closed status"""
        # Find next Sunday
        today = datetime.now().date()
        days_until_sunday = (6 - today.weekday()) % 7
        if days_until_sunday == 0:  # Today is Sunday
            sunday = today
        else:
            sunday = today + timedelta(days=days_until_sunday)
        
        sunday_str = sunday.strftime("%Y-%m-%d")
        
        success, response = self.run_test(
            f"Test Sunday Closed ({sunday_str})",
            "GET",
            f"available-slots/{sunday_str}",
            200
        )
        
        if success and response.get('is_closed') == True:
            print("   ✅ Sunday correctly marked as closed")
            return True, response
        elif success:
            print("   ❌ Sunday should be marked as closed")
            return False, response
        
        return success, response

    def test_create_appointment(self):
        """Test create appointment endpoint"""
        # First get tomorrow's available slots
        tomorrow = datetime.now().date() + timedelta(days=1)
        # If tomorrow is Sunday, use Monday
        if tomorrow.weekday() == 6:
            tomorrow = tomorrow + timedelta(days=1)
        
        date_str = tomorrow.strftime("%Y-%m-%d")
        
        # Get available slots first
        slots_success, slots_response = self.test_available_slots(date_str)
        if not slots_success or not slots_response.get('available_slots'):
            print("   ❌ No available slots to test appointment creation")
            return False, {}
        
        # Use first available slot
        time_slot = slots_response['available_slots'][0]
        
        appointment_data = {
            "service": "Corte de pelo",
            "service_price": 15.00,
            "client_name": f"Test Cliente {datetime.now().strftime('%H%M%S')}",
            "client_phone": "612345678",
            "client_email": "test@example.com",
            "appointment_date": date_str,
            "appointment_time": time_slot
        }
        
        success, response = self.run_test(
            "Create Appointment",
            "POST",
            "appointments",
            200,
            data=appointment_data
        )
        
        if success and 'id' in response:
            print(f"   ✅ Appointment created with ID: {response['id']}")
            return True, response
        
        return success, response

    def test_get_appointments(self):
        """Test get appointments endpoint"""
        return self.run_test(
            "Get Appointments",
            "GET",
            "appointments",
            200
        )

    def test_business_info(self):
        """Test business info endpoint"""
        success, response = self.run_test(
            "Get Business Info",
            "GET",
            "business-info",
            200
        )
        
        if success:
            required_fields = ['name', 'address', 'phone', 'hours']
            if all(field in response for field in required_fields):
                print("   ✅ Business info contains required fields")
            else:
                print("   ❌ Missing required business info fields")
                return False, response
        
        return success, response

    def test_invalid_date_format(self):
        """Test invalid date format handling"""
        return self.run_test(
            "Invalid Date Format",
            "GET",
            "available-slots/invalid-date",
            400
        )

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Barbershop API Tests")
        print("=" * 50)
        
        # Test basic endpoints
        self.test_root_endpoint()
        self.test_services_endpoint()
        self.test_business_info()
        
        # Test availability endpoints
        self.test_available_slots()
        self.test_sunday_closed()
        self.test_invalid_date_format()
        
        # Test appointment endpoints
        self.test_create_appointment()
        self.test_get_appointments()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for failed_test in self.failed_tests:
                print(f"   - {failed_test}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"Success rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = BarberShopAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())