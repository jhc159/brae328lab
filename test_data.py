#!/usr/bin/env python3
"""
Test script to send angle data to the inclination angle monitor server
Demonstrates how to send data via POST and WebSocket
"""

import requests
import json
import time
import math
import argparse
from datetime import datetime
import websocket

# Configuration
DEFAULT_HOST = "localhost"
DEFAULT_PORT = 3000
DEFAULT_URL = f"http://{DEFAULT_HOST}:{DEFAULT_PORT}"
DEFAULT_WS_URL = f"ws://{DEFAULT_HOST}:{DEFAULT_PORT}"


def send_via_rest(host=DEFAULT_HOST, port=DEFAULT_PORT, data=None):
    """Send angle data via HTTP REST API"""
    if data is None:
        data = {
            "theta": 15.5,
            "psi": -22.3,
            "phi": 45.0,
            "axraw": 550,
            "ayraw": 480,
            "azraw": 600
        }
    
    url = f"http://{host}:{port}/api/angles"
    
    try:
        response = requests.post(url, json=data, timeout=5)
        print(f"✓ Status: {response.status_code}")
        print(f"✓ Response: {response.json()}")
        return True
    except requests.exceptions.ConnectionError:
        print(f"✗ Connection error: Could not reach {url}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def send_via_websocket(host=DEFAULT_HOST, port=DEFAULT_PORT, data=None, count=1):
    """Send angle data via WebSocket"""
    if data is None:
        data = {
            "theta": 0,
            "psi": 0,
            "phi": 0,
            "axraw": 512,
            "ayraw": 512,
            "azraw": 512
        }
    
    ws_url = f"ws://{host}:{port}"
    
    try:
        ws = websocket.WebSocket()
        ws.connect(ws_url)
        print(f"✓ WebSocket connected to {ws_url}")
        
        for i in range(count):
            ws.send(json.dumps(data))
            print(f"✓ Sent data #{i+1}: {data}")
            time.sleep(0.5)
        
        ws.close()
        print("✓ WebSocket closed")
        return True
    except Exception as e:
        print(f"✗ WebSocket error: {e}")
        return False


def generate_circular_motion(duration=10, interval=0.2):
    """Generate data simulating circular motion"""
    print(f"\n📊 Generating circular motion data for {duration}s...\n")
    
    start_time = time.time()
    angle = 0
    
    while time.time() - start_time < duration:
        # Simulate circular motion
        theta = 45 * math.sin(angle)
        psi = 45 * math.cos(angle)
        phi = 30 * math.sin(angle * 0.5)
        
        # Convert to raw ADC values
        axraw = int(512 + theta * 2.8)
        ayraw = int(512 + psi * 2.8)
        azraw = int(512 + phi * 2.8)
        
        # Clamp values
        axraw = max(0, min(1023, axraw))
        ayraw = max(0, min(1023, ayraw))
        azraw = max(0, min(1023, azraw))
        
        data = {
            "theta": round(theta, 2),
            "psi": round(psi, 2),
            "phi": round(phi, 2),
            "axraw": axraw,
            "ayraw": ayraw,
            "azraw": azraw
        }
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] θ={data['theta']:7.2f}° ψ={data['psi']:7.2f}° φ={data['phi']:7.2f}°")
        
        send_via_rest(data=data)
        
        angle += (interval * 2 * math.pi / duration)
        time.sleep(interval)


def generate_random_noise(duration=10, interval=0.1, max_angle=30):
    """Generate random noise data"""
    print(f"\n📊 Generating random noise data for {duration}s...\n")
    
    import random
    
    start_time = time.time()
    
    while time.time() - start_time < duration:
        theta = random.uniform(-max_angle, max_angle)
        psi = random.uniform(-max_angle, max_angle)
        phi = random.uniform(-max_angle, max_angle)
        
        # Convert to raw ADC values
        axraw = int(512 + theta * 2.8)
        ayraw = int(512 + psi * 2.8)
        azraw = int(512 + phi * 2.8)
        
        # Clamp values
        axraw = max(0, min(1023, axraw))
        ayraw = max(0, min(1023, ayraw))
        azraw = max(0, min(1023, azraw))
        
        data = {
            "theta": round(theta, 2),
            "psi": round(psi, 2),
            "phi": round(phi, 2),
            "axraw": axraw,
            "ayraw": ayraw,
            "azraw": azraw
        }
        
        print(f"[{datetime.now().strftime('%H:%M:%S')}] θ={data['theta']:7.2f}° ψ={data['psi']:7.2f}° φ={data['phi']:7.2f}°")
        
        send_via_rest(data=data)
        
        time.sleep(interval)


def check_health(host=DEFAULT_HOST, port=DEFAULT_PORT):
    """Check server health"""
    try:
        response = requests.get(f"http://{host}:{port}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Server is running")
            print(f"✓ Connected clients: {data.get('clients', 0)}")
            return True
        else:
            print(f"✗ Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print(f"✗ Could not connect to http://{host}:{port}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Test script for Inclination Angle Monitor"
    )
    parser.add_argument(
        "mode",
        choices=["single", "circular", "random", "health", "websocket"],
        help="Operation mode"
    )
    parser.add_argument(
        "--host",
        default=DEFAULT_HOST,
        help=f"Server host (default: {DEFAULT_HOST})"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=DEFAULT_PORT,
        help=f"Server port (default: {DEFAULT_PORT})"
    )
    parser.add_argument(
        "--theta",
        type=float,
        default=15.5,
        help="Theta angle in degrees (for single mode)"
    )
    parser.add_argument(
        "--psi",
        type=float,
        default=-22.3,
        help="Psi angle in degrees (for single mode)"
    )
    parser.add_argument(
        "--phi",
        type=float,
        default=45.0,
        help="Phi angle in degrees (for single mode)"
    )
    parser.add_argument(
        "--duration",
        type=float,
        default=10,
        help="Duration in seconds (for circular/random modes)"
    )
    parser.add_argument(
        "--interval",
        type=float,
        default=0.1,
        help="Update interval in seconds"
    )
    
    args = parser.parse_args()
    
    print("\n" + "="*50)
    print("  Inclination Angle Monitor - Test Tool")
    print("="*50)
    
    if args.mode == "health":
        print(f"\n🔍 Checking server health...\n")
        check_health(args.host, args.port)
    
    elif args.mode == "single":
        print(f"\n📤 Sending single data point via REST API...\n")
        data = {
            "theta": args.theta,
            "psi": args.psi,
            "phi": args.phi,
            "axraw": int(512 + args.theta * 2.8),
            "ayraw": int(512 + args.psi * 2.8),
            "azraw": int(512 + args.phi * 2.8)
        }
        send_via_rest(args.host, args.port, data)
    
    elif args.mode == "circular":
        generate_circular_motion(args.duration, args.interval)
    
    elif args.mode == "random":
        generate_random_noise(args.duration, args.interval)
    
    elif args.mode == "websocket":
        print(f"\n📤 Sending via WebSocket...\n")
        data = {
            "theta": args.theta,
            "psi": args.psi,
            "phi": args.phi,
            "axraw": int(512 + args.theta * 2.8),
            "ayraw": int(512 + args.psi * 2.8),
            "azraw": int(512 + args.phi * 2.8)
        }
        send_via_websocket(args.host, args.port, data)
    
    print("\n" + "="*50 + "\n")


if __name__ == "__main__":
    main()
