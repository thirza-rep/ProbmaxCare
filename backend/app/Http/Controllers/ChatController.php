<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array'
        ]);

        $user = $request->user();
        $userMessage = $request->message;
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'message' => 'Maaf, layanan AI belum dikonfigurasi. Silakan hubungi administrator.'
            ], 500);
        }

        $lastCheck = \App\Models\DailyFeedback::where('user_id', $user->id)->orderBy('created_at', 'desc')->first();
        
        $userContext = "Nama Pengguna: {$user->username}\n";
        if ($lastCheck) {
            $userContext .= "Status Kesehatan Mental Terakhir (Cek Harian): {$lastCheck->stress_level} (Skor: {$lastCheck->total_score})\n";
        } else {
            $userContext .= "Status Kesehatan Mental Terakhir: Belum ada data.\n";
        }

        // System prompt untuk konteks aplikasi
        $systemPrompt = "Kamu adalah Probmax AI, asisten kesehatan mental khusus mahasiswa keperawatan di aplikasi ProbmaxCare. 

KONTEKS PENGGUNA SAAT INI:
{$userContext}

KONTEKS APLIKASI:
- ProbmaxCare adalah platform edukasi kesehatan mental mahasiswa keperawatan.
- Fitur: Cek Kesehatan Harian (self-assessment), PMC Game (mood tracker), Chat AI (kamu), dan Buat Janji (konseling).

ATURAN PERANMU:
1. Gunakan nama pengguna ({$user->username}) agar terasa lebih personal.
2. Jawab sesuai konteks kesehatan mental terakhir pengguna jika relevan.
3. Berikan dukungan emosional yang hangat, empati, dan profesional.
4. Sarankan fitur yang relevan: 'Cek Harian' jika ingin tahu kondisi, 'Buat Janji' jika butuh bicara dengan ahli.
5. Jangan diagnosa medis. Jawab singkat dan ramah (maks 3-4 kalimat).
6. Gunakan Bahasa Indonesia yang sopan namun tetap akrab.";

        // Prepare context/history for Gemini
        $contents = [];
        
        // Add System Prompt as the first turn (simulated via user role if needed, or just prepended)
        // Gemini 1.5 Flash supports system_instruction, but let's stick to content for stability or use systemPrompt
        
        $history = $request->history ?? [];
        foreach ($history as $msg) {
            if ($msg['sender'] === 'bot' || $msg['sender'] === 'user') {
                $contents[] = [
                    'role' => $msg['sender'] === 'bot' ? 'model' : 'user',
                    'parts' => [['text' => $msg['text']]]
                ];
            }
        }

        // Add the system prompt to the first user message if history is empty, 
        // or as a special context for the current message.
        $actualMessage = "KONTEKS SISTEM: {$systemPrompt}\n\nUser: {$userMessage}";
        
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $actualMessage]]
        ];

        try {
            // Call Gemini API
            $response = Http::timeout(40)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                [
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.8,
                        'maxOutputTokens' => 300,
                    ]
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak bisa memproses pesan Anda saat ini.';
                
                return response()->json([
                    'message' => trim($aiResponse)
                ]);
            } else {
                // Fallback to simple responses if API fails
                return response()->json([
                    'message' => $this->getFallbackResponse($userMessage)
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Gemini API Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => $this->getFallbackResponse($userMessage)
            ]);
        }
    }

    private function getFallbackResponse($message)
    {
        $message = strtolower($message);
        
        if (str_contains($message, 'halo') || str_contains($message, 'hai')) {
            return "Halo! Saya Probmax AI 🤖. Ada yang bisa saya bantu terkait kesehatan mental hari ini?";
        }
        
        if (str_contains($message, 'stres') || str_contains($message, 'tertekan')) {
            return "Saya mengerti perasaan stres bisa sangat berat. Cobalah teknik pernapasan dalam atau istirahat sejenak. Kamu juga bisa gunakan fitur 'Cek Harian' untuk memahami kondisimu lebih baik, atau 'Buat Janji' untuk konsultasi dengan profesional.";
        }
        
        if (str_contains($message, 'cemas') || str_contains($message, 'khawatir')) {
            return "Perasaan cemas itu wajar, tapi jangan biarkan menguasai dirimu. Coba fokus pada hal-hal yang bisa kamu kontrol. Fitur 'PMC Game' bisa membantu kamu tracking mood harian. Jika cemas berlanjut, pertimbangkan untuk konsultasi via 'Buat Janji'.";
        }
        
        if (str_contains($message, 'sedih') || str_contains($message, 'depresi')) {
            return "Saya turut prihatin mendengarnya. Perasaan sedih yang berkepanjangan perlu perhatian serius. Yuk gunakan fitur 'Cek Harian' untuk monitor kondisimu, dan jangan ragu untuk 'Buat Janji' konseling dengan profesional kami.";
        }
        
        if (str_contains($message, 'terima kasih') || str_contains($message, 'makasih')) {
            return "Sama-sama! Senang bisa membantu. Jangan ragu untuk chat lagi kapan saja ya 😊";
        }
        
        return "Terima kasih sudah berbagi. Saya di sini untuk mendengarkan. Kalau kamu butuh bantuan lebih lanjut, coba gunakan fitur 'Cek Harian' atau 'Buat Janji' untuk konsultasi dengan profesional.";
    }
}
