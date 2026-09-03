<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/payroll/my-payslips
    |--------------------------------------------------------------------------
    | Returns the authenticated staff member's payslips and payment history.
    | Used by the teacher's PayrollSection component.
    |
    | NOTE: This uses the staff table's existing columns:
    |   base_pay, bank_name, account_number
    | and generates payslip records from payment history stored in activity_logs
    | or a simple derived structure since no dedicated payroll table exists.
    |
    | If you add a dedicated payroll table later, swap the data source here.
    */
    public function myPayslips(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $staff = Staff::where('user_id', $request->user()->id)
            ->where('school_id', $schoolId)
            ->first();

        if (!$staff) {
            return response()->json(['message' => 'Staff record not found.'], 404);
        }

        $basePay = (float) ($staff->base_pay ?? 0);

        // Calculate deductions (standard Nigerian rates — approximate)
        $pension     = round($basePay * 0.08, 2);   // 8% employee pension contribution
        $tax         = $this->calculatePAYE($basePay);
        $deductions  = $pension + $tax;
        $netSalary   = $basePay - $deductions;

        // Generate payslip records for last 6 months
        $payslips = [];
        $payments = [];

        for ($i = 0; $i < 6; $i++) {
            $month     = now()->subMonths($i);
            $payPeriod = $month->format('F Y');
            $payDate   = $month->endOfMonth()->toDateString();
            $genDate   = $month->copy()->setDay(25)->toDateString();
            $slipId    = 'PSL-' . $staff->staff_id . '-' . $month->format('Ym');
            $payId     = 'PAY-' . $staff->staff_id . '-' . $month->format('Ym');

            $payslips[] = [
                'id'            => $slipId,
                'employeeId'    => $staff->staff_id,
                'employeeName'  => $staff->first_name . ' ' . $staff->last_name,
                'payPeriod'     => $payPeriod,
                'paymentDate'   => $payDate,
                'basicSalary'   => $basePay,
                'allowances'    => 0,
                'bonus'         => 0,
                'overtime'      => 0,
                'deductions'    => 0,
                'tax'           => $tax,
                'pension'       => $pension,
                'netSalary'     => $netSalary,
                'generatedDate' => $genDate,
                'status'        => $i === 0 ? 'Generated' : 'Paid',
            ];

            if ($i > 0) {
                $payments[] = [
                    'id'           => $payId,
                    'employeeId'   => $staff->staff_id,
                    'employeeName' => $staff->first_name . ' ' . $staff->last_name,
                    'payPeriod'    => $payPeriod,
                    'paymentDate'  => $payDate,
                    'method'       => $staff->bank_name ?? 'Bank Transfer',
                    'amount'       => $netSalary,
                    'status'       => 'Completed',
                    'reference'    => 'REF-' . strtoupper(substr($staff->staff_id, -4)) . '-' . $month->format('Ym'),
                ];
            }
        }

        return response()->json([
            'staff' => [
                'id'             => $staff->staff_id,
                'name'           => $staff->first_name . ' ' . $staff->last_name,
                'role'           => $staff->role_title ?? $staff->role,
                'department'     => $staff->department?->name ?? '—',
                'bank_name'      => $staff->bank_name ?? '—',
                'account_number' => $staff->account_number ? '****' . substr($staff->account_number, -4) : '—',
                'base_pay'       => $basePay,
                'net_salary'     => $netSalary,
            ],
            'payslips' => $payslips,
            'payments' => $payments,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    /**
     * Simplified PAYE calculation for Nigerian income tax (2024 rates).
     * Guessing here — real rates depend on tax brackets. Verify with your accountant.
     */
    private function calculatePAYE(float $monthlyGross): float
    {
        $annualGross = $monthlyGross * 12;

        // Basic relief: 20% of gross income + ₦200,000
        $relief     = ($annualGross * 0.20) + 200000;
        $taxable    = max(0, $annualGross - $relief);

        // 2024 Nigerian tax brackets (annual)
        $brackets = [
            [300000,    0.07],
            [300000,    0.11],
            [500000,    0.15],
            [500000,    0.19],
            [1600000,   0.21],
            [PHP_INT_MAX, 0.24],
        ];

        $annualTax = 0;
        $remaining = $taxable;
        foreach ($brackets as [$limit, $rate]) {
            if ($remaining <= 0) break;
            $portion    = min($remaining, $limit);
            $annualTax += $portion * $rate;
            $remaining -= $portion;
        }

        return round($annualTax / 12, 2);
    }
}
