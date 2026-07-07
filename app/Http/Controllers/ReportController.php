<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(
        protected ReportService $reportService
    ) {}

    public function index(Request $request)
    {
        $reportData = $this->reportService->getReportData(
            $request->query('start_date'),
            $request->query('end_date')
        );

        return Inertia::render('Reports/Index', $reportData);
    }
}
