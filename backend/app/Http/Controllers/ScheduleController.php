<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConsultantSchedule;
use Illuminate\Support\Facades\Auth;
use App\Traits\ApiResponser;

class ScheduleController extends Controller
{
    use ApiResponser;
    public function index()
    {
        // If consultant, return own schedule. If user, return all future schedules.
        $user = Auth::user();
        if ($user->role_id == 2) { // Consultant
            return $this->successResponse(ConsultantSchedule::where('consultant_id', $user->id)
                ->orderBy('date', 'asc')
                ->get());
        }

        // For users, show all available schedules
        return $this->successResponse(ConsultantSchedule::with('consultant:id,username')
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $schedule = ConsultantSchedule::create([
            'consultant_id' => Auth::id(),
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description
        ]);

        return $this->successResponse($schedule, 'Schedule stored successfully', 201);
    }

    public function destroy($id)
    {
        $schedule = ConsultantSchedule::where('consultant_id', Auth::id())->where('id', $id)->firstOrFail();
        $schedule->delete();
        return $this->successResponse(null, 'Schedule deleted successfully');
    }
}