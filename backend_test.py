#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class DigitalBadgeAPITester:
    def __init__(self, base_url="http://127.0.0.1:8000"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(response_data) <= 5:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list) and len(response_data) <= 3:
                        print(f"   Response: {len(response_data)} items")
                except:
                    pass
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text[:200]}")

            return success, response.json() if response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "", 200)

    def test_login(self, email="admin@example.com", password="admin123"):
        """Test login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success:
            # Check if we got cookies (httpOnly) or token in response
            print(f"   Login successful for: {response.get('email', 'unknown')}")
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        return self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_dashboard_stats(self):
        """Test dashboard stats"""
        success, response = self.run_test("Dashboard Stats", "GET", "dashboard/stats", 200)
        if success:
            stats = response
            print(f"   Recipients: {stats.get('total_recipients', 0)}")
            print(f"   Templates: {stats.get('total_templates', 0)}")
            print(f"   Credentials: {stats.get('total_issued', 0)}")
            print(f"   Verified: {stats.get('total_verified', 0)}")
        return success, response

    def test_recipients_crud(self):
        """Test recipients CRUD operations"""
        print("\n📋 Testing Recipients CRUD...")
        
        # List recipients
        success, recipients = self.run_test("List Recipients", "GET", "recipients", 200)
        if not success:
            return False
        
        initial_count = len(recipients)
        print(f"   Found {initial_count} existing recipients")
        
        # Create recipient
        test_recipient = {
            "full_name": "Test User",
            "email": f"test.user.{int(time.time())}@example.com",
            "phone": "+1234567890",
            "organization": "Test Org",
            "department": "Testing",
            "course_name": "Test Course"
        }
        
        success, created = self.run_test("Create Recipient", "POST", "recipients", 200, test_recipient)
        if not success:
            return False
        
        recipient_id = created.get('id')
        if not recipient_id:
            print("❌ No recipient ID returned")
            return False
        
        # Get specific recipient
        success, _ = self.run_test("Get Recipient", "GET", f"recipients/{recipient_id}", 200)
        if not success:
            return False
        
        # Update recipient
        update_data = {"full_name": "Updated Test User"}
        success, _ = self.run_test("Update Recipient", "PUT", f"recipients/{recipient_id}", 200, update_data)
        if not success:
            return False
        
        # Delete recipient
        success, _ = self.run_test("Delete Recipient", "DELETE", f"recipients/{recipient_id}", 200)
        return success

    def test_templates_crud(self):
        """Test templates CRUD operations"""
        print("\n📄 Testing Templates CRUD...")
        
        # List templates
        success, templates = self.run_test("List Templates", "GET", "templates", 200)
        if not success:
            return False
        
        initial_count = len(templates)
        print(f"   Found {initial_count} existing templates")
        
        # Create certificate template
        test_template = {
            "template_name": "Test Certificate",
            "template_type": "certificate",
            "issuer_name": "Test University",
            "title": "Test Certificate of Completion",
            "description": "Test certificate description",
            "signature_name": "Dr. Test",
            "signature_title": "Dean of Testing"
        }
        
        success, created = self.run_test("Create Template", "POST", "templates", 200, test_template)
        if not success:
            return False
        
        template_id = created.get('id')
        if not template_id:
            print("❌ No template ID returned")
            return False
        
        # Get specific template
        success, _ = self.run_test("Get Template", "GET", f"templates/{template_id}", 200)
        if not success:
            return False
        
        # Update template
        update_data = {"title": "Updated Test Certificate"}
        success, _ = self.run_test("Update Template", "PUT", f"templates/{template_id}", 200, update_data)
        if not success:
            return False
        
        # Delete template
        success, _ = self.run_test("Delete Template", "DELETE", f"templates/{template_id}", 200)
        return success

    def test_credentials_workflow(self):
        """Test credential issuance workflow"""
        print("\n🏆 Testing Credentials Workflow...")
        
        # Get recipients and templates for issuing
        success, recipients = self.run_test("Get Recipients for Credential", "GET", "recipients", 200)
        if not success or not recipients:
            print("❌ No recipients available for testing")
            return False
        
        success, templates = self.run_test("Get Templates for Credential", "GET", "templates", 200)
        if not success or not templates:
            print("❌ No templates available for testing")
            return False
        
        # Issue credential
        credential_data = {
            "recipient_id": recipients[0]['id'],
            "template_id": templates[0]['id'],
            "credential_title": "Test Credential",
            "issuer_name": "Test Issuer"
        }
        
        success, issued = self.run_test("Issue Credential", "POST", "credentials", 200, credential_data)
        if not success:
            return False
        
        credential_id = issued.get('id')
        credential_code = issued.get('credential_code')
        
        if not credential_id or not credential_code:
            print("❌ Missing credential ID or code")
            return False
        
        print(f"   Issued credential: {credential_code}")
        
        # List credentials
        success, credentials = self.run_test("List Credentials", "GET", "credentials", 200)
        if not success:
            return False
        
        # Get specific credential
        success, _ = self.run_test("Get Credential", "GET", f"credentials/{credential_id}", 200)
        if not success:
            return False
        
        # Test verification
        success, verification = self.run_test("Verify Credential", "GET", f"verify/{credential_code}", 200)
        if success:
            print(f"   Verification result: {verification.get('valid', False)}")
        
        # Test revoke credential
        success, _ = self.run_test("Revoke Credential", "POST", f"credentials/{credential_id}/revoke", 200)
        if not success:
            return False
        
        # Test activate credential
        success, _ = self.run_test("Activate Credential", "POST", f"credentials/{credential_id}/activate", 200)
        return success

    def test_verification_logs(self):
        """Test verification logs"""
        return self.run_test("Get Verification Logs", "GET", "verification-logs", 200)

    def test_csv_exports(self):
        """Test CSV export functionality"""
        print("\n📊 Testing CSV Exports...")
        
        # Test recipients export
        success, _ = self.run_test("Export Recipients CSV", "GET", "recipients/export/csv", 200)
        if not success:
            return False
        
        # Test credentials export
        success, _ = self.run_test("Export Credentials CSV", "GET", "credentials/export/csv", 200)
        return success

    def test_logout(self):
        """Test logout"""
        return self.run_test("Logout", "POST", "auth/logout", 200)

def main():
    print("🚀 Starting Digital Badge & Certification System API Tests")
    print("=" * 60)
    
    tester = DigitalBadgeAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("Admin Login", tester.test_login),
        ("Get Current User", tester.test_get_me),
        ("Dashboard Stats", tester.test_dashboard_stats),
        ("Recipients CRUD", tester.test_recipients_crud),
        ("Templates CRUD", tester.test_templates_crud),
        ("Credentials Workflow", tester.test_credentials_workflow),
        ("Verification Logs", tester.test_verification_logs),
        ("CSV Exports", tester.test_csv_exports),
        ("Logout", tester.test_logout),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            result = test_func()
            if isinstance(result, tuple):
                success = result[0]
            else:
                success = result
            
            if not success:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print(f"\n{'='*60}")
    print(f"📊 Test Results Summary")
    print(f"{'='*60}")
    print(f"Total Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%" if tester.tests_run > 0 else "0%")
    
    if failed_tests:
        print(f"\n❌ Failed Test Categories:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ All test categories passed!")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())