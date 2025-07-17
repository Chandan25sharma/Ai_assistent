# Voice Interface - Text-to-Speech and Speech-to-Text
import pyttsx3
import speech_recognition as sr
from typing import Optional
import threading
import time

class VoiceManager:
    def __init__(self):
        self.tts_engine = None
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        self.is_listening = False
        self._setup_tts()
        self._setup_stt()
    
    def _setup_tts(self):
        """Setup text-to-speech engine"""
        try:
            self.tts_engine = pyttsx3.init()
            
            # Configure voice settings
            voices = self.tts_engine.getProperty('voices')
            if voices:
                # Try to use a male voice if available
                for voice in voices:
                    if 'male' in voice.name.lower() or 'david' in voice.name.lower():
                        self.tts_engine.setProperty('voice', voice.id)
                        break
            
            # Set speech rate
            self.tts_engine.setProperty('rate', 180)
            
            # Set volume
            self.tts_engine.setProperty('volume', 0.9)
            
        except Exception as e:
            print(f"TTS setup failed: {e}")
    
    def _setup_stt(self):
        """Setup speech-to-text"""
        try:
            # Adjust for ambient noise
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source)
        except Exception as e:
            print(f"STT setup failed: {e}")
    
    def speak(self, text: str, async_mode: bool = False):
        """Convert text to speech"""
        if not self.tts_engine:
            print(f"[TTS NOT AVAILABLE] {text}")
            return
        
        try:
            if async_mode:
                # Run in background thread
                thread = threading.Thread(target=self._speak_sync, args=(text,))
                thread.daemon = True
                thread.start()
            else:
                self._speak_sync(text)
        except Exception as e:
            print(f"TTS error: {e}")
    
    def _speak_sync(self, text: str):
        """Synchronous speech"""
        try:
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            print(f"Speech error: {e}")
    
    def listen(self, timeout: int = 5) -> Optional[str]:
        """Listen for speech input"""
        try:
            print("🎤 Listening...")
            with self.microphone as source:
                # Listen for audio
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=10)
            
            print("🔄 Processing speech...")
            
            # Try to recognize speech using Google
            try:
                text = self.recognizer.recognize_google(audio)
                print(f"🎤 You said: {text}")
                return text
            except sr.UnknownValueError:
                print("❌ Could not understand audio")
                return None
            except sr.RequestError as e:
                print(f"❌ Speech recognition error: {e}")
                return None
        
        except sr.WaitTimeoutError:
            print("⏰ No speech detected")
            return None
        except Exception as e:
            print(f"❌ Listen error: {e}")
            return None
    
    def listen_for_wake_word(self, wake_word: str = "hey chandan", timeout: int = 1) -> bool:
        """Listen for wake word"""
        try:
            with self.microphone as source:
                audio = self.recognizer.listen(source, timeout=timeout, phrase_time_limit=3)
            
            text = self.recognizer.recognize_google(audio)
            return wake_word.lower() in text.lower()
        
        except:
            return False
    
    def start_continuous_listening(self, callback, wake_word: str = "hey chandan"):
        """Start continuous listening in background"""
        def listen_loop():
            self.is_listening = True
            while self.is_listening:
                try:
                    if self.listen_for_wake_word(wake_word):
                        print(f"🎤 Wake word detected: {wake_word}")
                        user_input = self.listen(timeout=10)
                        if user_input:
                            callback(user_input)
                    time.sleep(0.1)
                except Exception as e:
                    print(f"Listening error: {e}")
                    time.sleep(1)
        
        thread = threading.Thread(target=listen_loop)
        thread.daemon = True
        thread.start()
    
    def stop_listening(self):
        """Stop continuous listening"""
        self.is_listening = False
    
    def is_voice_available(self) -> bool:
        """Check if voice features are available"""
        return self.tts_engine is not None
    
    def get_voice_info(self) -> dict:
        """Get voice system information"""
        if not self.tts_engine:
            return {"tts_available": False, "stt_available": False}
        
        try:
            voices = self.tts_engine.getProperty('voices')
            voice_count = len(voices) if voices else 0
            
            return {
                "tts_available": True,
                "stt_available": True,
                "voice_count": voice_count,
                "current_rate": self.tts_engine.getProperty('rate'),
                "current_volume": self.tts_engine.getProperty('volume')
            }
        except:
            return {"tts_available": False, "stt_available": False}
