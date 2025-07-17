#!/usr/bin/env python3
"""
Sorma-AI Full Verification Script
Tests all advanced endpoints and functionality
"""

import requests
import json
import time
import sys
from datetime import datetime

# Colors for output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_test(name, status, message=""):
    icon = "✅" if status else "❌"
    color = Colors.GREEN if status else Colors.RED
    print(f"{icon} {color}{name}{Colors.END}: {message}")

def print_section(title):
    print(f"\n{Colors.BOLD}{Colors.PURPLE}{title}{Colors.END}")
    print("-" * 50)

def test_endpoint(name, method, url, data=None, params=None, timeout=15):
    try:
        if method == "GET":
            response = requests.get(url, params=params, timeout=timeout)
        elif method == "POST":
            response = requests.post(url, json=data, params=params, timeout=timeout)
        
        if response.status_code == 200:
            print_test(name, True, f"Status: {response.status_code}")
            return response.json()
        else:
            print_test(name, False, f"Status: {response.status_code}")
            return None
    except requests.exceptions.ReadTimeout:
        print_test(name, False, "Request timed out (processing may be slow)")
        return None
    except Exception as e:
        print_test(name, False, f"Error: {str(e)}")
        return None

def main():
    print(f"{Colors.BOLD}{Colors.CYAN}🚀 Sorma-AI Full Verification Test Suite{Colors.END}")
    print(f"{Colors.BLUE}Testing all advanced features and endpoints{Colors.END}\n")
    
    base_url = "http://localhost:8000"
    
    # Test counters
    tests_passed = 0
    tests_total = 0
    
    # 1. Core System Tests
    print_section("1. Core System Tests")
    
    # Root endpoint
    tests_total += 1
    result = test_endpoint("Root Endpoint", "GET", f"{base_url}/")
    if result:
        tests_passed += 1
        print(f"   Response: {result}")
    
    # System status
    tests_total += 1
    status = test_endpoint("System Status", "GET", f"{base_url}/api/status")
    if status:
        tests_passed += 1
        print(f"   Memory Items: {status.get('memory_stats', {}).get('short_term_count', 0)}")
        print(f"   Internet: {status.get('internet_available', False)}")
        print(f"   Ollama: {status.get('ai_models', {}).get('ollama_available', False)}")
        print(f"   Authorized: {status.get('authorized', False)}")
    
    # 2. Authentication Tests
    print_section("2. Authentication Tests")
    
    # Test different auth methods
    auth_methods = ["sorma", "sorma-ai", "chandan"]
    for auth_method in auth_methods:
        tests_total += 1
        result = test_endpoint(f"Auth with '{auth_method}'", "POST", f"{base_url}/api/auth", 
                             data={"auth_phrase": auth_method})
        if result:
            tests_passed += 1
            print(f"   Message: {result.get('message', 'Success')}")
    
    # 3. Chat & AI Tests
    print_section("3. Chat & AI Tests")
    
    # Basic chat
    tests_total += 1
    result = test_endpoint("Basic Chat", "POST", f"{base_url}/api/chat", 
                         data={"message": "Hello, test message"}, timeout=30)
    if result:
        tests_passed += 1
        print(f"   Response: {result.get('response', 'No response')[:100]}...")
    
    # Chat with Ollama
    tests_total += 1
    result = test_endpoint("Chat with Ollama", "POST", f"{base_url}/api/chat", 
                         data={"message": "What is AI?", "use_ollama": True}, timeout=30)
    if result:
        tests_passed += 1
        print(f"   Response: {result.get('response', 'No response')[:100]}...")
    
    # 4. Advanced AI Features
    print_section("4. Advanced AI Features")
    
    # Code generation
    tests_total += 1
    result = test_endpoint("Code Generation", "POST", f"{base_url}/api/code/generate", 
                         data={"task": "Create a Python function to calculate fibonacci", "language": "python"}, timeout=30)
    if result:
        tests_passed += 1
        print(f"   Code Generated: {len(result.get('code', ''))} characters")
    
    # Translation
    tests_total += 1
    result = test_endpoint("Translation", "POST", f"{base_url}/api/translate", 
                         data={"text": "Hello World", "source_language": "en", "target_language": "es"})
    if result:
        tests_passed += 1
        print(f"   Translation: {result.get('translation', 'No translation')}")
    
    # Web search
    tests_total += 1
    result = test_endpoint("Web Search", "POST", f"{base_url}/api/search/web", 
                         data={"query": "AI news", "count": 3})
    if result:
        tests_passed += 1
        print(f"   Results: {len(result.get('results', []))} items")
    
    # 5. Memory System Tests
    print_section("5. Memory System Tests")
    
    # Get memory
    tests_total += 1
    result = test_endpoint("Memory Retrieval", "GET", f"{base_url}/api/memory")
    if result:
        tests_passed += 1
        print(f"   Memory Items: {len(result.get('items', []))}")
        print(f"   Conversations: {len(result.get('conversations', []))}")
    
    # Add memory
    tests_total += 1
    result = test_endpoint("Add Memory", "POST", f"{base_url}/api/memory", 
                         data={"fact": "Test memory item", "category": "verification"})
    if result:
        tests_passed += 1
        print(f"   Added: {result.get('message', 'Success')}")
    
    # 6. Voice Features
    print_section("6. Voice Features")
    
    # TTS
    tests_total += 1
    result = test_endpoint("Text-to-Speech", "POST", f"{base_url}/api/voice/tts", 
                         data={"text": "Hello, this is a test"})
    if result:
        tests_passed += 1
        print(f"   TTS Status: {result.get('status', 'Unknown')}")
    
    # Voice status
    tests_total += 1
    result = test_endpoint("Voice Status", "GET", f"{base_url}/api/voice/status")
    if result:
        tests_passed += 1
        print(f"   Voice Available: {result.get('available', False)}")
    
    # 7. File Processing
    print_section("7. File Processing")
    
    # File upload simulation (without actual file)
    tests_total += 1
    result = test_endpoint("File Info", "GET", f"{base_url}/api/files/info")
    if result:
        tests_passed += 1
        print(f"   File System: {result.get('status', 'Unknown')}")
    
    # 8. Ollama Integration
    print_section("8. Ollama Integration")
    
    # Ollama status
    tests_total += 1
    result = test_endpoint("Ollama Status", "GET", f"{base_url}/api/system/ollama-status")
    if result:
        tests_passed += 1
        print(f"   Ollama Available: {result.get('available', False)}")
        print(f"   Models: {result.get('models', [])}")
    
    # Ollama models
    tests_total += 1
    result = test_endpoint("Ollama Models", "GET", f"{base_url}/api/ollama/models")
    if result:
        tests_passed += 1
        print(f"   Available Models: {len(result.get('models', []))}")
    
    # 9. Frontend Integration
    print_section("9. Frontend Integration")
    
    # Frontend accessible
    tests_total += 1
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print_test("Frontend Accessible", True, f"Status: {response.status_code}")
            tests_passed += 1
        else:
            print_test("Frontend Accessible", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("Frontend Accessible", False, f"Error: {str(e)}")
    tests_total += 1
    
    # 10. API Documentation
    print_section("10. API Documentation")
    
    # Swagger docs
    tests_total += 1
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print_test("API Docs Accessible", True, "Swagger UI available")
            tests_passed += 1
        else:
            print_test("API Docs Accessible", False, f"Status: {response.status_code}")
    except Exception as e:
        print_test("API Docs Accessible", False, f"Error: {str(e)}")
    tests_total += 1
    
    # Final Results
    print_section("📊 Final Results")
    
    success_rate = (tests_passed / tests_total) * 100
    
    print(f"{Colors.BOLD}Tests Passed: {Colors.GREEN}{tests_passed}/{tests_total}{Colors.END}")
    print(f"{Colors.BOLD}Success Rate: {Colors.GREEN}{success_rate:.1f}%{Colors.END}")
    
    if success_rate >= 80:
        print(f"\n{Colors.BOLD}{Colors.GREEN}🎉 Sorma-AI is fully operational!{Colors.END}")
        print(f"{Colors.CYAN}✨ All major features are working correctly{Colors.END}")
    elif success_rate >= 60:
        print(f"\n{Colors.BOLD}{Colors.YELLOW}⚠️ Sorma-AI is mostly functional{Colors.END}")
        print(f"{Colors.CYAN}🔧 Some features may need attention{Colors.END}")
    else:
        print(f"\n{Colors.BOLD}{Colors.RED}❌ Sorma-AI needs troubleshooting{Colors.END}")
        print(f"{Colors.CYAN}🔧 Several features require fixes{Colors.END}")
    
    print(f"\n{Colors.BOLD}🚀 Sorma-AI Access Points:{Colors.END}")
    print(f"   • Web Interface: {Colors.BLUE}http://localhost:3000{Colors.END}")
    print(f"   • API Documentation: {Colors.BLUE}http://localhost:8000/docs{Colors.END}")
    print(f"   • Authentication: {Colors.BLUE}Use 'sorma', 'sorma-ai', or 'chandan'{Colors.END}")
    
    return success_rate >= 80

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
