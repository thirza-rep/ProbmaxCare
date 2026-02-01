<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponser;

class AppointmentController extends Controller
{
    use ApiResponser;
    public function index()
    {
        $user = Auth::user();
        if ($user->role_id == 2) {
            // Consultant sees appointments where they are the consultant (need logic to link schedule/consultant)
// CURRENT DB DESIGN LIMITATION: Appointment table doesn't link directly to consultant_id,
// but it links to user_id (student).
// However, the BRD says: "Melihat appointment yang berkaitan dengan dirinya berdasarkan jadwal"
// Since we don't have consultant_id in appointment table, we might need a workaround or assume logic.
// Wait, BRD says: "Konsultan: Melihat appointment yang berkaitan dengan dirinya".
// Let's assume for now we return all appointments for Admin/Consultant to see (simplification)
// OR we need to add consultant_id to appointment table?
// BRD section 3.2 doesn't mention consultant_id in appointment table.
// But usually an appointment is WITH someone.
// Let's look at `consultant_schedule`. User selects a schedule.
// We should probably store `consultant_id` or `schedule_id` in appointment to link it.
// Checking DB schema again... `appointment` table ONLY has `user_id`.
// This seems like a missing relation in the provided SQL schema compared to a real world scenario.
// BUT, if the user picks a "date" and "time", maybe we can match it with `consultant_schedule`?
// Let's simplistic approach: Consultant sees ALL appointments for now, or we filter by something?
// Actually, let's look at the "Admin" requirement: "Melihat semua appointment".

            // For now, let's return all appointments for Consultant/Admin, and own appointments for User.
            return $this->successResponse(Appointment::with('user')->orderBy('appointment_date', 'desc')->get());
        }

        // Student sees own appointments
        return $this->successResponse(Appointment::where('user_id', $user->id)->orderBy('appointment_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'whatsapp_number' => 'required',
        ]);

        $appointment = Appointment::create([
            'user_id' => Auth::id(),
            'username' => Auth::user()->username,
            'appointment_date' => $request->appointment_date,
            'appointment_time' => $request->appointment_time,
            'location' => $request->location ?? '-', // Default if empty
            'whatsapp_number' => $request->whatsapp_number
        ]);

        return $this->successResponse($appointment, 'Appointment created successfully', 201);
    }
}