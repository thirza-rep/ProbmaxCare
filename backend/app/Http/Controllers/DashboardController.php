<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyFeedback;
use App\Models\UserFeedback;
use App\Models\Appointment;
use App\Models\ConsultantSchedule;
use Illuminate\Support\Facades\Auth;

use App\Traits\ApiResponser;

class DashboardController extends Controller
{
    use ApiResponser;
    // Summary for Student/User
    public function userSummary()
    {
        $userId = Auth::id();

        // Last Daily Check
        $lastDailyCheck = DailyFeedback::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        // Last Mood (PMC Game)
        $lastMood = UserFeedback::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->first();

        // Next Appointment
        $nextAppointment = Appointment::where('user_id', $userId)
            ->where('appointment_date', '>=', now()->toDateString())
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->first();

        return $this->successResponse([
            'last_daily_check' => $lastDailyCheck,
            'last_mood' => $lastMood,
            'next_appointment' => $nextAppointment
        ]);
    }

    // Summary for Consultant
    public function consultantSummary()
    {
        $consultantId = Auth::id();
        $today = now()->toDateString();
        $endOfWeek = now()->endOfWeek()->toDateString();

        // 1. Stats
        $appointmentsThisWeek = Appointment::whereBetween('appointment_date', [$today, $endOfWeek])->count();

        $nearestAppointment = Appointment::with('user:id,username')
            ->where('appointment_date', '>=', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->first();

        $activeSchedulesCount = ConsultantSchedule::where('consultant_id', $consultantId)
            ->where('date', '>=', $today)
            ->count();

        // 2. Recent Appointments
        $recentAppointments = Appointment::with('user:id,username')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // 3. Upcoming Schedules
        $upcomingSchedules = ConsultantSchedule::where('consultant_id', $consultantId)
            ->where('date', '>=', $today)
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc')
            ->limit(5)
            ->get();

        // 4. Student Analytics (Consolidated from ConsultantAnalyticsController)
        $categoryDistribution = DailyFeedback::select(
            \Illuminate\Support\Facades\DB::raw('CASE 
                WHEN total_score <= 10 THEN "Normal"
                WHEN total_score <= 20 THEN "Stres Ringan"
                WHEN total_score <= 30 THEN "Stres Sedang"
                ELSE "Stres Berat"
            END as category'),
            \Illuminate\Support\Facades\DB::raw('COUNT(DISTINCT user_id) as count')
        )
            ->groupBy('category')
            ->get();

        $moodTrends = UserFeedback::select(
            'selected_mood',
            \Illuminate\Support\Facades\DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('selected_mood')
            ->get();

        return $this->successResponse([
            'stats' => [
                'appointments_this_week' => $appointmentsThisWeek,
                'nearest_appointment' => $nearestAppointment,
                'active_schedules_count' => $activeSchedulesCount,
            ],
            'recent_appointments' => $recentAppointments,
            'upcoming_schedules' => $upcomingSchedules,
            'analytics' => [
                'category_distribution' => $categoryDistribution,
                'mood_trends' => $moodTrends,
            ]
        ]);
    }
}
