<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DailyFeedback;
use App\Models\UserFeedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\ApiResponser;

class ConsultantAnalyticsController extends Controller
{
    use ApiResponser;
    /**
     * Get all appointments for the authenticated consultant
     */
    public function getMyAppointments(Request $request)
    {
        $query = Appointment::with('user:id,username,email')
            ->orderBy('appointment_date', 'desc')
            ->orderBy('appointment_time', 'desc');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $appointments = $query->get();

        return $this->successResponse($appointments);
    }

    /**
     * Update appointment status and details
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,confirmed,completed,cancelled',
            'confirmed_date' => 'nullable|date',
            'confirmed_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        return $this->successResponse($appointment->load('user:id,username,email'), 'Appointment updated successfully');
    }

    /**
     * Get aggregate student mental health data
     * Returns only aggregated data, NO individual details
     */
    public function getAggregateStudentData()
    {
        // Get category distribution from daily feedback
        $categoryDistribution = DailyFeedback::select(
            DB::raw('CASE
WHEN total_score <= 10 THEN "Normal" WHEN total_score <=20 THEN "Stres Ringan" WHEN total_score <=30 THEN "Stres Sedang"
    ELSE "Stres Berat" END as category'),
            DB::raw('COUNT(DISTINCT user_id) as count')
        )->groupBy('category')
            ->get();

        // Get mood trends (last 7 days, aggregated)
        $moodTrends = UserFeedback::select(
            DB::raw('DATE(created_at) as date'),
            'selected_mood',
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date', 'selected_mood')
            ->orderBy('date', 'asc')
            ->get();

        // Total active students (who have used any feature)
        $activeStudents = User::where('role_id', 3)
            ->where(function ($query) {
                $query->whereHas('dailyFeedbacks')
                    ->orWhereHas('userFeedbacks')
                    ->orWhereHas('appointments');
            })
            ->count();

        // Total students
        $totalStudents = User::where('role_id', 3)->count();

        return $this->successResponse([
            'category_distribution' => $categoryDistribution,
            'mood_trends' => $moodTrends,
            'active_students' => $activeStudents,
            'total_students' => $totalStudents,
        ]);
    }
}