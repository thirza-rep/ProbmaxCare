<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Appointment;
use App\Models\DailyFeedback;

use App\Traits\ApiResponser;

class AdminController extends Controller
{
    use ApiResponser;

    public function stats()
    {
        return $this->successResponse([
            'total_users' => User::count(),
            'total_appointments' => Appointment::count(),
            'total_feedbacks' => DailyFeedback::count(),
            'appointments_today' => Appointment::where('appointment_date', date('Y-m-d'))->count()
        ]);
    }
}
